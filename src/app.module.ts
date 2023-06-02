import { Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../chat-history/chat-history.entity';
import { ChatHistoryService } from '../chat-history/chat-history.service';
import { ChatGateway } from '../chat-history/chat-history.gateway';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost', 
      port: 5432, 
      username: 'postgres', //    Введіть
      password: '1111',     //   Свої дані 
      database: 'agile-db', 
      entities: [Message], 
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([Message]),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatHistoryService, ChatGateway],
  exports: [ChatHistoryService]
})
export class AppModule {
  
}
