import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";

const WebSocketComponent = () => {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(
      "ws://localhost:8000/ws/application/websocket-manager/"
    );

    // When the WebSocket connection opens
    socket.onopen = () => {
      setIsConnected(true);
      console.log("Connection opened");
    };

    // When a message is received from the server
    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);

      // Parse the outer JSON
      const parsedOuterMessage = JSON.parse(event.data);

      // Parse the inner message string
      const parsedInnerMessage = JSON.parse(parsedOuterMessage.message);

      // Set the destructured message back to state
      setCurrentMessage(parsedInnerMessage);
    };

    // When there's an error
    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // When the connection is closed
    socket.onclose = () => {
      setIsConnected(false);
      console.log("Connection closed");
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  // Mapping of message keys to verbose descriptions
  const messageDescriptionMap = {
    e: "Event Type",
    E: "Event Time (ms)",
    s: "Symbol",
    p: "Price Change (Last 24h)",
    P: "Percentage Change (Last 24h)",
    w: "Weighted Average Price (Last 24h)",
    x: "Last Price",
    c: "Current Price",
    Q: "Quantity of Last Trade",
    b: "Highest Bid Price",
    B: "Quantity at Highest Bid",
    a: "Lowest Ask Price",
    A: "Quantity at Lowest Ask",
    o: "Opening Price (Last 24h)",
    h: "Highest Price (Last 24h)",
    l: "Lowest Price (Last 24h)",
    v: "Total Volume (Last 24h)",
    q: "Total Value in USDT (Last 24h)",
    O: "Start Time of 24h Period (ms)",
    C: "End Time of 24h Period (ms)",
    F: "First Trade ID (Last 24h)",
    L: "Last Trade ID (Last 24h)",
    n: "Number of Trades (Last 24h)",
  };

  return (
    <div style={styles.container}>
      <Typography variant="h4" gutterBottom>
        WebSocket Data
      </Typography>
      <div style={styles.connectionStatus}>
        <strong>Status:</strong> {isConnected ? "Connected" : "Disconnected"}
      </div>
      {currentMessage ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Attribute</strong>
                </TableCell>
                <TableCell>
                  <strong>Value</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(currentMessage).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell style={styles.tableCell}>
                    {messageDescriptionMap[key] || key}{" "}
                    {/* Display the verbose description */}
                  </TableCell>
                  <TableCell style={styles.tableCell}>
                    <Typography variant="body1" style={{ color: "#000" }}>
                      {value}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div style={styles.noData}>No messages received yet.</div>
      )}
    </div>
  );
};

// Basic styles for the UI
const styles = {
  container: {
    width: "80%",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  },
  connectionStatus: {
    marginBottom: "20px",
    fontSize: "18px",
  },
  noData: {
    textAlign: "center",
    fontSize: "16px",
    color: "#888",
  },
  tableCell: {
    padding: "12px",
    fontSize: "16px",
    color: "#333", // Ensure text color is dark for visibility
  },
};

export default WebSocketComponent;
