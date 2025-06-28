from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from datetime import timedelta
from django.utils.timezone import now
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from .serializers import CustomUserSerializer
from .models import Task
from .models import CustomUser
from .serializers import TaskSerializer
from .pagination import TaskPagination


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    # queryset = Task.objects.all()  # ← Add this line
    pagination_class = TaskPagination



    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('order')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"user": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    def get(self, request, token):
        user = get_object_or_404(CustomUser, verification_token=token)
        user.email_verified = True
        user.verification_token = None
        user.save()
        return Response({"detail": "Email verified successfully."})

        

@api_view(['PATCH'])
def reorder_tasks(request):
    task_order = request.data.get('task_order')  # List of {id: x, order: y}
    if not task_order:
        return Response({'error': 'No task order provided'}, status=400)

    task_ids = [item['id'] for item in task_order]
    tasks = {task.id: task for task in Task.objects.filter(id__in=task_ids)}

    for item in task_order:
        task = tasks[item['id']]
        task.order = item['order']
        task.save()

    return Response({'status': 'Order updated'})


@api_view(['GET'])
def upcoming_tasks(request):
    soon = now() + timedelta(hours=24)
    tasks = Task.objects.filter(user=request.user, completed=False, due_date__lte=soon).order_by('due_date')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)