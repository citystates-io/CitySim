import Phaser, { Game, Scene } from 'phaser';
import IsoPlugin from 'phaser3-plugin-isometric';
import Map from './map.js';
import Pointer from './GUIState.js';
import Zone from './zone.js';

var game;

class IsoInteractionExample extends Scene {
  constructor() {
    const sceneConfig = {
      key: 'IsoInteractionExample',
      mapAdd: { isoPlugin: 'iso' }
    };

    super(sceneConfig);
    this.zones = [new Zone('Residential', 0x36ed36, 'green-button', 0),
                  new Zone('Commercial', 0x4286f4, 'blue-button', 1),
                  new Zone('Industrial', 0xc5cc13, 'yellow-button', 2)];
  }

  preload() {
    this.load.image('tile', 'assets/Terrain.png');
    this.load.image('roadY', 'assets/pixel city_Road1.png');
    this.load.image('roadX', 'assets/pixel city_Road2.png');
    this.load.image('fireStationS', 'assets/SmallFireStation.png');
    this.load.image('blue-button', 'assets/GUI/images/blue_button02.png');
    this.load.image('blue-button-selected', 'assets/GUI/images/blue_button05.png');
    this.load.image('grey-button', 'assets/GUI/images/grey_button02.png');
    this.load.image('grey-button-selected', 'assets/GUI/images/grey_button05.png');
    this.load.image('yellow-button', 'assets/GUI/images/yellow_button02.png');
    this.load.image('yellow-button-selected', 'assets/GUI/images/yellow_button05.png');
    this.load.image('green-button', 'assets/GUI/images/green_button02.png');
    this.load.image('green-button-selected', 'assets/GUI/images/green_button05.png');
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
    this.uiContainer = this.add.container();
    this.uiContainer.scrollFactorX = 0;
    this.uiContainer.scrollFactorY = 0;
    this.uiContainer.depth = 2000;
    this.zoneUIContainer = this.add.container();

    // Initialize pointer states
    for(var x = 0; x < this.zones.length; x++){
        pointer.addState(this.zones[x].name, 'ZONE');
    }
    pointer.addState('Road', 'TRANSIT');
    pointer.addState('Place', 'PLACE');


    var zoneButton = this.add.image(50, 110, 'grey-button').setInteractive();
    this.zoneButtons = new Array();
    this.zoneButtonTexts = new Array();
    //var zoneButtonRes = this.add.image(240, 65, 'green-button').setInteractive();
    //var zoneButtonCom = this.add.image(240, 110, 'blue-button').setInteractive();
    //var zoneButtonInd = this.add.image(240, 155, 'yellow-button').setInteractive();
    var roadButton = this.add.image(50, 155, 'grey-button').setInteractive();
    var placeTileButton = this.add.image(50, 200, 'grey-button').setInteractive();
    var zoneText = this.add.text(10, 100, 'Zone', { fill: '#000' });
    //var zoneTextRes = this.add.text(200, 55, this.zones[0].name, { fill: '#000' });
    //var zoneTextCom = this.add.text(200, 100, this.zones[1].name, { fill: '#000' });
    //var zoneTextInd = this.add.text(200, 145, this.zones[2].name, { fill: '#000' });
    var roadText = this.add.text(10, 145, 'Place Road', { fill: '#000' });
    var placeTileText = this.add.text(10, 190, 'Place Tile', { fill: '#000' });

    zoneButton.on('pointerdown', function() {
        if(!this.state){
            this.scene.zoneUIContainer.visible = true;
            this.scene.zoneUIContainer.active = true;
            this.setTint(0xd2d4d8);
            this.state = true;
            pointer.setState('Select');
        }
        else if(this.state){
            this.scene.zoneUIContainer.visible = false;
            this.scene.zoneUIContainer.active = false;
            for(var x = 0; x < this.scene.zones.length; x++){
                this.scene.zoneButtons[x].clearTint();
            }
            this.clearTint();
            this.state = false;
            pointer.setState('Select');
        }
        roadButton.clearTint();
        placeTileButton.clearTint();
        console.log("state set to: ", pointer.state);
    });
    roadButton.on('pointerdown', function() {
        pointer.setState('Road');
        this.setTint(0xd2d4d8);
        if(zoneButton.state){
            this.scene.zoneUIContainer.visible = false;
            this.scene.zoneUIContainer.active = false;
            for(var x = 0; x < this.scene.zones.length; x++){
                this.scene.zoneButtons[x].clearTint();
            }
            zoneButton.state = false;
        }
        zoneButton.clearTint();
        placeTileButton.clearTint();
        console.log("state set to: ", pointer.state);
    });
    placeTileButton.on('pointerdown', function() {
        pointer.setState('Place');
        this.setTint(0xd2d4d8);
        if(zoneButton.state){
            this.scene.zoneUIContainer.visible = false;
            this.scene.zoneUIContainer.active = false;
            for(var x = 0; x < this.scene.zones.length; x++){
                this.scene.zoneButtons[x].clearTint();
            }
            zoneButton.state = false;
        }
        roadButton.clearTint();
        zoneButton.clearTint();
        console.log("state set to: ", pointer.state);
    });

    // zone buttons instantiation
    const ZONE_BUTTONS_OFFSET_X = 240;
    const ZONE_BUTTONS_OFFSET_Y = 55;
    for(var x = 0; x < this.zones.length; x++){
        this.zoneButtons[x] = this.add.image(ZONE_BUTTONS_OFFSET_X, ZONE_BUTTONS_OFFSET_Y + x*45 + 10, this.zones[x].buttonImage).setInteractive();
        this.zoneButtonTexts[x] = this.add.text(ZONE_BUTTONS_OFFSET_X - 40, ZONE_BUTTONS_OFFSET_Y + x*45, this.zones[x].name, { fill: '#000' });
        this.zoneUIContainer.add([this.zoneButtons[x], this.zoneButtonTexts[x]]);
    }
    // zone button events
    let zones = this.zones;
    let zoneButtons = this.zoneButtons;
    for(var x1 = 0; x1 < this.zones.length; x1++){
        (function() {
            var thisX = zones[x1].ID;
            zoneButtons[x1].on('pointerdown', function() {
                for(var y = 0; y < zones.length; y++){
                    if(thisX != y){
                        zoneButtons[y].clearTint();
                    }
                }
                pointer.setState(zones[thisX].name);
                zoneButtons[thisX].setTint(zones[thisX].tint);
            }.bind(this));
        }())
    }
    this.zoneUIContainer.visible = false;
    this.zoneUIContainer.active = false;
    this.uiContainer.add([zoneButton, roadButton, placeTileButton, zoneText, roadText, placeTileText, this.zoneUIContainer]);

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
    const zoneTints = {
        RES: 0x36ed36,
        COM: 0x4286f4,
        IND: 0xc5cc13,
    };
    Object.freeze(zoneTints);

    var map = new Map(64, 64);
    var pointer = this.pointer;
    var zones = this.zones;

    // Map creation & interaction
    for (var xx = 0; xx < 512*2; xx += 16) {
      for (var yy = 0; yy < 512*2; yy += 16) {
        map.mapArray[xx/16][yy/16] = this.add.isoSprite(xx, yy, 0, 'tile', this.isoGroup);
        map.mapArray[xx/16][yy/16].name = "Terrain";
        map.mapArray[xx/16][yy/16].setInteractive({dropZone: true});
        this.input.setDraggable(map.mapArray[xx/16][yy/16]);

        map.mapArray[xx/16][yy/16].on('pointerover', function() {
            if(pointer.place){
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
                if(pointer.zone){
                    if(pointer.dragboxCoords[2] && pointer.dragboxCoords[3]){
                        console.log("test");
                        for(var x1 = Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]); x1 <= Math.max(pointer.dragboxCoords[2], pointer.dragboxCoords[0]); x1 += 16){
                            for(var y1 = Math.min(pointer.dragboxCoords[1], pointer.dragboxCoords[3]); y1 <= Math.max(pointer.dragboxCoords[1], pointer.dragboxCoords[3]); y1 += 16){
                                var thisXDiff =  Math.max(x1, pointer.dragboxCoords[2]) -  Math.min(x1, pointer.dragboxCoords[2]);
                                var prevXDiff = Math.max(pointer.dragboxCoords[0], pointer.dragboxCoords[2]) - Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]);
                                if(thisXDiff <= prevXDiff){
                                    for(var x2 = Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]); x2 <= Math.max(pointer.dragboxCoords[2], pointer.dragboxCoords[0]); x2 += 16){
                                        if(map.mapArray[x1/16][y1/16].name != "Zone"){
                                            map.mapArray[x1/16][y1/16].clearTint();
                                        }
                                        else map.mapArray[x1/16][y1/16].setTint(map.mapArray[x1/16][y1/16].data.values.tint);
                                    }
                                }
                            }
                        }
                    }
                }
                    // ROAD: clear tint of previous dragbox
                if(pointer.transit){
                    if(pointer.dragboxCoords[2] && pointer.dragboxCoords[3]) {
                        if(xdiff > ydiff) {
                            var x1;
                            var y1 = pointer.dragboxCoords[1];
                            for(x1 = xmin; x1 <= xmax; x1 += 16){
                                if(map.mapArray[x1/16][y1/16].name != "Zone"){
                                    map.mapArray[x1/16][y1/16].clearTint();
                                }
                                else map.mapArray[x1/16][y1/16].setTint(map.mapArray[x1/16][y1/16].data.values.tint)
                            }
                            x1 = pointer.dragboxCoords[2];
                            for(y1 = ymin; y1 <= ymax; y1 += 16){
                                if(map.mapArray[x1/16][y1/16].name != "Zone"){
                                    map.mapArray[x1/16][y1/16].clearTint();
                                }
                                else map.mapArray[x1/16][y1/16].setTint(map.mapArray[x1/16][y1/16].data.values.tint)
                            }
                        }
                        else {
                            var y1;
                            var x1 = pointer.dragboxCoords[0];
                            for(y1 = ymin; y1 <= ymax; y1 += 16){
                                if(map.mapArray[x1/16][y1/16].name != "Zone"){
                                    map.mapArray[x1/16][y1/16].clearTint();
                                }
                                else map.mapArray[x1/16][y1/16].setTint(map.mapArray[x1/16][y1/16].data.values.tint)
                            }
                            y1 = pointer.dragboxCoords[3];
                            for(x1 = xmin; x1 <= xmax; x1 += 16){
                                if(map.mapArray[x1/16][y1/16].name != "Zone"){
                                    map.mapArray[x1/16][y1/16].clearTint();
                                }
                                else map.mapArray[x1/16][y1/16].setTint(map.mapArray[x1/16][y1/16].data.values.tint)
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
                if(pointer.zone) {
                    for(var x1 = xmin; x1 <= xmax; x1 += 16){
                        for(var y1 = ymin; y1 <= ymax; y1 += 16){
                            if(map.mapArray[x1/16][y1/16].name == "Terrain" || map.mapArray[x1/16][y1/16].name == "Zone"){
                                for(var n = 0; n < zones.length; n++){
                                    if(pointer.state.name == zones[n].name){
                                        map.mapArray[x1/16][y1/16].setTint(zones[n].tint);
                                    }
                                }
                            }
                        }
                    }
                }

                // ROAD: selection tint
                else if(pointer.transit) {
                    if(xdiff > ydiff) {
                        var x1;
                        var y1 = pointer.dragboxCoords[1];
                        for(x1 = xmin; x1 <= xmax; x1 += 16){
                            map.mapArray[x1/16][y1/16].setTint(zoneTints.COM);
                        }
                        x1 = pointer.dragboxCoords[2];
                        for(y1 = ymin; y1 <= ymax; y1 += 16){
                            map.mapArray[x1/16][y1/16].setTint(zoneTints.COM);
                        }
                    }
                    else {
                        var y1;
                        var x1 = pointer.dragboxCoords[0];
                        for(y1 = ymin; y1 <= ymax; y1 += 16){
                            map.mapArray[x1/16][y1/16].setTint(zoneTints.COM);
                        }
                        y1 = pointer.dragboxCoords[3];
                        for(x1 = xmin; x1 <= xmax; x1 += 16){
                            map.mapArray[x1/16][y1/16].setTint(zoneTints.COM);
                        }
                    }
                }
            }
        });

        map.mapArray[xx/16][yy/16].on('pointerout', function() {
            if(pointer.state.mode == 'PLACE'){
                if(!pointer.placed && (this.name == "Terrain" || this.name == "Zone")){
                    this.setTexture('tile');
                }
                else if(!pointer.placed && this.name == "Road"){
                    this.setTexture('roadY');
                }
                pointer.placed = false;
                this.alpha = 1;
            }
            else if(!pointer.drag && (this.name == "Terrain" || this.name == "Road" || this.name == "Building")){
                this.clearTint();
            }
            else if(!pointer.drag && this.name == "Zone"){
                this.setTint(this.data.values.tint);
            }
        });

        map.mapArray[xx/16][yy/16].on('pointerdown', function() {
            if(pointer.zone){
                    pointer.dragboxCoords[0] = this.isoX;
                    pointer.dragboxCoords[1] = this.isoY;
                    // reset 2nd dragbox coords so pointerover event knows it's in a new drag event
                    pointer.dragboxCoords[2] = false;
                    pointer.dragboxCoords[3] = false;
                    pointer.drag = true

            }
            if(pointer.transit){
                pointer.dragboxCoords[0] = this.isoX;
                pointer.dragboxCoords[1] = this.isoY;
                // reset 2nd dragbox coords so pointerover event knows it's in a new drag event
                pointer.dragboxCoords[2] = false;
                pointer.dragboxCoords[3] = false;
                pointer.drag = true
            }
            else if(pointer.place) {
                if(this.name == "Zone"){
                    this.clearTint();
                }
                this.name = "Building";
                pointer.placed = true;
                this.alpha = 1;
            }
        });

        map.mapArray[xx/16][yy/16].on('pointerup', function(){
            pointer.drag = false;
            if(pointer.zone || pointer.transit){
                var xmin = Math.min(pointer.dragboxCoords[0], pointer.dragboxCoords[2]);
                var xmax = Math.max(pointer.dragboxCoords[0], pointer.dragboxCoords[2]);
                var ymin = Math.min(pointer.dragboxCoords[1], pointer.dragboxCoords[3]);
                var ymax = Math.max(pointer.dragboxCoords[1], pointer.dragboxCoords[3]);
                var xdiff = xmax - xmin;
                var ydiff = ymax - ymin;
                if(pointer.zone){
                    var thisZone;
                    for(var x = 0; x < this.scene.zones.length; x++){
                        console.log(thisZone);
                        if(pointer.state.name == this.scene.zones[x].name){
                            thisZone = this.scene.zones[x];
                            break;
                        }
                    }
                    for(var x1 = xmin; x1 <= xmax; x1 += 16){
                        for(var y1 = ymin; y1 <= ymax; y1 += 16){
                            if(map.mapArray[x1/16][y1/16].name == "Terrain" || map.mapArray[x1/16][y1/16].name == "Zone"){
                                map.mapArray[x1/16][y1/16].setTint(thisZone.tint);
                                map.mapArray[x1/16][y1/16].name = "Zone";
                                map.mapArray[x1/16][y1/16].setData({zoneType: "Residential", tint: thisZone.tint});
                            }
                        }
                    }
                }
                // Road building logic
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