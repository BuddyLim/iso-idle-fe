import { BaseTileCreator } from "./BaseTileCreator"

enum ForestTileEnum{
  CONIFER_ALT_SHORT ='coniferAltShort',
  CONIFER_ALT_TALL ='coniferAltTall',
  CONIFER_TALL ='coniferTall',
  CONIFER_SHORT ='coniferShort',
}

export class ForestTileCreator extends BaseTileCreator{
  triggerTimer: any
  zz:number = 24

  constructor(scene: any){
    super(scene)

    this.initCreator()
  }
  
  initCreator = () => {
    this.triggerTimer = this.scene.time.addEvent({
        callback: this.createNewTreeTile,
        callbackScope: this.scene,
        delay: 2000,
        loop: true
    });
  }
  
  createNewTreeTile = () =>{
    const listOfTreeTile = Object.values(ForestTileEnum)
    const xx = this.getRandomArbitraryNumber(0, 504)
    const yy = this.getRandomArbitraryNumber(0, 504)

    const randomTreeTile =  listOfTreeTile[this.getRandomArbitraryNumber(0, listOfTreeTile.length - 1)]

    if(this.debug === true){
      console.log(`${randomTreeTile} being placed at ${xx},${yy}`)
    }
    const isoTile = this.placeTile(xx, yy, this.zz, randomTreeTile)
    this.animateTile(isoTile, this.getRandomArbitraryNumber(1000, 3000), "Elastic.easeOut")
  }
}