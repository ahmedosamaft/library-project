from rest_framework import serializers
from .models import Book, BorrowedList , Genre
from django.contrib.auth.models import User

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    cover_image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = Book
        fields = '__all__'

class BorrowedListSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    class Meta:
        model = BorrowedList
        fields = '__all__'

