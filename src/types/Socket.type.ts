export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "current-connections": (listOfIDs: Array<string>) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}