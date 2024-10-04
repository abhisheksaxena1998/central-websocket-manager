from django.urls import re_path
from .consumers import BinanceWebSocketConsumer  # Update to the new consumer name

websocket_urlpatterns = [
    re_path(r'ws/application/websocket-manager/$', BinanceWebSocketConsumer.as_asgi()),  # Update consumer class name here
]
