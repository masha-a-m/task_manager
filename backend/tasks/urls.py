from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, RegisterView, reorder_tasks, upcoming_tasks, VerifyEmailView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('reorder/', reorder_tasks, name='reorder_tasks'),
    path('upcoming/', upcoming_tasks, name='upcoming_tasks'),
    path('verify-email/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),


]