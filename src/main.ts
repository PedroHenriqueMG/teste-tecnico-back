import { server } from "./cmd/server";
import { env } from "./env";
import { conectDb } from "./internal/domain/database/conectDb";

async function bootstrap() {
  await conectDb();
  server.listen(Number(env.PORT), () => {
    console.log(`Api listing on port ${env.PORT}`);
  });

}

bootstrap();
