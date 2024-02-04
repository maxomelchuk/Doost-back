import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function startApp() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const PORT = configService.get(process.env.ENV + '.http.port');

    const config = new DocumentBuilder()
      .setTitle('Doost')
      .setDescription('REST API Documentation')
      .setVersion('1.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api', app, document);

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    app.enableShutdownHooks();

    app.enableCors({
      origin: '*',
    });

    await app.listen(PORT, () => {
      console.log(`server started on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
startApp();
