import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './exceptions-filters/entity-not-found.exception-filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { RpcExceptionFilter } from './exceptions-filters/rpc.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

    useContainer(app.select(AppModule), { fallbackOnErrors: true });


  app.useGlobalFilters(
    new EntityNotFoundExceptionFilter(),
    new RpcExceptionFilter(),
  );
  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
