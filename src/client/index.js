import Phaser, { Game, Scene } from 'phaser';
import IsoPlugin from 'phaser3-plugin-isometric';
import Map from './map.js';
import Pointer from './GUIState.js';

var game;

class IsoInteractionExample extends Scene {
  constructor() {
    const sceneConfig = {
      key: 'IsoInteractionExample',
      mapAdd: { isoPlugin: 'iso' }
    };

    var controls;
    super(sceneConfig);
  }

  preload() {
    this.load.image('tile', 'assets/Terrain.png');
    this.load.image('roadY', 'assets/pixel city_Road1.png');
    this.load.image('roadX', 'assets/pixel city_Road2.png');
    this.load.image('fireStationS', 'assets/SmallFireStation.png');
    this.load.image('blue-button', 'assets/GUI/images/blue_button02.png');
    this.load.image('blue-button-selected', 'assets/GUI/images/blue_button05.png');
    this.load.scenePlugin({
      key: 'IsoPlugin',
      url: IsoPlugin,
      sceneKey: 'iso'
    });
  }

  create() {

    this.pointer = new Pointer();
    var pointer = this.pointer
    this.isoGroup = this.add.group();
    this.uiGroup = this.add.group();

    var zoneButton = this.add.sprite(50, 110, 'blue-button').setInteractive();
    var roadButton = this.add.sprite(50, 155, 'blue-button').setInteractive();
    var placeTileButton = this.add.sprite(50, 200, 'blue-button').setInteractive();
    this.add.text(10, 100, 'Zone');
    this.add.text(10, 145, 'Place Road');
    this.add.text(10, 190, 'Place Tile');

    zoneButton.on('pointerdown', function() {
        pointer.setPointerState(1);
        this.setTint(0xd2d4d8);
        roadButton.clearTint();
        placeTileButton.clearTint();
    });
    roadButton.on('pointerdown', function() {
        pointer.setPointerState(2);
        this.setTint(0xd2d4d8);
        zoneButton.clearTint();
        placeTileButton.clearTint();
    });
    placeTileButton.on('pointerdown', function() {
        pointer.setPointerState(3);
        this.setTint(0xd2d4d8);
        roadButton.clearTint();
        zoneButton.clearTint();
    });

    this.iso.projector.origin.setTo(0.5, 0.3);

    // adjustable window size
    window.addEventListener('resize', () => {
        game.resize(window.innerWidth, window.innerHeight);
    });

    // Camera controls Setup
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
        TERRAIN:  1,
        ZONE_RES: 2,
        ZONE_COM: 3,
        ZONE_IND: 4,
        ROAD:     5,
        CAPITOL:  6
    };
    Object.freeze(tileTypes);

    var map = new Map(64, 64);
    var pointer = this.pointer;

