import React, { useEffect, useState } from 'react'
import 'styles/Home.css'
import Phaser from 'phaser';
import { IsoScene } from 'phaser/IsoScene';
import { IsometricPlugin,  } from '@koreez/phaser3-isometric-plugin';


export const Home = () => {
  const [currentGame, setCurrentGame] = useState<Phaser.Game>()

  useEffect(() =>{
    if(currentGame === undefined){
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
      }

      const game = new Phaser.Game(config);
  
      setCurrentGame(game)
    }

    return () =>{
      if(currentGame !== undefined){
        currentGame.destroy(false)
        setCurrentGame(undefined)
      }
    }
  }, [currentGame])

  return (
    <div/>
  )
}

export default Home
