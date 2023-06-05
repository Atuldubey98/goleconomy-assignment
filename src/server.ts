import "dotenv/config";
import config from "./config";
import app from "./app";

import http from "http";

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log("Server is Running on port ", config.PORT);
});