    // Map creation & interaction
    for (var xx = 0; xx < 512*2; xx += 16) {
      for (var yy = 0; yy < 512*2; yy += 16) {
        map.mapArray[xx/16][yy/16] = this.add.isoSprite(xx, yy, 0, 'tile', this.isoGroup);
        map.mapArray[xx/16][yy/16].name = "Terrain";
        map.mapArray[xx/16][yy/16].setInteractive({dropZone: true});
        this.input.setDraggable(map.mapArray[xx/16][yy/16]);

        map.mapArray[xx/16][yy/16].on('pointerover', function() {
            if(pointer.pointerState == pointer.pointerStates.PLACE){
                this.setTexture('fireStationS');
                this.alpha = 0.5;
            }
            else if(!pointer.drag){
                this.setTint(0x86bfda);
            }
            else{
                var xmin = Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]);
                var xmax = Math.max(pointer.dragboxCoords[0], pointer.dragboxCoords[2]);
                var ymin = Math.min(pointer.dragboxCoords[1], pointer.dragboxCoords[3]);
                var ymax = Math.max(pointer.dragboxCoords[1], pointer.dragboxCoords[3]);
                var xdiff = xmax - xmin;
                var ydiff = ymax - ymin;
                // ZONE: clear tint of previous dragbox
                if(pointer.pointerState == pointer.pointerStates.ZONE && pointer.dragboxCoords[2] && pointer.dragboxCoords[3]) {
                    console.log("y: ", this.isoY, "x: ", this.isoX);
                    for(var x1 = Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]); x1 <= Math.max(pointer.dragboxCoords[2], pointer.dragboxCoords[0]); x1 += 16){
                        for(var y1 = Math.min(pointer.dragboxCoords[1], pointer.dragboxCoords[3]); y1 <= Math.max(pointer.dragboxCoords[1], pointer.dragboxCoords[3]); y1 += 16){
                            var thisXDiff =  Math.max(x1, pointer.dragboxCoords[2]) -  Math.min(x1, pointer.dragboxCoords[2]);
                            var prevXDiff = Math.max(pointer.dragboxCoords[0], pointer.dragboxCoords[2]) - Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]);
                            if(thisXDiff <= prevXDiff){
                                for(var x2 = Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]); x2 <= Math.max(pointer.dragboxCoords[2], pointer.dragboxCoords[0]); x2 += 16){
                                    if(map.mapArray[x1/16][y1/16].name != "Zone"){
                                        map.mapArray[x1/16][y1/16].clearTint();
                                    }
                                }
                            }
                        }
                    }
                }
                // ROAD: clear tint of previous dragbox
                if(pointer.pointerState == pointer.pointerStates.ROAD && pointer.dragboxCoords[2] && pointer.dragboxCoords[3]) {
                    if(xdiff > ydiff) {
                        var x1;
                        var y1 = pointer.dragboxCoords[1];
                        for(x1 = xmin; x1 <= xmax; x1 += 16){
                            if(map.mapArray[x1/16][y1/16].name != "Zone"){
                                map.mapArray[x1/16][y1/16].clearTint();
                            }
                        }
                        x1 = pointer.dragboxCoords[2];
                        for(y1 = ymin; y1 <= ymax; y1 += 16){
                            if(map.mapArray[x1/16][y1/16].name != "Zone"){
                                map.mapArray[x1/16][y1/16].clearTint();
                            }
                        }
                    }
                    else {
                        var y1;
                        var x1 = pointer.dragboxCoords[0];
                        for(y1 = ymin; y1 <= ymax; y1 += 16){
                            if(map.mapArray[x1/16][y1/16].name != "Zone"){
                                map.mapArray[x1/16][y1/16].clearTint();
                            }
                        }
                        y1 = pointer.dragboxCoords[3];
                        for(x1 = xmin; x1 <= xmax; x1 += 16){
                            if(map.mapArray[x1/16][y1/16].name != "Zone"){
                                map.mapArray[x1/16][y1/16].clearTint();
                            }
                        }
                    }
                }
                pointer.dragboxCoords[2] = this.isoX;
                pointer.dragboxCoords[3] = this.isoY;
                var xmin = Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]);
                var xmax = Math.max(pointer.dragboxCoords[0], pointer.dragboxCoords[2]);
                var ymin = Math.min(pointer.dragboxCoords[1], pointer.dragboxCoords[3]);
                var ymax = Math.max(pointer.dragboxCoords[1], pointer.dragboxCoords[3]);
                var xdiff = xmax - xmin;
                var ydiff = ymax - ymin;
                // ZONE: set tint of current dragbox
                if(pointer.pointerState == pointer.pointerStates.ZONE) {
                    for(var x1 = xmin; x1 <= xmax; x1 += 16){
                        for(var y1 = ymin; y1 <= ymax; y1 += 16){
                            if(map.mapArray[x1/16][y1/16].name == "Terrain"){
                                map.mapArray[x1/16][y1/16].setTint(0x86bfff);
                            }
                        }
                    }
                }

                // ROAD: selection tint
                else if(pointer.pointerState == pointer.pointerStates.ROAD) {
                    if(xdiff > ydiff) {
                        var x1;
                        var y1 = pointer.dragboxCoords[1];
                        for(x1 = xmin; x1 <= xmax; x1 += 16){
                            map.mapArray[x1/16][y1/16].setTint(0x86bfff);
                        }
                        x1 = pointer.dragboxCoords[2];
                        for(y1 = ymin; y1 <= ymax; y1 += 16){
                            map.mapArray[x1/16][y1/16].setTint(0x86bfff);
                        }
                    }
                    else {
                        var y1;
                        var x1 = pointer.dragboxCoords[0];
                        for(y1 = ymin; y1 <= ymax; y1 += 16){
                            map.mapArray[x1/16][y1/16].setTint(0x86bfff);
                        }
                        y1 = pointer.dragboxCoords[3];
                        for(x1 = xmin; x1 <= xmax; x1 += 16){
                            map.mapArray[x1/16][y1/16].setTint(0x86bfff);
                        }
                    }
                }
            }
        });

        map.mapArray[xx/16][yy/16].on('pointerout', function() {
            if(pointer.pointerState == pointer.pointerStates.PLACE){
                if(!pointer.place && (this.name == "Terrain" || this.name == "Zone")){
                    this.setTexture('tile');
                }
                else if(!pointer.place && this.name == "Road"){
                    this.setTexture('roadY');
                }
                pointer.place = false;
                this.alpha = 1;
            }
            else if(!pointer.drag && (this.name == "Terrain" || this.name == "Road" || this.name == "Building")){
                this.clearTint();
            }
            else if(!pointer.drag && this.name == "Zone"){
                this.setTint(0x86bfff);
            }
        });

        map.mapArray[xx/16][yy/16].on('pointerdown', function() {
            if(pointer.pointerState == pointer.pointerStates.ZONE || pointer.pointerState == pointer.pointerStates.ROAD) {
                pointer.dragboxCoords[0] = this.isoX;
                pointer.dragboxCoords[1] = this.isoY;
                // reset 2nd dragbox coords so pointerover event knows it's in a new drag event
                pointer.dragboxCoords[2] = false;
                pointer.dragboxCoords[3] = false;
                pointer.drag = true
            }
            else if(pointer.pointerState == pointer.pointerStates.PLACE){
                if(this.name == "Zone"){
                    this.clearTint();
                }
                this.name = "Building";
                pointer.place = true;
                this.alpha = 1;
            }
        });

        map.mapArray[xx/16][yy/16].on('pointerup', function(){
            if(pointer.pointerState == pointer.pointerStates.ZONE || pointer.pointerState == pointer.pointerStates.ROAD) {
                var xmin = Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]);
                var xmax = Math.max(pointer.dragboxCoords[0], pointer.dragboxCoords[2]);
                var ymin = Math.min(pointer.dragboxCoords[1], pointer.dragboxCoords[3]);
                var ymax = Math.max(pointer.dragboxCoords[1], pointer.dragboxCoords[3]);
                var xdiff = xmax - xmin;
                var ydiff = ymax - ymin;
                if(pointer.pointerState == pointer.pointerStates.ZONE) {
                    for(var x1 = xmin; x1 <= xmax; x1 += 16){
                        for(var y1 = ymin; y1 <= ymax; y1 += 16){
                            if(map.mapArray[x1/16][y1/16].name == "Terrain"){
                                map.mapArray[x1/16][y1/16].setTint(0x86bfff);
                                map.mapArray[x1/16][y1/16].name = "Zone";
                            }
                        }
                    }
                }
                // TODO: put Road building logic here
                else {
                    if(xdiff > ydiff) {
                        var x1;
                        var y1 = pointer.dragboxCoords[1];
                        for(x1 = xmin; x1 <= xmax; x1 += 16){
                            map.mapArray[x1/16][y1/16].setTexture('roadX');
                            map.mapArray[x1/16][y1/16].clearTint();
                            map.mapArray[x1/16][y1/16].name = "Road";
                        }
                        x1 = pointer.dragboxCoords[2];
                        for(y1 = ymin; y1 <= ymax; y1 += 16){
                            map.mapArray[x1/16][y1/16].setTexture('roadY');
                            map.mapArray[x1/16][y1/16].clearTint();
                            map.mapArray[x1/16][y1/16].name = "Road";
                        }
                    }
                    else {
                        var y1;
                        var x1 = pointer.dragboxCoords[0];
                        for(y1 = ymin; y1 <= ymax; y1 += 16){
                            map.mapArray[x1/16][y1/16].setTexture('roadY');
                            map.mapArray[x1/16][y1/16].clearTint();
                            map.mapArray[x1/16][y1/16].name = "Road";
                        }
                        y1 = pointer.dragboxCoords[3];
                        for(x1 = xmin; x1 <= xmax; x1 += 16){
                            map.mapArray[x1/16][y1/16].setTexture('roadX');
                            map.mapArray[x1/16][y1/16].clearTint();
                            map.mapArray[x1/16][y1/16].name = "Road";
                        }
                    }
                }
                pointer.drag = false;
            }
        });
      }
    }
    //console.log(map.mapArray);
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
  scene: [ IsoInteractionExample ]
};

game = new Game(config);