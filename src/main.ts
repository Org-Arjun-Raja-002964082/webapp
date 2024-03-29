import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  config.update({
      accessKeyId: configService.get('AWS_ACCESS_KEY') ,
      secretAccessKey: configService.get('AWS_ACCESS_SECRET'),
      region: configService.get('AWS_REGION'),
  });
  await app.listen(3000);
}
bootstrap();