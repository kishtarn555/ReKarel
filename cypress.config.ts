import { defineConfig } from "cypress";
import fs from "fs";
import path from "path";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Every built docs page as a path under webapp/ (e.g. "docs/java/funciones/"),
      // so specs can visit all of them. Read once when Cypress starts (restart
      // `cypress open` after rebuilding); empty when webapp/docs/ does not exist.
      const docsDir = path.join(config.projectRoot, "webapp", "docs");
      config.expose.docsPages = fs.existsSync(docsDir)
        ? fs.readdirSync(docsDir, { recursive: true })
            .map((file) => String(file).split(path.sep).join("/"))
            .filter((file) => file === "index.html" || file.endsWith("/index.html"))
            .map((file) => "docs/" + file.slice(0, -"index.html".length))
            .sort()
        : [];
      return config;
    },
  },
});
