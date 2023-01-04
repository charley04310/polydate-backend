import { App } from "./init/app";
import { SocketServer } from "./init/socket";
import config from "./init/config";

async function main() {
  const app = new App();
  const socketServer = new SocketServer();
  if (config.port != undefined) {
    app.listen(config.port);
    socketServer.listen();
  }
}

main();
