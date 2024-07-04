import path from "path"

import { execa } from "execa"
import fs from "fs-extra"
import semver from "semver"
import { PackageJson, ValueOf } from "type-fest"
import { writeJsonFile } from "write-json-file"

export const ReleaseTypes = {
  Major: "major",
  Minor: "minor",
  Patch: "patch",
} as const

export async function semverIncrease({
  packagePath,
  release,
}: {
  packagePath: string
  release: ValueOf<typeof ReleaseTypes>
}) {
  const packageJsonPath = path.resolve(packagePath, "package.json")

  // Read package.json
  const packageJson: PackageJson = await fs.readJson(packageJsonPath, "utf-8")
  process.stdout.write(`Current version: ${packageJson.version}\n`)

  // Initialize of update version
  const oldVersion = packageJson.version
  const newVersion = semver.valid(packageJson.version) ? semver.inc(packageJson.version!, release) : "0.0.0"

  // Update package.json
  packageJson.version = newVersion as string
  await writeJsonFile(packageJsonPath, packageJson)

  // Update package-lock.json
  await execa("npm", ["i"], { cwd: packagePath, stdio: "inherit" })

  process.stdout.write(`Updated package version from ${oldVersion} to ${newVersion} [${release}]\n`)
}
