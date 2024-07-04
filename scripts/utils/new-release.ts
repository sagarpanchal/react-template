import { execa } from "execa"
import { ValueOf } from "type-fest"

import { ReleaseTypes, semverIncrease } from "./semver-increase"
import { semverTag } from "./semver-tag"

export async function newRelease({
  packagePath,
  release,
}: {
  packagePath: string
  release: ValueOf<typeof ReleaseTypes>
}) {
  // build package; add build directory
  await execa("npm", ["run", "build:package"], { stdio: "inherit" })
  await execa("git", ["add", "./es"], { stdio: "inherit" })

  // bump version
  await semverIncrease({ packagePath, release })

  // git add package.json, package-lock.json
  await execa("git", ["add", "./package.json"], { stdio: "inherit" })
  await execa("git", ["add", "./package-lock.json"], { stdio: "inherit" })

  // git commit
  await execa("git", ["commit", "-m", "update build"], { stdio: "inherit" })

  // git tag
  await semverTag({ packagePath })

  process.stdout.write("\nTo push build to server, run following command in terminal:\n")
  process.stdout.write("git push --follow-tags\n")
}
