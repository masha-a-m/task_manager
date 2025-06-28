from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Task, CustomUser
from datetime import timedelta
from django.utils import timezone

# Define the URLs
REGISTER_URL = reverse('register')
TASKS_URL = reverse('task-list')


def get_token(client, email, password):
    """Helper function to get JWT token"""
    res = client.post(reverse('token_obtain_pair'), {'username': email, 'password': password}, format='json')
    return res.data['access']


class TaskApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create user
        self.user = CustomUser.objects.create_user(
            username='testuser',
            password='testpass123'
        )

        # Login user
        self.token = get_token(self.client, 'testuser', 'testpass123')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_create_task(self):
        """Test creating a task with authenticated user"""
        payload = {
            'title': 'New task',
            'completed': False,
            'order': 0
        }
        res = self.client.post(TASKS_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        task = Task.objects.get(id=res.data['id'])
        self.assertEqual(task.user, self.user)
        self.assertEqual(task.title, payload['title'])

    def test_retrieve_tasks(self):
        """Test retrieving tasks for logged-in user"""
        Task.objects.create(user=self.user, title='Task 1', order=0)
        Task.objects.create(user=self.user, title='Task 2', order=1)

        res = self.client.get(TASKS_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

    def test_complete_task(self):
        """Test updating a task to completed"""
        task = Task.objects.create(user=self.user, title='Task to complete', order=0)
        url = reverse('task-detail', args=[task.id])
        payload = {'completed': True}

        res = self.client.patch(url, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        task.refresh_from_db()
        self.assertTrue(task.completed)

    def test_delete_task(self):
        """Test deleting a task"""
        task = Task.objects.create(user=self.user, title='Task to delete', order=0)
        url = reverse('task-detail', args=[task.id])

        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Task.DoesNotExist):
            task.refresh_from_db()

    def test_reorder_tasks(self):
        """Test reorder multiple tasks"""
        task1 = Task.objects.create(user=self.user, title='Task 1', order=0)
        task2 = Task.objects.create(user=self.user, title='Task 2', order=1)

        reorder_url = reverse('reorder_tasks')
        payload = {
            "task_order": [
                {"id": task1.id, "order": 1},
                {"id": task2.id, "order": 0}
            ]
        }

        res = self.client.patch(reorder_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        task1.refresh_from_db()
        task2.refresh_from_db()
        self.assertEqual(task1.order, 1)
        self.assertEqual(task2.order, 0)

    def test_upcoming_tasks(self):
        """Test fetching upcoming tasks (due within 24 hours)"""
        soon = timezone.now() + timedelta(hours=12)
        later = timezone.now() + timedelta(days=2)

        Task.objects.create(user=self.user, title='Due Soon', due_date=soon, order=0)
        Task.objects.create(user=self.user, title='Due Later', due_date=later, order=1)

        upcoming_url = reverse('upcoming_tasks')
        res = self.client.get(upcoming_url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['title'], 'Due Soon')