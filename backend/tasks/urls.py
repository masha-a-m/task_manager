from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TaskViewSet,
    RegisterView,
    LoginView,  # Added the new LoginView
    reorder_tasks,
    upcoming_tasks,
    VerifyEmailView,
    UserStatusView,
    CurrentUserView,
    CompleteOnboardingView,
)

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    # Authentication Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),  # New login endpoint

    
    # Task Management Endpoints
    path('', include(router.urls)),
    path('reorder/', reorder_tasks, name='reorder_tasks'),
    path('upcoming/', upcoming_tasks, name='upcoming_tasks'),
    path('api/user/', CurrentUserView.as_view(), name='current-user'),
    path('api/user-status/', UserStatusView.as_view(), name='user-status'),  # Keep this consistent with frontend
    path('api/complete-onboarding/', CompleteOnboardingView.as_view(), name='complete-onboarding'),
    path('user/', CurrentUserView.as_view(), name='current-user'),
    
    # Email Verification
    path('verify-email/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),
    
]