from django.shortcuts import render, get_object_or_404
from drf_yasg.utils import swagger_auto_schema

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from collections import Counter
import logging

# Models
from .models import Form, Question, Answer
from .models import Response as FormResponse  # Rename the model Response


# Serializers
from .serializers import FormSerializer, QuestionSerializer, ResponseSerializer, AnswerSerializer

# Logging
logger = logging.getLogger("django.utils.autoreload")


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You have access!"})

class HelloWorldView(APIView):
    @swagger_auto_schema(
        operation_description="Say Hello to the World",
        responses={200: "Success"},
    )
    def get(self, request):
        return Response({"message": "Hello, World!"})

class FormViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing form instances.

    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions for Form objects.

    Attributes:
        permission_classes (list): Specifies that any user can access this viewset.
        queryset (QuerySet): The base queryset for retrieving Form objects.
        serializer_class (Serializer): The serializer class for Form objects.
    """

    permission_classes = [AllowAny]
    queryset = Form.objects.all()
    serializer_class = FormSerializer

    def perform_create(self, serializer):
        """
        Performs the creation of a new Form instance.

        This method is called when a new Form is being created. It automatically
        sets the 'created_by' field to the current authenticated user.

        Args:
            serializer (FormSerializer): The serializer instance containing the validated data.

        Returns:
            None
        """
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        """
        Get the list of Form items for the authenticated user.

        This method overrides the default queryset to return only the Forms
        created by the current authenticated user.

        Returns:
            QuerySet: A filtered queryset containing Form objects created by the current user.
        """
        return Form.objects.filter()



# Question Viewset
class QuestionViewSet(viewsets.ModelViewSet):
    """
    A viewset for handling Question objects.

    This viewset provides CRUD operations for Question objects.
    It requires authentication for all operations.
    """
    permission_classes = [IsAuthenticated]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def create(self, request, *args, **kwargs):
        """
        Create one or multiple Question objects.

        This method overrides the default create method to handle both single and bulk creation of Question objects.

        Parameters:
        - request (Request): The HTTP request object.
        - *args: Variable length argument list.
        - **kwargs: Arbitrary keyword arguments.

        Returns:
        - Response: A Response object containing the created data and appropriate status code.
          - If successful, returns HTTP 201 CREATED with the serialized data.
          - If invalid, returns HTTP 400 BAD REQUEST with error details.
          - For non-list data, delegates to the superclass create method.
        """
        if isinstance(request.data, list):  # Check if data is a list
            serializer = self.get_serializer(data=request.data, many=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)


# Response Viewset
class ResponseViewSet(viewsets.ModelViewSet):
    """
    A viewset for handling Response objects.

    This viewset provides CRUD operations for Response objects.
    It allows access to all users and can filter responses by form ID.

    Attributes:
        permission_classes (list): Specifies that any user can access this viewset.
        queryset (QuerySet): The base queryset for retrieving Response objects.
        serializer_class (Serializer): The serializer class for Response objects.
    """
    permission_classes = [AllowAny]
    queryset = FormResponse.objects.all()
    serializer_class = ResponseSerializer

    def get_queryset(self):
        """
        Get the queryset of Response objects, optionally filtered by form ID.

        This method overrides the default queryset to optionally filter Response objects
        based on the 'form' query parameter in the request.

        Returns:
            QuerySet: A queryset of Response objects, potentially filtered by form ID.
        """
        queryset = super().get_queryset()
        form_id = self.request.query_params.get('form')  # Get the 'form' query parameter
        if form_id is not None:
            queryset = queryset.filter(form_id=form_id)  # Filter by form ID
        return queryset

    
# Answer Viewset
class AnswerViewSet(viewsets.ModelViewSet):
    """
    A viewset for handling Answer objects.

    This viewset provides CRUD operations for Answer objects.
    It allows access to all users and can filter answers by response ID.

    Attributes:
        permission_classes (list): Specifies that any user can access this viewset.
        queryset (QuerySet): The base queryset for retrieving Answer objects.
        serializer_class (Serializer): The serializer class for Answer objects.
    """
    permission_classes = [AllowAny]
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

    def get_queryset(self):
        """
        Get the queryset of Answer objects, optionally filtered by response ID.

        This method overrides the default queryset to optionally filter Answer objects
        based on the 'response' query parameter in the request.

        Returns:
            QuerySet: A queryset of Answer objects, potentially filtered by response ID.
        """
        queryset = super().get_queryset()
        response_id = self.request.query_params.get('response')
        if response_id is not None:
            queryset = queryset.filter(response_id=response_id)
        return queryset

    
# Form Creation View
class FormCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        serializer = FormSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Admin Forms View
class AdminFormsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        forms = Form.objects.filter(created_by=request.user)
        serializer = FormSerializer(forms, many=True)
        return Response(serializer.data)


# Admin Create Form View
class AdminCreateFormView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Add form creation logic here
        return Response({"message": "Form creation endpoint!"})



# Form Creation View
class FormCreateView(APIView):
     permission_classes = [IsAuthenticated]

     def post(self, request):
         """
         Handle the creation of a new form instance for the authenticated user.

         This method processes a POST request to create a new form. It automatically
         assigns the form to the authenticated user who is making the request.

         Parameters:
         request (Request): The HTTP request object containing the form data.
                            Expected to have a 'data' attribute with the form details.

         Returns:
         Response: A Django Rest Framework Response object.
                   - If the form is successfully created, returns a 201 CREATED status
                     with the serialized form data.
                   - If there are validation errors, returns a 400 BAD REQUEST status
                     with error details.
         """
         data = request.data.copy()
         data['created_by'] = request.user.id
         serializer = FormSerializer(data=data)
         if serializer.is_valid():
             serializer.save()
             return Response(serializer.data, status=status.HTTP_201_CREATED)
         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Admin Forms View
class AdminFormsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve all forms created by the authenticated admin user.

        This method processes a GET request to fetch all forms that have been
        created by the currently authenticated user. It serializes the form data
        and returns it in the response.

        Parameters:
        request (Request): The HTTP request object containing metadata about the request.

        Returns:
        Response: A Django Rest Framework Response object containing the serialized
                  form data for all forms created by the authenticated user.
        """
        forms = Form.objects.filter(created_by=request.user)  # Filter forms by admin user
        serializer = FormSerializer(forms, many=True)
        return Response(serializer.data)


