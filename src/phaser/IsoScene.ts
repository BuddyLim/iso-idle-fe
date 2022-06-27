import Phaser from 'phaser'

import { IsoSprite } from '@koreez/phaser3-isometric-plugin';
import { TileCreatorCollection } from './creators/TileCreatorCollection';

export class IsoScene extends Phaser.Scene{
  isoGroup: Phaser.GameObjects.Group | null = null
  isoOrigin: Phaser.Geom.Point = new Phaser.Geom.Point(0.5, 0.25)
  add: any
  isLoaded: boolean = false
  soundEffectMap: Map<string, Phaser.Sound.BaseSound> = new Map() 
  isoProjectionAngle: number = 0.460
  tileCreatorCollection: TileCreatorCollection | null = null

  constructor() {
    super({
      key: "iso",
      mapAdd: { isoPlugin: 'IsometricPlugin' }
   
    });
  }

  preload() {
    this.load.image('tile', `${process.env.PUBLIC_URL}/assets/landscapeTiles_067.png`);
    this.load.image('building-1', `${process.env.PUBLIC_URL}/assets/buildingTiles_002.png`);
    this.load.image('coniferAltShort', `${process.env.PUBLIC_URL}/assets/coniferAltShort.png`);
    this.load.image('coniferAltTall', `${process.env.PUBLIC_URL}/assets/coniferAltTall.png`);
    this.load.image('coniferTall', `${process.env.PUBLIC_URL}/assets/coniferTall.png`);
    this.load.image('coniferShort', `${process.env.PUBLIC_URL}/assets/coniferShort.png`);

    this.load.audio('tile-falling', [`${process.env.PUBLIC_URL}/assets/tile-falling.mp3`])
  }

  create() {
    this.tileCreatorCollection = new TileCreatorCollection(this)

    this.events.on("shutdown",() => {
      this.tileCreatorCollection?.closeCreatorCollection()
    });
  }

  sleep = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  fallingTiles = async () => {
    if(this.isLoaded === false){
      for (let index = this.children.list.length - 1; index > 0; index--) {
        await this.sleep(2)
        // this.soundEffectMap.get("tile-falling")!.play()
        let tile = this.children.list[index] as IsoSprite;
        // tile.setIsoZ(0);  
        tile.setInteractive();
        // tile.setVisible(true)
        // tile.setScale(1, 1)
      }
      this.isLoaded = true  
    }
  }

  update() {

    
    // We can interact with the cubes
    // Pick a pseudo-random cube and let it sink on click / touch
    // if (this.input.activePointer.isDown) {
    //   const cube = this.children.list[Math.trunc(Math.random() * 35)] as TIsoGameObject;
    //   cube.isoZ -= 48;
    // }
    // this.fallingTiles()
  }
}