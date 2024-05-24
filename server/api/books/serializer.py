from rest_framework import serializers
from .models import Book, BorrowedList

class BookSerializer(serializers.ModelSerializer):
    cover_image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = Book
        fields = '__all__'

class BorrowedListSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    class Meta:
        model = BorrowedList
        fields = '__all__'

