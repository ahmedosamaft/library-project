from django.urls import path
from .views import current_user, register, UserTokenObtainPairView, UserTokenRefreshView

urlpatterns = [
    path('token/refresh/', UserTokenRefreshView.as_view(), name='token_refresh'),
    path('current/', current_user, name='current_user'),
    path('login/', UserTokenObtainPairView.as_view(), name='login'),
    path('register/', register, name='register')
]
