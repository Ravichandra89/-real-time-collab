# 🌐 Load Balancer for Real-Time Collaboration System

## 📄 Description

This configuration sets up an NGINX-based load balancer to efficiently distribute client connections across multiple Socket.IO server instances in a horizontally scaled, real-time collaboration system. It ensures smooth handling of WebSocket connections with support for sticky sessions to maintain session consistency.

## ✅ Benefits in This Scenario

- **🔁 Load Distribution**: Spreads incoming traffic across multiple Socket.IO servers to handle lakhs of concurrent users without overloading any single instance.
- **🧲 Sticky Sessions**: Maintains persistent client-server connections by ensuring each client reconnects to the same server — essential for room-based messaging.
- **📈 Horizontal Scalability**: Enables seamless addition of new Socket.IO servers as user demand grows.
- **📡 Real-Time Performance**: Minimizes latency in message delivery and room broadcasts by optimizing server usage.
- **🛡 Fault Tolerance**: If one server goes down, NGINX reroutes traffic to healthy instances, increasing system resilience.
