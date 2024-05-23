from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Note: the 'username' field is meant to store the user's email as our
        # library system doesn't use usernames but rather emails.
        fields = ['id', 'username', 'password', 'is_staff', 'first_name', 'last_name']
        extra_kwargs = { 'password': { 'write_only': True } }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance
