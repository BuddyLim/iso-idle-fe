import React, { useContext, useEffect, useState } from 'react'
import { HomeComponentInterface } from 'types/Home.type'
import 'styles/Home.css'
import { SocketContext } from 'context/contexts'
import { ClientToServerEvents, ServerToClientEvents } from 'types/Socket.type';
import { Socket } from 'socket.io-client';
import Phaser from 'phaser';
import HelloWorldScene from 'phaser/HelloWorldScene';
import { IsoScene } from 'phaser/IsoScene';
import { IsometricPlugin,  } from '@koreez/phaser3-isometric-plugin';


export const Home = ({ sessionID, currentConnections, currentSceneInfo }: HomeComponentInterface ) => {
  const [currentGame, setCurrentGame] = useState<Phaser.Game>()
  const socket = useContext<Socket<ServerToClientEvents, ClientToServerEvents> | undefined>(SocketContext)

  useEffect(() =>{
    const currentPlayerInfo = currentSceneInfo?.[sessionID]
    if(currentPlayerInfo !== undefined && currentGame === undefined){
      const { posX, posY } = currentPlayerInfo
      // const config: Phaser.Types.Core.GameConfig = {
      //   type: Phaser.AUTO,
      //   width: 800,
      //   height: 600,
      //   physics: {
      //     default: 'arcade',
      //     arcade: {
      //       gravity: { y: 300 },
      //       debug: false,
      //     },
      // },
      //   scene: [new HelloWorldScene(sessionID, posX, posY, currentSceneInfo, socket)]
      // }

      const config = {
        type: Phaser.AUTO,
        // pixelArt: true,
        scene: [IsoScene],
        scale:{
          mode: Phaser.Scale.FIT
        },
        plugins: {
          global: [
            { key: 'IsometricPlugin', plugin: IsometricPlugin, start: true },
          ],
        },
        audio: {
          disableWebAudio: true
        }
      };

      // console.log(IsometricPlugin)
      
      
      const game = new Phaser.Game(config);

      setCurrentGame(game)
    }

    return () =>{
      if(currentGame !== undefined){
        // currentGame.destroy(false)
        // setCurrentGame(undefined)
      }
    }
  }, [currentGame, currentSceneInfo, sessionID, socket])
  // const socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined = useContext(SocketContext)

  // const HomeOnlineList = ({ currentConnections }: { currentConnections: Array<string> }) =>{
  //   const filteredConnections = currentConnections.filter(socketID => socketID !== socket?.id)

  //   return (
  //     <div className='home__online-list'>
  //       Currently Online:
  //       <div className='home__online-item'>
  //         {filteredConnections.map(socketID =>{
  //           return (<div key={socketID}>{socketID}</div>)
  //         })}
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div/>
  )
}

export default Home
