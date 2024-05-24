from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializer import *
from .models import Book, BorrowedList
from users.permissions import IsAdminOrReadonly


@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrReadonly])
def book_list_create(request):
    if request.method == 'GET':
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        print(request.data)
        genres_string = request.data.pop('genres', None)[0]
        genres = []
        if genres_string:
            genres_ids = [int(genre_id) for genre_id in genres_string.split(' ')]
            for genre_id in genres_ids:
                try:
                    genre = Genre.objects.get(pk=genre_id)
                    genres.append(genre)
                except Genre.DoesNotExist:
                    return Response({'error': f'Genre with ID {genre_id} does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            book = serializer.save()
            if genres:
                book.genres.set(genres)
            if 'cover_image' in request.FILES:
                book.cover_image = request.FILES['cover_image']
                book.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT','DELETE'])
@permission_classes([IsAdminOrReadonly])
def book_detail_update_delete(request, book_id):
    try:
        book = Book.objects.get(pk=book_id)
    except Book.DoesNotExist:
        return Response({'error': 'Book does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BookSerializer(book)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            if 'cover_image' in request.FILES:
                book.cover_image = request.FILES['cover_image']
                book.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def borrow_book(request, book_id):
    try:
        book = Book.objects.get(pk=int(book_id))
    except Book.DoesNotExist:
        return Response({'error': 'Book does not exist'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if request.method == 'POST':
        if book.no_of_copies > 0:
            book.no_of_copies -= 1
            book.save()
            borrowed_list_entry = BorrowedList.objects.create(user=user, book=book)
            return Response({'message': 'Book borrowed successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No available copies of the book'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_borrowed_books(request):
    user = request.user
    borrowed_books = BorrowedList.objects.filter(user=user)
    serializer = BorrowedListSerializer(borrowed_books, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def return_book(request, id):
    try:
        borrowed_entry = BorrowedList.objects.get(pk=id)
    except BorrowedList.DoesNotExist:
        return Response({'error': 'Borrowed entry does not exist'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if request.method == 'POST':
        if borrowed_entry.user == user:
            borrowed_entry.book.no_of_copies += 1
            borrowed_entry.returned = True
            borrowed_entry.book.save()
            borrowed_entry.save()
            return Response({'message': 'Book returned successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'You are not authorized to return this book'}, status=status.HTTP_403_FORBIDDEN)
