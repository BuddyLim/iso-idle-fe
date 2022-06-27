import { useEffect, useState } from "react";
import { ClientToServerEvents, ServerToClientEvents } from "types/Socket.type";
import { io, Socket } from "socket.io-client";
import { CurrentSceneInfoInterface } from "types/Scene.type";

export default function useSocket(){
  const [socketState, setSocketState] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | undefined>(undefined)
  const [currentConnections, setCurrentConnections] = useState<Array<string>>([])
  const [sessionID, setSessionID] = useState<string>("")
  const [currentSceneInfo, setCurrentSceneInfo] = useState<CurrentSceneInfoInterface>()

  useEffect(() =>{
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.REACT_APP_WS_BE_URL as string);
    setSocketState(socket)

    socket.on("new-connection", (uuid: string, currentSceneInfo: CurrentSceneInfoInterface ) =>{
      setSessionID(uuid)
      setCurrentSceneInfo(currentSceneInfo)
    })

    socket.on("session-id", (uuid:string) =>{
      setSessionID(uuid)
    })

    socket.on("current-connections", (data: Array<string>) =>{
      setCurrentConnections(data)
    })

    return () =>{
      setSocketState(undefined)
      socket.close()
    }
  }, [])

  return { sessionID, socketState, currentConnections, currentSceneInfo }
}