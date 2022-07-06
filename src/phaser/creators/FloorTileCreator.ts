import { IsoSprite } from "@koreez/phaser3-isometric-plugin"
import { BaseTileCreator } from "./BaseTileCreator"

enum FloorTileEnum{
  BASE = "tile",
  BUILDING_1 = "bulding-1",
}

export class FloorTileCreator extends BaseTileCreator{
  randomTileGenerationInterval: NodeJS.Timer | null = null
  triggerTimer: any
  debug: boolean = false
  zz: number = 0
  name: string = "floorTile"
  layer: Phaser.GameObjects.Layer | null = null
  depth: number = 0

  constructor(scene: any){
    super(scene)
    scene[this.name] = scene.add.group()
    this.initCreator()
  }

  override initCreator = () => {
    this.layer = this.scene.add.layer()
    this.layer?.setDepth(this.depth)
    /*
    * Define a closure to increment the value of tweenDelay while
    * being able to pass as parameter and maintain the value
    * throughout iterations
    */
    let incrementTweenDelay = (function(tweenDelay: number){
      return function (){
        tweenDelay += 12
        return tweenDelay
      }
    }(-12))

    this.placeTileByXX(incrementTweenDelay)
  }

  placeTileByXX = (incrementTweenDelay: () => number) =>{
    for (let xx = 0; xx < 512; xx += this.tileIncrement) {
      this.placeTileByYY(incrementTweenDelay, xx)
    }
  }

  placeTileByYY = (incrementTweenDelay: () => number, xx: number) =>{
    for (let yy = 0; yy < 512; yy += this.tileIncrement) {
      let isoTile: IsoSprite
      isoTile = this.placeTile(xx, yy, this.zz, FloorTileEnum.BASE, this.name, this.layer!)
      this.layer?.add(isoTile)
      this.layer?.depthSort()
      this.animateTile(isoTile, incrementTweenDelay())
    }
  }
}