from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import current_user, register

urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('current/', current_user, name='current_user'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('register/', register, name='register')
]
