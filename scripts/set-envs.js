const { writeFileSync, mkdirSync } = require("node:fs");

require("dotenv").config();

const targetPathProd = "./src/environments/environment.ts";
const targetPathDev = "./src/environments/environment.development.ts";

const envProdFileContent = `export const environment = {
  production: true,
  apiUrl: '${process.env["API_URL"]}',
};
`;

const envDevFileContent = `export const environment = {
  production: false,
  apiUrl: '${process.env["API_URL"]}',
};
`;

mkdirSync("./src/environments", { recursive: true });
writeFileSync(targetPathDev, envDevFileContent);
writeFileSync(targetPathProd, envProdFileContent);
