import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply ValidationPipe globally for incoming request DTOs
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Apply ClassSerializerInterceptor globally for outgoing responses
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
