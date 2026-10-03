import { spawn } from "node:child_process";

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set for the Docker application.`);
  }
  return value;
}

function configureDatabaseUrl() {
  const user = requiredEnvironment("POSTGRES_USER");
  const password = requiredEnvironment("POSTGRES_PASSWORD");
  const database = requiredEnvironment("POSTGRES_DB");
  if (password.startsWith("replace-")) {
    throw new Error("Replace the POSTGRES_PASSWORD template value before starting Docker.");
  }
  const host = process.env.DATABASE_HOST || "db";
  const port = Number(process.env.DATABASE_PORT || 5432);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("DATABASE_PORT must be a valid TCP port.");
  }

  process.env.DATABASE_URL =
    `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}` +
    `@${host}:${port}/${encodeURIComponent(database)}?schema=public`;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: process.env,
      stdio: "inherit",
    });
    const forwardSignal = (signal) => child.kill(signal);

    process.on("SIGINT", forwardSignal);
    process.on("SIGTERM", forwardSignal);
    child.once("error", reject);
    child.once("close", (code, signal) => {
      process.off("SIGINT", forwardSignal);
      process.off("SIGTERM", forwardSignal);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with ${signal || `code ${code}`}.`));
      }
    });
  });
}

async function main() {
  const [mode] = process.argv.slice(2);
  configureDatabaseUrl();

  if (mode === "migrate") {
    await run("./node_modules/.bin/prisma", ["migrate", "deploy"]);
    await run("./node_modules/.bin/tsx", ["scripts/migrate-resumes-to-private.ts"]);
    return;
  }

  if (mode === "server") {
    const secret = requiredEnvironment("NEXTAUTH_SECRET");
    if (secret.length < 32 || secret.startsWith("replace-")) {
      throw new Error("Set NEXTAUTH_SECRET to a unique random value of at least 32 characters.");
    }
    requiredEnvironment("NEXTAUTH_URL");
    await run(process.execPath, ["server.js"]);
    return;
  }

  throw new Error("Docker entrypoint mode must be either 'migrate' or 'server'.");
}

main().catch((error) => {
  console.error("Docker startup failed.", error);
  process.exitCode = 1;
});
