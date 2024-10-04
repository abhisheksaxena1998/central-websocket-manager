# Central WebSocket Manager

This project implements a WebSocket server that connects to a Bitcoin price service, allowing clients to receive real-time updates on Bitcoin prices. The server maintains a single WebSocket connection to the external Bitcoin price service and broadcasts the received messages to all connected clients.

## Overview

- **Single Active WebSocket Connection**: The server establishes only one active WebSocket connection to the Bitcoin price service, no matter how many users connect to `ws://localhost:8000/ws/application/websocket-manager/`.
- **Message Broadcasting**: When the server receives messages from the Bitcoin price service, it broadcasts these messages to all connected clients, ensuring they receive real-time updates without the need for multiple connections.

## Running the Server

To run the WebSocket server, use the following command:

```bash
daphne -p 8000 websocket_manager.asgi:application
```

To test this:

Paste below code in console.

````const socket = new WebSocket('ws://localhost:8000/ws/application/websocket-manager/');
socket.onopen = function() { console.log("Connection opened"); };
socket.onmessage = function(event) { console.log("Message from server:", event.data); };
socket.onerror = function(error) { console.log("Error:", error); };
socket.onclose = function() { console.log("Connection closed"); };```
````
