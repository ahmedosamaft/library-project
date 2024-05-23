from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import AccessToken


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


class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        attrs = super().validate(attrs)
        return { 'user': UserSerializer(self.user).data, **attrs }


class UserTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        attrs = super().validate(attrs)
        access = AccessToken(attrs['access'])
        user_id = access['user_id']
        user = User.objects.get(id=user_id)
        return { 'user': UserSerializer(user).data, **attrs }
