import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatHistoryService } from './chat-history.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Initialized!');
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(payload): Promise<any> {
    const { user_id, message, is_user } = payload;
    console.log(user_id, message, is_user);
    console.log(payload);
    const userMessage = await this.chatHistoryService.saveMessage({
      user_id: user_id,
      message: message,
      is_user: is_user,
      id: 0,
      timestamp: undefined,
    });
    this.server.emit('newMessage', userMessage);

    if (is_user) {
      const gptResponse = await this.chatHistoryService.getResponseFromGPT(
        message,
      );
      const responceText = gptResponse.choices[0].message.content;

      const responseMessage = await this.chatHistoryService.saveMessage({
        user_id: user_id,
        message: responceText,
        is_user: false,
        id: 0,
        timestamp: undefined,
      });
      this.server.emit('newMessage', responseMessage);
    }
  }
}
