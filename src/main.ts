import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3030; // Get the port from config or default to 3000
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}

bootstrap();
