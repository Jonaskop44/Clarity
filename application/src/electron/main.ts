import { app, BrowserWindow } from "electron";
import path from "path";
import { isDevelopment } from "./helper.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({});
  if (isDevelopment()) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});
