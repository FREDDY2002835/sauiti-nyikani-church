// Run this ONCE from the Frontend folder:  node fix-backend-url.mjs
// It replaces every hardcoded "http://127.0.0.1:5000..." address in src/
// with one that reads VITE_BACKEND_URL (and still falls back to your PC
// when that setting doesn't exist, so local testing keeps working).

import fs from "fs";
import path from "path";

const OLD = /"http:\/\/127\.0\.0\.1:5000([^"]*)"/g;
const NEW_BASE = 'import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000"';

let changedFiles = 0;
let changes = 0;

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "data" || entry.name === "node_modules") continue;
      walk(full);
    } else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
      const text = fs.readFileSync(full, "utf8");
      let count = 0;
      const updated = text.replace(OLD, (_m, rest) => {
        count++;
        return "`${" + NEW_BASE + "}" + rest + "`";
      });
      if (count > 0) {
        fs.writeFileSync(full, updated);
        changedFiles++;
        changes += count;
        console.log(`Updated ${full} (${count})`);
      }
    }
  }
};

walk("src");
console.log(`\nDone: ${changes} address(es) changed in ${changedFiles} file(s).`);
