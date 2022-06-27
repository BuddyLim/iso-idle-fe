import { IsoSprite, IsoText } from "@koreez/phaser3-isometric-plugin"

type TileCoordinates = {
  xx: number
  yy: number
}

export abstract class BaseTileCreator{
  scene: any
  hoverZOffset: number = 8
  tileMap: Map<TileCoordinates, IsoSprite> = new Map() 
  triggerTimer: any
  debug: boolean = false

  constructor(scene: any){
    this.scene = scene
  }

  abstract initCreator: () => void

  placeTile = (xx: number, yy: number, zz: number, tile: string) =>{
    let isoTile: IsoSprite = this.scene.add!.isoSprite(xx, yy, zz, tile)
    let isoText: IsoText | null = null
    if(this.debug === true){
      isoText = this.scene.add!.isoText(xx + 15, yy + 35 , 40, `(${xx},${yy})`, { fontSize: "10px" })
    }
    isoTile.setInteractive();
    isoTile.setScale(0.1, 0.1)

    isoTile.on('pointerover',() => {
      isoTile.setTint(0x86bfda)
      isoTile.isoZ += this.hoverZOffset ;
      if(isoText !== null){
        isoText!.isoZ += this.hoverZOffset
      }
    });

    isoTile.on('pointerout', () => {
      isoTile.clearTint();
      isoTile.isoZ -= this.hoverZOffset;
      if(isoText !== null){
        isoText!.isoZ -= this.hoverZOffset
      }
    });

    this.tileMap.set({xx: xx, yy: yy}, isoTile)

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