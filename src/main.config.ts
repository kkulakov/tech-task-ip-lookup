import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function mainConfig(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const swaggerConfig = new DocumentBuilder().setTitle('IP Lookup API').build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  app.use('/swagger.json', (req, res) => {
    res.send(document);
  });

  SwaggerModule.setup('swagger', app, document);
}
