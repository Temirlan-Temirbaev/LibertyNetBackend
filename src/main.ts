import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { WsAdapter } from "./ws.adapter"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Allow these HTTP methods
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
    optionsSuccessStatus: 204, // Set the preflight response status to 204
    allowedHeaders: "Content-Type, Authorization", // Allow these headers
  })
  const config = new DocumentBuilder().setTitle("LibertyNetBackend").setVersion("1.0").addBearerAuth().build()

  const document = SwaggerModule.createDocument(app, config)

  app.useGlobalPipes(new ValidationPipe())

  SwaggerModule.setup("/docs", app, document)

  app.useWebSocketAdapter(new WsAdapter(app))

  await app.listen(3000)
}

bootstrap()
