import { IsoSprite, IsoText } from "@koreez/phaser3-isometric-plugin"

type TileCoordinates = {
  xx: number
  yy: number
}

export abstract class BaseTileCreator{
  scene: any
  hoverZOffset: number = 5
  tileMap: Map<TileCoordinates, IsoSprite> = new Map() 
  triggerTimer: any
  debug: boolean = false
  tileIncrement: number = 28

  abstract name: string

  constructor(scene: any){
    this.scene = scene
  }

  abstract initCreator: () => void

  placeTile = (xx: number, yy: number, zz: number, tileName: string, tileGroupName: string, layer: Phaser.GameObjects.Layer) =>{
    let isoTile: IsoSprite = this.scene.add!.isoSprite(xx, yy, zz, tileName)

    let isoText: IsoText | null = null
    if(this.debug === true){
      isoText = this.scene.add!.isoText(xx + 15, yy + this.tileIncrement , 40, `(${xx},${yy})`, { fontSize: "10px" })
    }

    const xxToIndex = ["tile"].includes(tileName) ? Math.floor(xx / this.tileIncrement) : Math.round(xx / this.tileIncrement)
    const yyToIndex = ["tile"].includes(tileName) ? Math.floor(yy / this.tileIncrement) : Math.round(yy / this.tileIncrement)

    if(this.scene.coordinateArray[xxToIndex]?.[yyToIndex] === undefined){
      if(this.scene.coordinateArray[xxToIndex] === undefined){
        this.scene.coordinateArray[xxToIndex] = []
      }
      this.scene.coordinateArray[xxToIndex][yyToIndex] = []
    }
    this.scene.coordinateArray[xxToIndex][yyToIndex].push(isoTile)

    isoTile = this.handleTileEvents(xxToIndex, yyToIndex, isoTile, isoText, tileGroupName, layer)
    this.tileMap.set({xx: xx, yy: yy}, isoTile)

    return isoTile
  }

  handleTileEvents = (xxToIndex: number, yyToIndex: number, isoTile: IsoSprite, isoText: IsoText | null = null,  tileGroupName: string, layer: Phaser.GameObjects.Layer) =>{
    isoTile.setScale(0.1, 0.1)

    if(tileGroupName === "floorTile"){
      isoTile.setInteractive();
      //To do: increase depth when hovering over
      isoTile.on('pointerover',() => {;
        if(isoText !== null){
          isoText!.isoZ += this.hoverZOffset
        }

        for (let index = 0; index < this.scene.coordinateArray[xxToIndex][yyToIndex].length; index++) {
          const isoTileFromList: IsoSprite = this.scene.coordinateArray[xxToIndex][yyToIndex][index];
          isoTileFromList.setTint(0x86bfda)
          isoTileFromList.isoZ += this.hoverZOffset;
          isoTileFromList.setDepth(isoTileFromList.depth + 5)
          layer.depthSort()
        }
      });

      isoTile.on('pointerout', () => {
        for (let index = 0; index < this.scene.coordinateArray[xxToIndex][yyToIndex].length; index++) {
          const isoTileFromList = this.scene.coordinateArray[xxToIndex][yyToIndex][index];
          isoTileFromList.clearTint()
          isoTileFromList.isoZ -= this.hoverZOffset;
          isoTileFromList.setDepth(isoTileFromList.depth - 5)
          layer.depthSort()
        }

        if(isoText !== null){
          isoText!.isoZ -= this.hoverZOffset
        }
      });
    }

    return isoTile
  }

  animateTile = (isoTile: IsoSprite, tweenDelay: number = 0, ease: string = "Expo.easeOut") =>{
    this.scene.tweens.add({
      targets: [isoTile],
      duration: 1000 + tweenDelay,
      scaleX: 0.5,
      scaleY: 0.5,
      ease: ease,
      yoyo: false,
    }) as Phaser.Tweens.TweenManager;
  }

  getRandomArbitraryNumber = (min: number, max: number, increment: number = 1) => {
    return increment * Math.floor(Math.random() * (max - min) / increment + min / increment);
  }

  clearCreator = () => {
    this.tileMap.clear()
  }
}