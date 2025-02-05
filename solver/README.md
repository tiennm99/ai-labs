# Netty WebSocket Game Server

A simple game server implementation using Netty 4 with WebSocket support.

## Features
- WebSocket-based game server using Netty 4
- JSON message protocol for client-server communication
- Built-in HTTP server for serving the web client
- Simple web-based test client

## Prerequisites
- Java 11 or higher
- Maven 3.6 or higher

## Building the Project
```bash
mvn clean package
```

## Running the Server
```bash
java -cp target/netty-game-server-1.0-SNAPSHOT.jar com.gameserver.GameServer
```
By default, the server runs on port 8080. You can specify a different port as a command-line argument:
```bash
java -cp target/netty-game-server-1.0-SNAPSHOT.jar com.gameserver.GameServer 9000
```

## Testing the Server
1. Start the server using the instructions above
2. Open a web browser and navigate to `http://localhost:8080`
3. Use the web interface to send test messages to the server

## Message Protocol
The server uses a simple JSON-based message protocol:
```json
{
    "type": "MESSAGE_TYPE",
    "payload": "Message content"
}
```

### Supported Message Types
- `PING`: Basic ping message
- Any other type will be echoed back with a `SERVER_RESPONSE` type

## Project Structure
- `GameServer.java`: Main server class that initializes Netty
- `GameWebSocketHandler.java`: Handles WebSocket frame processing
- `GameMessage.java`: Message model for client-server communication
- `HttpStaticFileHandler.java`: Serves static web content
- `index.html`: Web-based test client
