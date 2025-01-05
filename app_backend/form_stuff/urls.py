from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FormViewSet,
    QuestionViewSet,
    ResponseViewSet,
    AnswerViewSet,
    AnalyticsView,
    FormResponsesView,
    FormQuestionsView
)

router = DefaultRouter()
router.register(r'forms', FormViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'responses', ResponseViewSet)
router.register(r'answers', AnswerViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Prefix with /api/ to group all the API endpoints

    path('response_analytics/<int:form_id>/', AnalyticsView.as_view(), name='analytics'),
    path('form_responses/<int:form_id>/', FormResponsesView.as_view(), name='form-responses'),
    path('form_questions/<int:form_id>/', FormQuestionsView.as_view(), name='form-questions'),
]
