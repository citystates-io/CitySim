import Phaser, { Game, Scene } from 'phaser';
import IsoPlugin from 'phaser3-plugin-isometric';
import Map from './map.js'
import Pointer from './GUIState.js'

class IsoInteractionExample extends Scene {
  constructor() {
    const sceneConfig = {
      key: 'IsoInteractionExample',
      mapAdd: { isoPlugin: 'iso' }
    };

    var slickUI;
    var controls;
    super(sceneConfig);
  }

  preload() {
    this.load.image('tile', 'assets/Terrain.png');
    this.load.scenePlugin({
      key: 'IsoPlugin',
      url: IsoPlugin,
      sceneKey: 'iso'
    });
        // You can use your own methods of making the plugin publicly available. Setting it as a global variable is the easiest solution.
    //this.slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
    //this.slickUI.load('assets/GUI/kenney.json'); // Use the path to your kenney.json. This is the file that defines your theme.
  }

  create() {
    this.isoGroup = this.add.group();

    this.iso.projector.origin.setTo(0.5, 0.3);

    // adjustable window size
    window.addEventListener('resize', () => {
        game.resize(window.innerWidth, window.innerHeight);
    });

    // Camera Setup
    var cam = this.cameras.main;
    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
        camera: cam,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    };
    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    // Add some tiles to our scene
    this.createMap();
  }

  createMap() {
    var tileSprite;
    const tileTypes = {
        Terrain: 1,
        ZoneRes: 2,
        ZoneCom: 3,
        ZoneInd: 4,
        Capitol: 5
    };
    Object.freeze(tileTypes);

    var map = new Map(64, 64);
    var pointer = new Pointer();

    for (var xx = 0; xx < 512*2; xx += 16) {
      for (var yy = 0; yy < 512*2; yy += 16) {
        map.mapArray[xx/16][yy/16] = this.add.isoSprite(xx, yy, 0, 'tile', this.isoGroup);
        map.mapArray[xx/16][yy/16].name = "Terrain";
        map.mapArray[xx/16][yy/16].setInteractive({dropZone: true});
        this.input.setDraggable(map.mapArray[xx/16][yy/16]);

        //map.mapArray[xx/16][yy/16] = tileSprite;

        // I need to qualify all this input with pointer state changes i.e. drag mode, place mode, etc
        map.mapArray[xx/16][yy/16].on('pointerover', function() {
            if(!pointer.drag){
                this.setTint(0x86bfda);
            }
        });

        map.mapArray[xx/16][yy/16].on('pointerout', function() {
            if(!pointer.drag && this.name != "Zone"){
                this.clearTint();
            }
            else if(!pointer.drag && this.name == "Zone"){
                this.setTint(0x86bfff);
            }
            else {
                pointer.dragboxCoords[2] = this.isoX;
                pointer.dragboxCoords[3] = this.isoY;
                //console.log("x is ", pointer.dragboxCoords[0]/16, "y is ", pointer.dragboxCoords[1]/16);
                for(var x1 = Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]); x1 <= Math.max(pointer.dragboxCoords[2], pointer.dragboxCoords[0]); x1 += 16){
                    for(var y1 = Math.min(pointer.dragboxCoords[1], pointer.dragboxCoords[3]); y1 <= Math.max(pointer.dragboxCoords[1], pointer.dragboxCoords[3]); y1 += 16){
                        map.mapArray[x1/16][y1/16].setTint(0x86bfff);
                    }
                }
            }
        });
        map.mapArray[xx/16][yy/16].on('pointerdown', function() {
            pointer.dragboxCoords[0] = this.isoX;
            pointer.dragboxCoords[1] = this.isoY;
            pointer.drag = true
        });
        map.mapArray[xx/16][yy/16].on('pointerup', function(){
            pointer.dragboxCoords[2] = this.isoX;
            pointer.dragboxCoords[3] = this.isoY;
            //console.log("x is ", pointer.dragboxCoords[0]/16, "y is ", pointer.dragboxCoords[1]/16);
            for(var x1 = Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]); x1 <= Math.max(pointer.dragboxCoords[2], pointer.dragboxCoords[0]); x1 += 16){
                for(var y1 = Math.min(pointer.dragboxCoords[1], pointer.dragboxCoords[3]); y1 <= Math.max(pointer.dragboxCoords[1], pointer.dragboxCoords[3]); y1 += 16){
                    map.mapArray[x1/16][y1/16].setTint(0x86bfff);
                    map.mapArray[x1/16][y1/16].name = "Zone";
                    //console.log(x1/16, y1/16);
                }
            }
            pointer.drag = false;
        });
      }
    }
    console.log(map.mapArray);
  }
  update(time, delta){
      this.controls.update(delta);
  }
}

let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  scene: IsoInteractionExample
};

var game = new Game(config);