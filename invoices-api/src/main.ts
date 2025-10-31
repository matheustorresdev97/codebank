import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './exceptions-filters/entity-not-found.exception-filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.connectMicroservice({
    name: 'KAFKA_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID ?? 'codebank',
        brokers: [process.env.KAFKA_HOST ?? 'localhost:9094'],
      },
      consumer: {
        groupId:
          !process.env.KAFKA_CONSUMER_GROUP_ID ||
            process.env.KAFKA_CONSUMER_GROUP_ID === ''
            ? 'my-consumer-' + Math.random()
            : process.env.KAFKA_CONSUMER_GROUP_ID,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
