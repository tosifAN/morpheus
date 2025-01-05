from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class Form(models.Model):
    """
    Represents a form created by an admin user.
    """
    DRAFT = 'draft'
    PUBLISHED = 'published'
    CLOSED = 'closed'

    STATUS_CHOICES = [
        (DRAFT, 'Draft'),
        (PUBLISHED, 'Published'),
        (CLOSED, 'Closed'),
    ]

    title = models.CharField(max_length=200, help_text="Enter the form title")
    description = models.TextField(blank=True, null=True, help_text="Form description")
    created_by = models.ForeignKey(
        User, 
        related_name='forms', 
        null=True, 
        blank=True, 
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=DRAFT
    )
    deadline = models.DateTimeField(
        null=True, 
        blank=True, 
        help_text="Optional deadline for form submission"
    )

    def __str__(self):
        return self.title

    def question_count(self):
        return self.questions.count()

    def clean(self):
        # Ensure no more than 100 questions per form
        # Ensure the instance is already saved before checking the question count
        if self.pk:  # Check if the instance has a primary key
            if self.question_count() > 100:
              raise ValidationError("A form cannot have more than 100 questions.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Question(models.Model):
    """
    Represents a question within a form.
    """
    TEXT = 'text'
    DROPDOWN = 'dropdown'
    CHECKBOX = 'checkbox'

    QUESTION_TYPES = [
        (TEXT, 'Text'),
        (DROPDOWN, 'Dropdown'),
        (CHECKBOX, 'Checkbox'),
    ]

    form = models.ForeignKey(
        Form, 
        related_name='questions', 
        on_delete=models.CASCADE
    )
    text = models.CharField(
        max_length=500, 
        help_text="Enter the question text"
    )
    question_type = models.CharField(
        max_length=20, 
        choices=QUESTION_TYPES
    )
    options = models.JSONField(
        blank=True, 
        null=True, 
        help_text="Comma-separated options for Dropdown or Checkbox questions"
    )
    order = models.PositiveIntegerField(
        default=0, 
        help_text="Order of the question in the form"
    )
    is_required = models.BooleanField(
        default=False,
        help_text="Whether this question requires an answer"
    )
    help_text = models.TextField(
        blank=True, 
        null=True,
        help_text="Additional help text for respondents"
    )

    class Meta:
        ordering = ['order']
        constraints = [
            models.UniqueConstraint(
                fields=['form', 'order'], 
                name='unique_question_order_per_form'
            )
        ]

    def __str__(self):
        return f"{self.text} ({self.get_question_type_display()})"

    def clean(self):
        """
        Validation for question data based on type.
        """
        if self.question_type == self.TEXT and self.options:
            raise ValidationError("options are not allowed for Text questions.")

    def save(self, *args, **kwargs):
        # Clear options for Text questions
        if self.question_type == self.TEXT:
          self.options = None
        self.clean()
        super().save(*args, **kwargs)


class Response(models.Model):
    """
    Represents a user's response to a form.
    """
    form = models.ForeignKey(
        Form, 
        related_name='responses', 
        on_delete=models.CASCADE
    )
    submitted_by = models.ForeignKey(
        User,
        related_name='form_responses',
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(
        null=True, 
        blank=True,
        help_text="IP address of the respondent"
    )
    user_agent = models.TextField(
        null=True, 
        blank=True,
        help_text="Browser user agent information"
    )

class Answer(models.Model):
    """
    Represents an answer to a question in a form.
    """
    response = models.ForeignKey(
        Response, 
        related_name='answers', 
        on_delete=models.CASCADE
    )
    question = models.ForeignKey(
        Question, 
        related_name='answers', 
        on_delete=models.CASCADE
    )
    text_answer = models.JSONField(
        blank=True, 
        null=True, 
        help_text="Answer text for Text questions"
    )
    selected_options = models.JSONField(
        blank=True, 
        null=True, 
        help_text="Selected options for Dropdown or Checkbox questions"
    )
