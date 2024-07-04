#!/usr/bin/env vite-node --script
import path from "path"

import { Command, Option } from "commander"
import { ValueOf } from "type-fest"

import { ReleaseTypes } from "./utils/semver-increase"

const releaseTypeOption = new Option("-r, --release <type>", "Release type")
  .choices(Object.values(ReleaseTypes))
  .makeOptionMandatory()

const program = new Command()
  .addCommand(
    new Command("bump-version")
      .description("Increase version in package.json, package-lock.json")
      .addOption(releaseTypeOption)
      .action(async ({ release }: { release: ValueOf<typeof ReleaseTypes> }) => {
        const { semverIncrease } = await import("./utils/semver-increase")
        await semverIncrease({ packagePath: path.resolve(__dirname, ".."), release })
      }),
  )
  .addCommand(
    new Command("bump-tag").description("Create new version tag").action(async () => {
      const { semverTag } = await import("./utils/semver-tag")
      await semverTag({ packagePath: path.resolve(__dirname, "..") })
    }),
  )
  .addCommand(
    new Command("new-release")
      .description("Create a new release and push to Git repository")
      .addOption(releaseTypeOption)
      .action(async ({ release }: { release: ValueOf<typeof ReleaseTypes> }) => {
        const { newRelease } = await import("./utils/new-release")
        await newRelease({ packagePath: path.resolve(__dirname, ".."), release })
      }),
  )

program.parse()
