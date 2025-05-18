from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings

class ESP32TokenAuth(BaseAuthentication):
    def authenticate(self, request):
        token = request.headers.get('X-ESP32-TOKEN')
        if not token:
            raise AuthenticationFailed('No token provided')

        if token != settings.ESP32_AUTH_TOKEN:
            raise AuthenticationFailed('Invalid token')

        return (None, None)
