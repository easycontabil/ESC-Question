import appConfig from './app'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export default {
  prefix: `${appConfig.prefix}/swagger`,
  createDocument: app =>
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(appConfig.name)
        .setDescription(appConfig.description)
        .setVersion(appConfig.version)
        .addBearerAuth()
        .build(),
      {},
    ),
}
