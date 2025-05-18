from django.urls import path
from .views import CreateCurrentReadingView, LatestCurrentReadingView, ListCurrentReadingsView

urlpatterns = [
    path('current/', CreateCurrentReadingView.as_view(), name='create-current'),
    path('current/latest/', LatestCurrentReadingView.as_view(), name='latest-current'),
    path('current/all/', ListCurrentReadingsView.as_view(), name='all-current'),
]
