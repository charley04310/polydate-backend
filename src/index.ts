import { App } from "./init/app";
import config from "./init/config";

async function main() {
  const app = new App();
  if (config.port != undefined) {
    app.listen(config.port);
  }
}

main();
