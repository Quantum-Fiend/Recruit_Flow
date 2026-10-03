import { cp, mkdir } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");
const standaloneNext = join(standalone, ".next");

await mkdir(standaloneNext, { recursive: true });
await cp(join(root, "public"), join(standalone, "public"), {
  recursive: true,
  force: true,
});
await cp(join(root, ".next", "static"), join(standaloneNext, "static"), {
  recursive: true,
  force: true,
});
