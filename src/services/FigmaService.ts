import * as Figma from "figma-api"

import { isUndefined } from "../utils/isUndefined"

export class FigmaService {
  private api: Figma.Api
  private fileId?: string
  private nodeId?: string

  constructor(personalAccessToken: string, linkToFigmaFrame: string) {
    this.api = new Figma.Api({ personalAccessToken: personalAccessToken })
    this.fileId = FigmaService.getFileId(linkToFigmaFrame)
    this.nodeId = FigmaService.getNodeId(linkToFigmaFrame)
  }

  public static getFileId(linkToFigmaFrame: string) {
    const url = new URL(linkToFigmaFrame)
    const file = url.pathname.split("/")[2]
    return file
  }

  public static getNodeId(linkToFigmaFrame: string) {
    const url = new URL(linkToFigmaFrame)
    const nodeId = url.searchParams.get("node-id")
    return nodeId ?? undefined
  }

  public async getNode() {
    if (isUndefined(this.fileId)) return
    if (isUndefined(this.nodeId)) return

    const fileNodes = await this.api.getFileNodes(this.fileId, [this.nodeId])
    return fileNodes.nodes[Object.keys(fileNodes.nodes)[0]]?.document
  }
}
