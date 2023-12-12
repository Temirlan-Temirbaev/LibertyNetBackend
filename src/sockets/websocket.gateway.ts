import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


interface Message {
    type: string;
    data: any;
}

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    sendMessageToUser(userId: string, message: Message) {
        try {
            if (this.server?.sockets?.to) {
                this.server.sockets.to(userId).emit('message', message);
            } else {
                throw new Error("Socket server or 'to' method not available.");
            }
        } catch (error) {
            console.error(`Error sending message to user ${userId}: ${error.message}`);
        }
    }

    sendPrivateMessage(senderId: string, recipientId: string, message: any) {
        if (this.server?.sockets?.to) {
            this.server.sockets.to(recipientId).emit('privateMessage', { senderId, message });
        } else {
            console.error("Socket server or 'to' method not available.");
        }
    }
}
