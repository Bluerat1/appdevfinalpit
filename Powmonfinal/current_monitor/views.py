from rest_framework import generics
from rest_framework.response import Response
from .models import CurrentReading
from .serializers import CurrentReadingSerializer
from .authentication import ESP32TokenAuth
from rest_framework.permissions import AllowAny



class CreateCurrentReadingView(generics.CreateAPIView):
    queryset = CurrentReading.objects.all()
    serializer_class = CurrentReadingSerializer
    authentication_classes = [ESP32TokenAuth]
    permission_classes = [AllowAny]

class LatestCurrentReadingView(generics.RetrieveAPIView):
    def get(self, request):
        latest = CurrentReading.objects.latest('timestamp')
        serializer = CurrentReadingSerializer(latest)
        return Response(serializer.data)

class ListCurrentReadingsView(generics.ListAPIView):
    queryset = CurrentReading.objects.all().order_by('-timestamp')
    serializer_class = CurrentReadingSerializer
