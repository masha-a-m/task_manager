from django.shortcuts import render
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets, permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from datetime import timedelta
from django.utils.timezone import now
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
from .serializers import CustomUserSerializer, TaskSerializer
from .models import Task, CustomUser
from .pagination import TaskPagination

logger = logging.getLogger(__name__)
User = get_user_model()

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = TaskPagination

    def get_queryset(self):
         tasks = Task.objects.filter(user=self.request.user).order_by('order')
         return tasks

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logger.info(f"Registration request received. Data: {request.data}")
        
        serializer = CustomUserSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            logger.debug("Creating user...")
            user = CustomUser.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            logger.info(f"User created successfully: {user}")

            refresh = RefreshToken.for_user(user)
            response_data = {
                "user": CustomUserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }
            logger.debug(f"Returning response: {response_data}")
            
            return Response(
                response_data,
                status=status.HTTP_201_CREATED,
                headers={"Content-Type": "application/json"}
            )

        except Exception as e:
            logger.error(f"Registration failed: {str(e)}", exc_info=True)
            return Response(
                {"error": "Registration failed. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(email=email, password=password)
        if not user:
            return Response(
                {"error": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })

class VerifyEmailView(APIView):
    def get(self, request, token):
        user = get_object_or_404(CustomUser, verification_token=token)
        user.email_verified = True
        user.verification_token = None
        user.save()
        return Response({"detail": "Email verified successfully."})

class UserStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # is_new_user = not request.user.has_completed_onboarding
        return Response({
            # 'is_new_user': is_new_user,
            'username': request.user.username,
            'email': request.user.email
        })


class CompleteOnboardingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.has_completed_onboarding = True
        request.user.save()
        return Response({'status': 'onboarding completed'})



class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'username': request.user.username,
            'email': request.user.email
        })


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def reorder_tasks(request):
    task_order = request.data.get('task_order')
    if not task_order:
        return Response({'error': 'No task order provided'}, status=400)

    try:
        tasks = {
            task.id: task for task in 
            Task.objects.filter(id__in=[item['id'] for item in task_order], user=request.user)
        }
        
        for item in task_order:
            task = tasks.get(item['id'])
            if task:
                task.order = item['order']
                task.save()

        return Response({'status': 'Order updated'})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_tasks(request):
    soon = now() + timedelta(hours=24)
    tasks = Task.objects.filter(
        user=request.user, 
        completed=False, 
        due_date__lte=soon
    ).order_by('due_date')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)