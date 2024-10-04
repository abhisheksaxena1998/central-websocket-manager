import json
from channels.generic.websocket import AsyncWebsocketConsumer
import websockets
import asyncio

class BinanceWebSocketConsumer(AsyncWebsocketConsumer):
    connected_clients = set()  # Track connected clients
    binance_connection = None  # Hold the Binance WebSocket connection

    async def connect(self):
        # Add the user to the connected clients set
        self.connected_clients.add(self.channel_name)

        # If this is the first client, establish the Binance WebSocket connection
        if len(self.connected_clients) == 1:
            await self.connect_to_binance()

        await self.accept()

    async def disconnect(self, close_code):
        # Remove the user from the connected clients set
        self.connected_clients.remove(self.channel_name)

        # If no clients are left, close the Binance connection
        if not self.connected_clients:
            await self.close_binance_connection()

    async def connect_to_binance(self):
        # Binance WebSocket URL for a specific stream, e.g., BTC/USDT ticker
        binance_stream_url = 'wss://stream.binance.com:9443/ws/btcusdt@ticker'
        self.binance_connection = await websockets.connect(binance_stream_url)
        asyncio.create_task(self.listen_to_binance())

    async def close_binance_connection(self):
        if self.binance_connection:
            await self.binance_connection.close()

    async def listen_to_binance(self):
        try:
            while True:
                # Receive real-time data from the Binance WebSocket
                message = await self.binance_connection.recv()
                # Broadcast the message to all connected clients
                await self.send_message_to_clients(message)
        except websockets.ConnectionClosed:
            pass

    async def send_message_to_clients(self, message):
        # Send the received message to all connected clients
        for client in self.connected_clients:
            await self.channel_layer.send(client, {
                'type': 'chat.message',
                'message': message
            })

    async def chat_message(self, event):
        # This function will be called to send the message to the client
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))
