import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { Message } from "../entities/message"

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  // Maintain a mapping of conversationId to connected clients
  private conversationClients = new Map<string, Set<Socket>>()

  handleConnection(client: Socket) {
    // Get the conversationId from the client's query parameters or wherever it's stored
    const conversationId = client.handshake.query.conversationId

    // Add the client to the corresponding conversationId set
    if (conversationId) {
      if (!this.conversationClients.has(String(conversationId))) {
        this.conversationClients.set(String(conversationId), new Set())
      }
      this.conversationClients.get(String(conversationId)).add(client)
    }
  }

  handleDisconnect(client: Socket) {
    // Remove the client from the corresponding conversationId set
    this.conversationClients.forEach((clients, conversationId) => {
      if (clients.has(client)) {
        clients.delete(client)
        if (clients.size === 0) {
          this.conversationClients.delete(conversationId)
        }
      }
    })
  }

  @SubscribeMessage("message")
  handleMessage(@MessageBody() data: Message, @ConnectedSocket() client: Socket) {
    // Get the conversationId from the client's query parameters or wherever it's stored
    const conversationId = client.handshake.query.conversationId

    // Broadcast the message to all clients in the conversationId channel
    if (conversationId && this.conversationClients.has(String(conversationId))) {
      this.conversationClients.get(String(conversationId)).forEach(socket => {
        socket.emit("message", data)
      })
    }
  }
}
