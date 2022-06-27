import { CurrentSceneInfoInterface } from "./Scene.type";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "current-connections": (listOfIDs: Array<string>) => void;
  "new-connection": (uuid: string, currentSceneInfo: CurrentSceneInfoInterface) => void;
  "session-id": (uuid: string) => void
  "update-player-pos": (uuid:string, posX: number, posY: number, currentAnim: string) => void;
  "remove-session": (uuid:string) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  "update-player-pos": (uuid:string, posX: number, posY: number, currentAnim: string) => void;
}