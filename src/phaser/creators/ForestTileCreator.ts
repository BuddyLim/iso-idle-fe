import { IsoSprite } from "@koreez/phaser3-isometric-plugin"
import { BaseTileCreator } from "./BaseTileCreator"

enum ForestTileEnum{
  CONIFER_ALT_SHORT ='coniferAltShort',
  CONIFER_ALT_TALL ='coniferAltTall',
  CONIFER_TALL ='coniferTall',
  CONIFER_SHORT ='coniferShort',
}

const forestTileWeightList = [3, 1, 5, 6]

export class ForestTileCreator extends BaseTileCreator{
  triggerTimer: any
  zz:number = 1
  name: string = "forestTiles"
  debug: boolean = false
  layer: Phaser.GameObjects.Layer | null = null
  depth: number = 2
  zIndexLayer: Array<Phaser.GameObjects.Layer> = []

  constructor(scene: any){
    super(scene)
    this.initCreator()
  }
  
  override initCreator = () => {
    this.layer = this.scene.add.layer()
    this.layer?.setDepth(this.depth)
    // this.scene[this.name] = this.scene.add.group()
    this.triggerTimer = this.scene.time.addEvent({
        callback: this.createNewTreeTile,
        callbackScope: this.scene,
        // delay: 5,
        repeat: 750
        
    });
  }
  
  createNewTreeTile = () =>{
    const xx = this.getRandomArbitraryNumber(0, 504)
    const yy = this.getRandomArbitraryNumber(0, 504)

    const randomTreeTile = this.pickForestTileBasedOnWeight()

    if(this.debug === true){
      console.log(`${randomTreeTile} being placed at ${xx},${yy}`)
    }

    const isoTile = this.placeTile(xx, yy, this.zz, randomTreeTile, this.name, this.layer!)
    isoTile.setOrigin(0.5 , 1.0)
    this.animateTile(isoTile, this.getRandomArbitraryNumber(1000, 3000), "Elastic.easeOut")

    this.handleTreeTileLayer(isoTile, xx, yy)
  }

  pickForestTileBasedOnWeight = (): ForestTileEnum =>{
    const cumulativeWeights: Array<number> = []

    for(let i=0; i < forestTileWeightList.length; i++){
      cumulativeWeights[i] = i !== 0 ? cumulativeWeights[i - 1] + forestTileWeightList[i] : forestTileWeightList[i]
    }
    const randomWeightedNumber = this.getRandomArbitraryNumber(0, cumulativeWeights[cumulativeWeights.length - 1])

    for(let i=0;i<cumulativeWeights.length;i++){
      if(randomWeightedNumber <= cumulativeWeights[i]){
        return Object.values(ForestTileEnum)[i]
      }
    }

    return this.pickForestTileBasedOnWeight()
  }

  handleTreeTileLayer = (isoTile: IsoSprite, xx: number, yy: number) =>{
    /**
     * Using pythagoras theorem, the diagonal position of the tree shall be the "z-index relative to the camera"
     * in order to correctly to display the depth of newly spawned trees so that it doesn't spawn above the 
     * older trees
    */
    const zIndexArrayIndex: number = Math.sqrt(Math.pow(Math.floor((xx / this.tileIncrement)), 2) + Math.pow(Math.floor( yy / this.tileIncrement), 2))

    if(this.zIndexLayer?.[zIndexArrayIndex] === undefined){
      const newLayer: Phaser.GameObjects.Layer = this.scene.add.layer()
      this.zIndexLayer[zIndexArrayIndex] = newLayer
    }

    this.zIndexLayer[zIndexArrayIndex].add(isoTile)
    this.zIndexLayer[zIndexArrayIndex].setDepth(zIndexArrayIndex)
    this.zIndexLayer[zIndexArrayIndex].depthSort()
  }

  override animateTile = (isoTile: IsoSprite, tweenDelay: number = 0, ease: string = "Expo.easeOut") =>{
    const scale = this.getRandomArbitraryNumber(0.5, 1, 0.1)
    this.scene.tweens.add({
      targets: [isoTile],
      duration: 650 + tweenDelay,
      scaleX: scale,
      scaleY: scale,
      ease: ease,
      yoyo: false,
    }) as Phaser.Tweens.TweenManager;
  }
}