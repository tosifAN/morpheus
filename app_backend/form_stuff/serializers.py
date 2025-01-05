from rest_framework import serializers
from django.utils import timezone
from .models import Form, Question, Response, Answer

class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Question model.
    Handles serialization and deserialization of question data.
    """
    class Meta:
        model = Question
        fields = [
            'id',
            'form',
            'text',
            'question_type',
            'options',
            'order',
            'is_required',
            'help_text'
        ]

class AnswerSerializer(serializers.ModelSerializer):
    """
    Serializer for the Answer model.
    Handles validation and creation of answers.
    """
    class Meta:
        model = Answer
        fields = ['question', 'text_answer']

class ResponseSerializer(serializers.ModelSerializer):
    """
    Serializer for the Response model.
    Handles nested answers during creation.
    """
    answers = AnswerSerializer(many=True, write_only=True)
    class Meta:
        model = Response
        fields = [
            'id',
            'form',
            'submitted_by',
            'submitted_at',
            'ip_address',
            'user_agent',
            'answers'
        ]
    def create(self, validated_data):
        """
        Override create method to handle nested answers.
        """
        answers_data = validated_data.pop('answers')
        response = Response.objects.create(**validated_data)
        for answer_data in answers_data:
            Answer.objects.create(response=response, **answer_data)
        return response


class FormSerializer(serializers.ModelSerializer):
    """
    Serializer for the Form model.
    Handles form creation and validation.
    """
    questions = QuestionSerializer(many=True, read_only=True)
    created_by_username = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Form
        fields = [
            'id',
            'title',
            'description',
            'status',
            'deadline',
            'created_by',
            'created_by_username',
            'created_at',
            'questions'
        ]
        read_only_fields = [
            'created_by',
            'created_by_username',
            'created_at'
        ]

    def validate(self, data):
        """
        Validate form data.
        """
        # Validate status changes
        if data.get('status') == Form.PUBLISHED:
            if not self.instance or not self.instance.questions.exists():
                raise serializers.ValidationError(
                    "Cannot publish a form without any questions."
                )
        
        # Validate deadline
        if data.get('deadline') and data.get('deadline') < timezone.now():
            raise serializers.ValidationError(
                "Deadline cannot be in the past."
            )
        
        return data

    def create(self, validated_data):
        """
        Assign the current user as the creator of the form.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        return super().create(validated_data)


class FormDetailSerializer(FormSerializer):
    """
    Serializer for detailed form view, including responses.
    """
    responses = ResponseSerializer(many=True, read_only=True)

    class Meta(FormSerializer.Meta):
        fields = FormSerializer.Meta.fields + ['responses']
