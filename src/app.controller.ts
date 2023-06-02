import { Controller, Get, Post, Body } from '@nestjs/common';
import { Message } from 'chat-history/chat-history.entity';
import { ChatHistoryService } from 'chat-history/chat-history.service';


@Controller('messages')
export class AppController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @Post()
  async saveMessage(@Body() messageData: Message): Promise<Message> {
    return this.chatHistoryService.saveMessage(messageData);
  }

  @Get()
  async getAllMessages(): Promise<Message[]> {
    return this.chatHistoryService.getAllMessages();
  }
}
