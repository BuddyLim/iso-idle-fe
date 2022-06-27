import { UserClassInterface } from "./User.types"

export interface CurrentSceneInfoInterface{
  [uuid: string]: UserClassInterface
}

export interface SceneClassInterface{
  id: string
  listOfUser: Map<string, UserClassInterface>
}