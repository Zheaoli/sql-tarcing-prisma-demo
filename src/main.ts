import "./instrumentation";
import "dotenv/config";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import Pyroscope from '@pyroscope/nodejs'


async function bootstrap() {
  Pyroscope.init({
    serverAddress: 'https://pyroscope.mori.mewtant.co',
    appName: 'prisma-benchmark',
    tags: {
      env: "v6",
    },
  })
  Pyroscope.start()
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"],
    bufferLogs: true,
    cors: true,
  });

  app.enableShutdownHooks();

  const port = 8084;
  await app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
