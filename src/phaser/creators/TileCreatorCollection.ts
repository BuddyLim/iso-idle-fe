import { FloorTileCreator } from "./FloorTileCreator"
import { ForestTileCreator } from "./ForestTileCreator"

export class TileCreatorCollection{
  scene: any
  floorTileCreator: FloorTileCreator | null = null
  forestTileCreator: ForestTileCreator | null = null

  constructor(scene: any){
    this.scene = scene
    this.initCreatorCollection(scene)
  }

  initCreatorCollection = (scene: any) =>{
    this.floorTileCreator = new FloorTileCreator(scene)
    this.forestTileCreator = new ForestTileCreator(scene)
  }

  closeCreatorCollection = () =>{
    this.floorTileCreator?.clearCreator()
    this.forestTileCreator?.clearCreator()
  }
}