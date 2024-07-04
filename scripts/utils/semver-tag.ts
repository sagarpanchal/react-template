import path from "path"

import { execa } from "execa"
import fs from "fs-extra"
import { PackageJson } from "type-fest"

export async function semverTag({ packagePath }: { packagePath: string }) {
  const packageJsonPath = path.resolve(packagePath, "package.json")
  const packageJson: PackageJson = await fs.readJson(packageJsonPath, "utf-8")
  await execa("git", ["tag", "-a", `v${packageJson.version}`, "-m", `v${packageJson.version}`])
}
