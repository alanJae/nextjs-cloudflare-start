import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const sourcePath = path.join(rootDir, ".assetsignore");
const targetDir = path.join(rootDir, ".worker-next", "assets");
const targetPath = path.join(targetDir, ".assetsignore");

async function main() {
  try {
    const targetDirStat = await stat(targetDir);

    if (!targetDirStat.isDirectory()) {
      throw new Error(`Target path is not a directory: ${targetDir}`);
    }
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      throw new Error(
        "Cloudflare asset output not found. Run the OpenNext Cloudflare build before syncing .assetsignore."
      );
    }

    throw error;
  }

  await mkdir(targetDir, { recursive: true });
  await copyFile(sourcePath, targetPath);

  console.log(`Synced ${path.relative(rootDir, sourcePath)} -> ${path.relative(rootDir, targetPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
