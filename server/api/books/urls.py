from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = [
    path('', views.book_list_create, name='index'),
    path('<int:book_id>/', views.book_detail_update_delete, name='detail'),
    path('<int:book_id>/borrow/', views.borrow_book, name='borrowed_books'),
    path('borrowed/', views.get_borrowed_books, name='get_borrowed_books'),
    path('<int:id>/return/', views.return_book, name='return_book'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)