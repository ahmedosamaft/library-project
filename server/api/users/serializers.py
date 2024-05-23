from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Note: the 'username' field is meant to store the user's email as our
        # library system doesn't use usernames but rather emails.
        fields = ['id', 'username', 'is_staff', 'first_name', 'last_name']
