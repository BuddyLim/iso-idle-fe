import { CurrentSceneInfoInterface } from "./Scene.type"

export interface HomeComponentInterface {
  sessionID: string,
  currentConnections: Array<string>
  currentSceneInfo: CurrentSceneInfoInterface | undefined
}