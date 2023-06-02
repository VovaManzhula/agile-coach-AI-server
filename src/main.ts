import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

class CorsEnabledAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    options = options || {};
    options.cors = {
      origin: 'http://localhost:3001',
      credentials: true,
    };
    return super.createIOServer(port, options);
  }
}declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useWebSocketAdapter(new CorsEnabledAdapter(app)); 
  await app.listen(3000);
 
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }}
bootstrap();


