from rest_framework import serializers
from .models import CurrentReading

class CurrentReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentReading
        fields = '__all__'
