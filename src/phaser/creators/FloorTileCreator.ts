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

  constructor(scene: any){
    super(scene)
    this.initCreator()
  }

  initCreator = () => {
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
    for (let xx = 0; xx < 512; xx += 36) {
      this.placeTileByYY(incrementTweenDelay, xx)
    }
  }

  placeTileByYY = (incrementTweenDelay: () => number, xx: number) =>{
    for (let yy = 0; yy < 512; yy += 36) {
      let isoTile: IsoSprite
      isoTile = this.placeTile(xx, yy, this.zz, FloorTileEnum.BASE)
      this.animateTile(isoTile, incrementTweenDelay())
    }
  }
}