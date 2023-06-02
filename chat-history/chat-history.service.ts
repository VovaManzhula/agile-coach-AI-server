import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './chat-history.entity';
import { Configuration, OpenAIApi, CreateChatCompletionRequest } from 'openai';

import * as config from './apiConfig.json';

const gptApiKey = config.apiKey;
const orgId = config.orgId;

@Injectable()
export class ChatHistoryService {
  private readonly openAiApi: OpenAIApi;

  constructor(
    @InjectRepository(Message)
    private chatHistoryRepository: Repository<Message>,
  ) {
    const configuration = new Configuration({
      organization: orgId,
      apiKey: gptApiKey,
    });

    this.openAiApi = new OpenAIApi(configuration);
  }

  async saveMessage(messageData: Message): Promise<Message> {
    const newMessage = this.chatHistoryRepository.create(messageData);
    console.log(newMessage)
    return await this.chatHistoryRepository.save(newMessage);
  }

  async getAllMessages(): Promise<Message[]> {
    return await this.chatHistoryRepository.find();
  }

  async getResponseFromGPT(request: string) {
    try {
      const params: CreateChatCompletionRequest = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: ' Answer  like you my Agile coach' },
          { role: 'user', content: request },
        ],
      };

      const responce = await this.openAiApi.createChatCompletion(params);
      return responce.data;
    } catch (error) {
      console.error('Error calling OpenAI API', error);
      throw error;
    }
  }
}