# Form Questions View
class FormQuestionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, form_id):
        """
        Retrieve all questions associated with a specific form.

        This method processes a GET request to fetch all questions that belong
        to the form identified by the provided form_id. It serializes the question
        data and returns it in the response.

        Parameters:
        request (Request): The HTTP request object containing metadata about the request.
        form_id (int): The ID of the form for which questions are to be retrieved.

        Returns:
        Response: A Django Rest Framework Response object containing the serialized
                  question data for the specified form.
                  - If questions are found, returns a 200 OK status with the serialized data.
                  - If no questions are found, returns a 404 NOT FOUND status with an error message.
        """
        try:
            questions = Question.objects.filter(form_id=form_id)
            serializer = QuestionSerializer(questions, many=True)
            return Response(serializer.data)
        except Question.DoesNotExist:
            return Response(
                {"detail": "No questions found for this form."}, 
                status=status.HTTP_404_NOT_FOUND
            )

# Analytics View
class AnalyticsView(APIView):
    """
    A view for retrieving analytics data for a specific form.

    This view processes GET requests to generate analytics for a form identified
    by the provided form_id. It calculates and returns the most common answers
    for each question type (text, checkbox, dropdown) within the form.

    Attributes:
        permission_classes (list): Specifies that only authenticated users can access this view.
    """
    permission_classes = [AllowAny]

    def get(self, request, form_id):
        """
        Retrieve analytics data for a specific form created by the authenticated user.

        This method processes a GET request to generate analytics for the form identified
        by the provided form_id. It calculates and returns the most common answers for
        each question type (text, checkbox, dropdown) within the form.

        Parameters:
        request (Request): The HTTP request object containing metadata about the request.
        form_id (int): The ID of the form for which analytics are to be retrieved.

        Returns:
        Response: A Django Rest Framework Response object containing the analytics data.
                  - If the form is found and analytics are generated, returns a 200 OK status
                    with the analytics data.
                  - If the form is not found, returns a 404 NOT FOUND status with an error message.
        """
        try:
            form = get_object_or_404(Form, id=form_id)
            responses = FormResponse.objects.filter(form_id=form_id)
            analytics = {}
     
            questions = Question.objects.filter(form_id=form_id)
            for question in questions:
                if question.question_type == 'text':
                    answers = Answer.objects.filter(question=question)
                    words = [word.lower() for answer in answers 
                            for word in answer.text_answer.split() if len(word) >= 5]
                    word_count = Counter(words)
                    top_words = word_count.most_common(5)
                    others = sum([count for word, count in word_count.items() 
                                if word not in dict(top_words)])

                    analytics[question.id] = {
                        'type': question.question_type,
                        'data': {
                            'top_words': [
                                {'word': word, 'count': count} 
                                for word, count in top_words
                            ],
                            'others': others
                        }
                    }

                elif question.question_type == 'checkbox':
                    answers = Answer.objects.filter(question=question)
                    
                    option_combinations = [
                        tuple(sorted(answer.text_answer)) 
                        for answer in answers
                    ]
                    combo_count = Counter(option_combinations)
                    top_combos = combo_count.most_common(5)
                    others = sum([count for combo, count in combo_count.items() 
                                if combo not in dict(top_combos)])

                    analytics[question.id] = {
                        'type': question.question_type,
                        'data': {
                            'top_combos': [
                                {'combination': combo, 'count': count} 
                                for combo, count in top_combos
                            ],
                            'others': others
                        }
                    }


                elif question.question_type == 'dropdown':
                    answers = Answer.objects.filter(question=question)
                    options = [answer.text_answer for answer in answers]
                    option_count = Counter(options)
                    top_options = option_count.most_common(5)
                    others = sum([count for option, count in option_count.items() 
                                if option not in dict(top_options)])

                    analytics[question.id] = {
                        'type': question.question_type,
                        'data': {
                            'top_options': [
                                {'option': option, 'count': count} 
                                for option, count in top_options
                            ],
                            'others': others
                        }
                    }

            return Response(analytics, status=status.HTTP_200_OK)
        except Form.DoesNotExist:
            return Response(
                {"detail": "Form not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

# Form Responses View
class FormResponsesView(APIView):
    """
    A view for retrieving all responses associated with a specific form.

    This view processes GET requests to fetch all responses that belong
    to the form identified by the provided form_id. It requires the user
    to be authenticated.

    Attributes:
        permission_classes (list): Specifies that only authenticated users can access this view.
    """
    permission_classes = [AllowAny]

    def get(self, request, form_id):
        """
        Retrieve all responses associated with a specific form.

        This method processes a GET request to fetch all responses that belong
        to the form identified by the provided form_id. It serializes the response
        data and returns it in the response.

        Parameters:
        request (Request): The HTTP request object containing metadata about the request.
        form_id (int): The ID of the form for which responses are to be retrieved.

        Returns:
        Response: A Django Rest Framework Response object containing the serialized
                  response data for the specified form.
                  - If responses are found, returns a 200 OK status with the serialized data.
                  - If the form is not found, returns a 404 NOT FOUND status with an error message.
        """
        try:
            form = Form.objects.get(id=form_id)
            responses = FormResponse.objects.filter(form=form)
            serializer = ResponseSerializer(responses, many=True)
            return Response(serializer.data)
        except Form.DoesNotExist:
            return Response(
                {"detail": "Form not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

