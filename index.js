const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store client data in an object (key: userId, value: array of values)
const clientData = {};

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle incoming messages from clients
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);

    try {
      // Parse the JSON payload
      const data = JSON.parse(message);
      const { userId, values } = data;

    

      // Update or add the data for the userId
      clientData[userId] = values; // Replace or add the new values for the userId

      
      console.log('Current clientData:', clientData);

      // Broadcast the updated clientData to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(clientData));
        }
      });
    } catch (error) {
      console.error('Error processing message:', error.message);
      // Send an error message back to the client
      ws.send(JSON.stringify({ error: error.message }));
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// HTTP route
app.get('/', (req, res) => {
  res.send('Hello client!');
});  

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});