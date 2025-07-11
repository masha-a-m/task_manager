from rest_framework import serializers
from .models import Task, CustomUser  # Removed get_user_model since you're importing CustomUser directly

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,  # Add password complexity requirements
        style={'input_type': 'password'}  # Better frontend handling
    )

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}  # Enforce email requirement
        }

    def validate_username(self, value):
        """Ensure username doesn't contain special characters"""
        if not value.isalnum():
            raise serializers.ValidationError("Username can only contain letters and numbers.")
        return value

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)

class TaskSerializer(serializers.ModelSerializer):
    due_date = serializers.DateTimeField(required=False, allow_null=True)
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'completed', 'due_date', 'order']

        read_only_fields = ['id', 'order']  # Prevent manual ID/order assignment

    def validate_title(self, value):
        """Ensure title isn't empty"""
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value