import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from "@nestjs/websockets"
import {Server, Socket} from "socket.io"
import {Message} from "../entities/message"
import {InjectRepository} from "@nestjs/typeorm";
import {Conversation} from "../entities/conversation";
import {Repository} from "typeorm";
import {HttpException, HttpStatus, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private conversationClients = new Map<string, Set<Socket>>()

  constructor(@InjectRepository(Conversation) private conversationRepository: Repository<Conversation>, private jwtService: JwtService) {
  }

  async handleConnection(client: Socket) {
    try {
      const conversationId = client.handshake.query.conversationId
      const token = client.handshake.headers.token;
      if (!token) {
        throw new UnauthorizedException("You aren't authorized!")
      }
      if (!conversationId) {
        throw new HttpException("You didn't pass conversation ID", HttpStatus.BAD_REQUEST)
      }
      const conversation = await this.conversationRepository.findOne({
        where: {id: Number(conversationId),},
        relations: ["users"]
      })

      if (!conversation) {
        throw new HttpException("Conversation not found", HttpStatus.NOT_FOUND);
      }

      const decodedUser = this.jwtService.decode(String(token));


      const userIds = conversation.users.map(user => user.id)

      if (!userIds.includes(decodedUser.id)) {
        console.log("error")
        throw new HttpException("You don't have access to this conversation!", HttpStatus.METHOD_NOT_ALLOWED)
      }

      if (!this.conversationClients.has(String(conversationId))) {
        this.conversationClients.set(String(conversationId), new Set())
      }
      this.conversationClients.get(String(conversationId)).add(client)
    } catch (error) {
      console.error("Error in handleConnection:", error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
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
    const conversationId = client.handshake.query.conversationId
    console.log(data)
    if (conversationId && this.conversationClients.has(String(conversationId))) {
      this.conversationClients.get(String(conversationId)).forEach(socket => {
        socket.emit("message", data)
      })
    }
  }
}
