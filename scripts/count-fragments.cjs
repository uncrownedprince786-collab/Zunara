const fs = require("fs");
const src = fs.readFileSync("src/lib/content/fragments.ts", "utf8");
function count(name) {
  const re = new RegExp("export const " + name + "(?:[^=]*)=\\s*\\[([\\s\\S]*?)\\];");
  const m = src.match(re);
  if (!m) return 0;
  return (m[1].match(/"([^"]+)"/g) || []).length;
}
const names = ["OVERVIEW_FRAGMENTS", "LOVE_BODY", "CAREER_BODY", "MONEY_BODY", "ENERGY_BODY", "ADVICE_BODY"];
let total = 0;
for (const n of names) {
  const c = count(n);
  console.log(n, c);
  total += c;
}
const themeBodies = {};
const themeNames = ["love", "career", "money", "energy", "relationships", "growth", "communication", "home", "creativity", "wellbeing"];
for (const t of themeNames) {
  const c = count(t.toUpperCase() + "_BODY");
  themeBodies[t] = c;
}
console.log("theme bodies:", JSON.stringify(themeBodies));
console.log("sum listed:", Object.values(themeBodies).reduce((a, b) => a + b, 0));
console.log("Grand total:", total + Object.values(themeBodies).reduce((a, b) => a + b, 0));
