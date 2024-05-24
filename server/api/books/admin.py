from django.contrib import admin

from .models import Book, BorrowedList

admin.site.register(Book)
admin.site.register(BorrowedList)
