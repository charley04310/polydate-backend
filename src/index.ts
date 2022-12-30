import { App } from "./init/app";
import config from "./init/config";

async function main() {
  const app = new App();
  if (config.port != undefined) {
    app.listen(config.port);
    app.io.on("connection", () => {
      console.log("New client connected");
      console.log("Client disconnected");
    });
  }
}

main();
