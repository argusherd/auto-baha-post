import { Server } from "http";
import i18n from "../i18n";
import app from "./index";

let server: Server;

export function startServer() {
  i18n.changeLanguage(process.env.LNG);
  server = app.listen(process.env.API_PORT || 48763);
}

export function closeServer() {
  server.close();
}
