command to run server

daphne -p 8000 websocket_manager.asgi:application

const socket = new WebSocket('ws://localhost:8000/ws/application/websocket-manager/');
socket.onopen = function() { console.log("Connection opened"); };
socket.onmessage = function(event) { console.log("Message from server:", event.data); };
socket.onerror = function(error) { console.log("Error:", error); };
socket.onclose = function() { console.log("Connection closed"); };
