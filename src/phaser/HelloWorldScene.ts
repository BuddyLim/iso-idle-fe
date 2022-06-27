import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { CurrentSceneInfoInterface } from 'types/Scene.type'
import { ClientToServerEvents, ServerToClientEvents } from 'types/Socket.type'

enum ImageNames
{
	Sky = 'sky',
	Star = 'star',
  Ground = 'ground',
	RedParticle = 'red_particle',
  Dude = 'dude',
  Platform = 'ground'
}

interface UserInterface{
  oldPosX: number,
  oldPosY: number,
  initPosX: number,
  initPosY: number,
  gameObject:  Phaser.Physics.Arcade.Sprite | null,
  uuid: string,
  currentAnim: string,
}

export default class HelloWorldScene extends Phaser.Scene{
  platforms: Phaser.Physics.Arcade.StaticGroup | null = null
  // player: Phaser.Physics.Arcade.Sprite | null = null
  cursor: Phaser.Types.Input.Keyboard.CursorKeys | null = null
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  currentPhysics: Phaser.Physics.Arcade.ArcadePhysics | null = null
  player: UserInterface = {
    oldPosX: 0,
    oldPosY: 0,
    initPosX: 0,
    initPosY: 0,
    gameObject: null,
    uuid: "",
    currentAnim: "turn"
  }

  players: Map<string, UserInterface> = new Map()

	constructor(
    uuid: string, posX: number, posY: number, currentSceneInfo: CurrentSceneInfoInterface | undefined, 
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  ){
		super('hello-world')
    this.player.initPosX = posX
    this.player.initPosY = posY
    this.player.uuid = uuid
    this.socket = socket

    delete currentSceneInfo?.[uuid]
    Object.entries(currentSceneInfo as CurrentSceneInfoInterface).forEach(([uuid, playerInfo]) =>{  
      const { posX, posY } = playerInfo
      this.players.set(uuid, { 
        oldPosX: posX, oldPosY: posY, 
        initPosX: posX, initPosY: posY, 
        uuid, 
        gameObject: null, 
        currentAnim: "turn" 
      })
    })
	}

	preload(){
    this.load.image(ImageNames.Sky, `${process.env.PUBLIC_URL}/assets/sky.png`);
    this.load.image(ImageNames.Platform, `${process.env.PUBLIC_URL}/assets/platform.png`);
    this.load.image(ImageNames.Star, `${process.env.PUBLIC_URL}/assets/star.png`);
    this.load.image('bomb', `${process.env.PUBLIC_URL}/assets/bomb.png`);
    this.load.spritesheet(ImageNames.Dude, 
      `${process.env.PUBLIC_URL}/assets/dude.png`,
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  create(){
    this.add.image(0, 0,  ImageNames.Sky).setOrigin(0, 0)
    this.add.image(400, 300, ImageNames.Star);

    this.platforms = this.physics.add.staticGroup();

    this.currentPhysics = this.physics
    this.platforms.create(400, 568, ImageNames.Ground).setScale(2).refreshBody();

    this.platforms.create(600, 400, ImageNames.Ground);
    this.platforms.create(50, 250, ImageNames.Ground);
    this.platforms.create(750, 220, ImageNames.Ground);

    this.player.gameObject = this.physics.add.sprite(this.player.initPosX, this.player.initPosY, 'dude');
    this.player.gameObject.setBounce(0.2);
    this.player.gameObject.setCollideWorldBounds(true);

    this.physics.add.collider(this.player.gameObject, this.platforms);
    
    for(const [uuid, playerObj] of this.players){
      const { initPosX, initPosY } = playerObj
      const currentGameObject = this.physics.add.sprite(initPosX, initPosY, 'dude')
      currentGameObject.setBounce(0.2)
      currentGameObject.setCollideWorldBounds(true)
      this.physics.add.collider( currentGameObject, this.platforms);

      this.players.set(uuid, {...playerObj, gameObject: currentGameObject})
    }

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.socket?.on("update-player-pos", (uuid, posX, posY, currentAnim) =>{
      const currentPlayer = this.players.get(uuid)
      currentPlayer?.gameObject?.setX(posX)
      currentPlayer?.gameObject?.setY(posY)
      if(['left', 'right'].includes(currentAnim)){
        currentPlayer?.gameObject?.anims.play(currentAnim, true)
      }
      else{
        currentPlayer?.gameObject?.anims.play(currentAnim)
      }
      this.players.set(uuid, currentPlayer! )
    })

    this.socket?.on("remove-session", (uuid) =>{
      console.log(uuid)
      this.players.get(uuid)?.gameObject?.destroy()
      this.players.delete(uuid)
    })

    this.socket?.on("new-connection", (uuid, currentSceneInfo) =>{
      const { posX, posY } = currentSceneInfo[uuid]
      const currentGameObject = this.physics.add.sprite(posX, posY, 'dude');
      currentGameObject.setBounce(0.2)
      currentGameObject.setCollideWorldBounds(true)
      this.physics.add.collider( currentGameObject, this.platforms!);

      this.players.set(uuid, {
        oldPosX: posX,
        oldPosY: posY,
        initPosX: posX,
        initPosY: posY,
        gameObject: currentGameObject,
        uuid: uuid,
        currentAnim: "turn"
      })
    })

    this.cursor = this.input.keyboard.createCursorKeys();
	}

  update(time: number, delta: number): void {
    if(this.player.gameObject !== undefined){
      if (this?.cursor?.left.isDown){
        this?.player?.gameObject?.setVelocityX(-160);
  
        this?.player?.gameObject?.anims.play('left', true);
      }
      else if (this?.cursor?.right.isDown){
        this?.player?.gameObject?.setVelocityX(160);
  
        this?.player?.gameObject?.anims.play('right', true);
      }
      else{
        this?.player?.gameObject?.setVelocityX(0);
  
        this?.player?.gameObject?.anims.play('turn');
      }
  
      if (this?.cursor?.up.isDown && this?.player?.gameObject?.body.touching.down){
        this.player?.gameObject?.setVelocityY(-330);
      }

      if(this.player.oldPosX !== this.player.gameObject!.x || this.player.oldPosY !== this.player.gameObject!.y){
        this.socket?.emit("update-player-pos", 
          this.player.uuid, 
          this.player.gameObject!.x, 
          this.player.gameObject!.y,
          this.player.gameObject!.anims.getName()
        )
        this.player = {
          ...this.player,
          oldPosX: this.player.gameObject!.x,
          oldPosY: this.player.gameObject!.y,
        }
      }
    }
  }
	
	private createEmitter(textureName: string)
	{
		// const particles = this.add.particles(textureName)

    //     const emitter = particles.createEmitter({
    //         speed: 100,
    //         scale: { start: 1, end: 0 },
    //         blendMode: 'ADD'
		// })
		
		// return emitter
	}
}