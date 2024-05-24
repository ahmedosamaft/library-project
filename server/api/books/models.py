import datetime
from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    category = models.CharField(max_length=255, default='Unknown')
    publication_year = models.PositiveIntegerField()
    description = models.TextField(null=True, blank=True)
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    no_of_copies = models.PositiveIntegerField(default=1)
    def __str__(self):
        return self.title

class BorrowedList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrowed_time = models.DateTimeField(auto_now_add=True)
    due_time = models.DateTimeField()
    returned = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Set due time to 30 days from the borrowing time
        if not self.id:
            self.due_time = datetime.datetime.now() + datetime.timedelta(days=30)
        super(BorrowedList, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"
