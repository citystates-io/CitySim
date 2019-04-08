import Phaser, { Game, Scene } from 'phaser';
import IsoPlugin from 'phaser3-plugin-isometric';
import Map from './map.js';
import Pointer from './GUIState.js';
import Zone from './zone.js';
import Plop from './plop.js';

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
    this.plops = [new Plop('Firestation Small', 'blue-button', 'fireStationS', 0),
                  new Plop('Clinic', 'blue-button', 'healthS', 1),
                  new Plop('Elementary School', 'blue-button', 'schoolS', 2),
                  new Plop('Police Outpost', 'blue-button', 'policeS', 3)];
  }

  preload() {
    this.load.image('tile', 'assets/TerrainTest.png');
    this.load.image('roadY', 'assets/RoadY.png');
    this.load.image('roadX', 'assets/RoadX.png');
    this.load.image('roadXNegY', 'assets/RoadXNegY.png');
    this.load.image('roadXPosY', 'assets/RoadXPosY.png');
    this.load.image('roadYNegX', 'assets/RoadYNegX.png');
    this.load.image('roadYPosX', 'assets/RoadYPosX.png');
    this.load.image('roadNegY', 'assets/RoadNegY.png');
    this.load.image('roadPosY', 'assets/RoadPosY.png');
    this.load.image('roadNegX', 'assets/RoadNegX.png');
    this.load.image('roadPosX', 'assets/RoadPosX.png');
    this.load.image('roadInt', 'assets/RoadInt.png');
    this.load.image('roadPosXPosY', 'assets/RoadTurnPosXPosY.png');
    this.load.image('roadNegXNegY', 'assets/RoadTurnNegXNegY.png');
    this.load.image('roadPosXNegY', 'assets/RoadTurnPosXNegY.png');
    this.load.image('roadNegXPosY', 'assets/RoadTurnNegXPosY.png');
    this.load.image('fireStationS', 'assets/SmallFireStation.png');
    this.load.image('healthS', 'assets/ClinicNew.png');
    this.load.image('healthB', 'assets/Hospital.png');
    this.load.image('schoolS', 'assets/School.png');
    this.load.image('schoolB', 'assets/HighSchool.png');
    this.load.image('policeS', 'assets/PoliceOutpostNew.png');
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
    this.plopUIContainer = this.add.container();

    // Initialize pointer states
    for(var x = 0; x < this.zones.length; x++){
        pointer.addState(this.zones[x].name, 'ZONE');
    }
    for(var x = 0; x < this.plops.length; x++){
        pointer.addState(this.plops[x].name, 'PLOP');
    }
    pointer.addState('Road', 'TRANSIT');


    var zoneButton = this.add.image(50, 110, 'grey-button').setInteractive();
    this.zoneButtons = new Array();
    this.zoneButtonTexts = new Array();
    var roadButton = this.add.image(50, 155, 'grey-button').setInteractive();
    var plopButton = this.add.image(50, 200, 'grey-button').setInteractive();
    this.plopButtons = new Array();
    this.plopButtonTexts = new Array();
    var zoneText = this.add.text(10, 100, 'Zone', { fill: '#000' });
    var roadText = this.add.text(10, 145, 'Place Road', { fill: '#000' });
    var placeTileText = this.add.text(10, 190, 'Place Building', { fill: '#000' });

    zoneButton.on('pointerdown', function() {
        if(!this.state){
            this.scene.zoneUIContainer.visible = true;
            this.scene.zoneUIContainer.active = true;
            if(plopButton.state){
                this.scene.plopUIContainer.visible = false;
                this.scene.plopUIContainer.active = false;
                for(var x = 0; x < this.scene.plops.length; x++){
                    this.scene.plopButtons[x].clearTint();
                }
                plopButton.state = false;
            }
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
        plopButton.clearTint();
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
        else if(plopButton.state){
            this.scene.plopUIContainer.visible = false;
            this.scene.plopUIContainer.active = false;
            for(var x = 0; x < this.scene.plops.length; x++){
                this.scene.plopButtons[x].clearTint();
            }
            plopButton.state = false;
        }
        zoneButton.clearTint();
        plopButton.clearTint();
        console.log("state set to: ", pointer.state);
    });
    plopButton.on('pointerdown', function() {
        if(!this.state){
            this.scene.plopUIContainer.visible = true;
            this.scene.plopUIContainer.active = true;
            if(zoneButton.state){
                this.scene.zoneUIContainer.visible = false;
                this.scene.zoneUIContainer.active = false;
                for(var x = 0; x < this.scene.zones.length; x++){
                    this.scene.zoneButtons[x].clearTint();
                }
                zoneButton.state = false;
            }
            this.setTint(0xd2d4d8);
            this.state = true;
            pointer.setState('Select');
        }
        else if(this.state){
            this.scene.plopUIContainer.visible = false;
            this.scene.plopUIContainer.active = false;
            for(var x = 0; x < this.scene.plops.length; x++){
                this.scene.plopButtons[x].clearTint();
            }
            this.clearTint();
            this.state = false;
            pointer.setState('Select');
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
    // plop buttons instantiation
    const PLOP_BUTTONS_OFFSET_X = 240;
    const PLOP_BUTTONS_OFFSET_Y = 145;
    for(var x = 0; x < this.plops.length; x++){
        this.plopButtons[x] = this.add.image(PLOP_BUTTONS_OFFSET_X, PLOP_BUTTONS_OFFSET_Y + x*45 + 10, this.plops[x].buttonImage).setInteractive();
        this.plopButtonTexts[x] = this.add.text(PLOP_BUTTONS_OFFSET_X - 75, PLOP_BUTTONS_OFFSET_Y + x*45, this.plops[x].name, { fill: '#000' });
        this.plopUIContainer.add([this.plopButtons[x], this.plopButtonTexts[x]]);
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
    // plop button events
    let plops = this.plops;
    let plopButtons = this.plopButtons;
    for(var x1 = 0; x1 < this.plops.length; x1++){
        (function() {
            var thisX = plops[x1].ID;
            plopButtons[x1].on('pointerdown', function() {
                for(var y = 0; y < plops.length; y++){
                    if(thisX != y){
                        plopButtons[y].clearTint();
                    }
                }
                pointer.setState(plops[thisX].name);
                plopButtons[thisX].setTint(0xd2d4d8);
            }.bind(this));
        }())
    }

    this.zoneUIContainer.visible = false;
    this.zoneUIContainer.active = false;
    this.plopUIContainer.visible = false;
    this.plopUIContainer.active = false;
    this.uiContainer.add([zoneButton, roadButton, plopButton, zoneText, roadText, placeTileText, this.zoneUIContainer]);

    this.iso.projector.origin.setTo(0.5, 0.25);

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
    var plops = this.plops;

    // Map creation & interaction
    let YSIZE = 16;
    let XSIZE = 16;
    for (var xx = 0; xx < XSIZE*64; xx += XSIZE) {
      for (var yy = 0; yy < YSIZE*64; yy += YSIZE) {
        map.mapArray[xx/XSIZE][yy/YSIZE] = this.add.isoSprite(xx, yy, 0, 'tile', this.isoGroup);
        map.mapArray[xx/XSIZE][yy/YSIZE].name = "Terrain";
        map.mapArray[xx/XSIZE][yy/YSIZE].setInteractive({dropZone: true});
        this.input.setDraggable(map.mapArray[xx/XSIZE][yy/YSIZE]);

        map.mapArray[xx/XSIZE][yy/YSIZE].on('pointerover', function() {
            if(pointer.place){
                for(var x = 0; x < plops.length; x++){
                    if(pointer.state.name == plops[x].name){
                        this.setTexture(plops[x].texture)
                    }
                }
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
                                        if(map.mapArray[x1/XSIZE][y1/YSIZE].name != "Zone"){
                                            map.mapArray[x1/XSIZE][y1/YSIZE].clearTint();
                                        }
                                        else map.mapArray[x1/XSIZE][y1/YSIZE].setTint(map.mapArray[x1/XSIZE][y1/YSIZE].data.values.tint);
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
                            for(x1 = xmin; x1 <= xmax; x1 += XSIZE){
                                if(map.mapArray[x1/XSIZE][y1/YSIZE].name != "Zone"){
                                    map.mapArray[x1/XSIZE][y1/YSIZE].clearTint();
                                }
                                else map.mapArray[x1/XSIZE][y1/YSIZE].setTint(map.mapArray[x1/XSIZE][y1/YSIZE].data.values.tint)
                            }
                            x1 = pointer.dragboxCoords[2];
                            for(y1 = ymin; y1 <= ymax; y1 += YSIZE){
                                if(map.mapArray[x1/XSIZE][y1/YSIZE].name != "Zone"){
                                    map.mapArray[x1/XSIZE][y1/YSIZE].clearTint();
                                }
                                else map.mapArray[x1/XSIZE][y1/YSIZE].setTint(map.mapArray[x1/XSIZE][y1/YSIZE].data.values.tint)
                            }
                        }
                        else {
                            var y1;
                            var x1 = pointer.dragboxCoords[0];
                            for(y1 = ymin; y1 <= ymax; y1 += YSIZE){
                                if(map.mapArray[x1/XSIZE][y1/YSIZE].name != "Zone"){
                                    map.mapArray[x1/XSIZE][y1/YSIZE].clearTint();
                                }
                                else map.mapArray[x1/XSIZE][y1/YSIZE].setTint(map.mapArray[x1/XSIZE][y1/YSIZE].data.values.tint)
                            }
                            y1 = pointer.dragboxCoords[3];
                            for(x1 = xmin; x1 <= xmax; x1 += XSIZE){
                                if(map.mapArray[x1/XSIZE][y1/YSIZE].name != "Zone"){
                                    map.mapArray[x1/XSIZE][y1/YSIZE].clearTint();
                                }
                                else map.mapArray[x1/XSIZE][y1/YSIZE].setTint(map.mapArray[x1/XSIZE][y1/YSIZE].data.values.tint)
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
                    for(var x1 = xmin; x1 <= xmax; x1 += XSIZE){
                        for(var y1 = ymin; y1 <= ymax; y1 += YSIZE){
                            if(map.mapArray[x1/XSIZE][y1/YSIZE].name == "Terrain" || map.mapArray[x1/XSIZE][y1/YSIZE].name == "Zone"){
                                for(var n = 0; n < zones.length; n++){
                                    if(pointer.state.name == zones[n].name){
                                        map.mapArray[x1/XSIZE][y1/YSIZE].setTint(zones[n].tint);
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
                        for(x1 = xmin; x1 <= xmax; x1 += XSIZE){
                            map.mapArray[x1/XSIZE][y1/YSIZE].setTint(zoneTints.COM);
                        }
                        x1 = pointer.dragboxCoords[2];
                        for(y1 = ymin; y1 <= ymax; y1 += YSIZE){
                            map.mapArray[x1/XSIZE][y1/YSIZE].setTint(zoneTints.COM);
                        }
                    }
                    else {
                        var y1;
                        var x1 = pointer.dragboxCoords[0];
                        for(y1 = ymin; y1 <= ymax; y1 += YSIZE){
                            map.mapArray[x1/XSIZE][y1/YSIZE].setTint(zoneTints.COM);
                        }
                        y1 = pointer.dragboxCoords[3];
                        for(x1 = xmin; x1 <= xmax; x1 += XSIZE){
                            map.mapArray[x1/XSIZE][y1/YSIZE].setTint(zoneTints.COM);
                        }
                    }
                }
            }
        });

        map.mapArray[xx/XSIZE][yy/YSIZE].on('pointerout', function() {
            if(pointer.state.mode == 'PLOP'){
                if(!pointer.placed && (this.name == "Terrain" || this.name == "Zone" || this.name == "Building")){
                    if(this.getData('texture')){
                        this.setTexture(this.getData('texture'));
                    }
                    else this.setTexture('tile');
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

        map.mapArray[xx/XSIZE][yy/YSIZE].on('pointerdown', function() {
            if(pointer.zone){
                    pointer.dragboxCoords[0] = this.isoX;
                    pointer.dragboxCoords[1] = this.isoY;
                    // reset 2nd dragbox coords so pointerover event knows it's in a new drag event
                    pointer.dragboxCoords[2] = this.isoX;
                    pointer.dragboxCoords[3] = this.isoY;
                    pointer.drag = true

            }
            if(pointer.transit){
                pointer.dragboxCoords[0] = this.isoX;
                pointer.dragboxCoords[1] = this.isoY;
                // reset 2nd dragbox coords so pointerover event knows it's in a new drag event
                pointer.dragboxCoords[2] = this.isoX;
                pointer.dragboxCoords[3] = this.isoY;
                pointer.drag = true
            }
            else if(pointer.place) {
                if(this.name == "Zone"){
                    this.clearTint();
                }
                this.name = "Building";
                for(var x = 0; x < plops.length; x++){
                    if(pointer.state.name == plops[x].name){
                        this.setData("texture", plops[x].texture)
                    }
                }
                pointer.placed = true;
                this.alpha = 1;
            }
        });

        map.mapArray[xx/XSIZE][yy/YSIZE].on('pointerup', function(){
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
                    for(var x1 = xmin; x1 <= xmax; x1 += XSIZE){
                        for(var y1 = ymin; y1 <= ymax; y1 += YSIZE){
                            if(map.mapArray[x1/XSIZE][y1/YSIZE].name == "Terrain" || map.mapArray[x1/XSIZE][y1/YSIZE].name == "Zone"){
                                map.mapArray[x1/XSIZE][y1/YSIZE].setTint(thisZone.tint);
                                map.mapArray[x1/XSIZE][y1/YSIZE].name = "Zone";
                                map.mapArray[x1/XSIZE][y1/YSIZE].setData({zoneType: thisZone.name, tint: thisZone.tint});
                            }
                        }
                    }
                }
                // Road building logic
                else {
                    var x1, y1;
                    if(xdiff > ydiff) {
                        y1 = pointer.dragboxCoords[1];
                    }
                    else y1 = pointer.dragboxCoords[3];

                    for(x1 = xmin; x1 <= xmax; x1 += XSIZE){
                        if(x1 != xmin && x1 != xmax){
                            map.mapArray[x1/XSIZE][y1/YSIZE].setData({roadPosX: true, roadNegX: true})
                        }
                        else if(x1 == xmin){
                            map.mapArray[x1/XSIZE][y1/YSIZE].setData({roadPosX: true})
                        }
                        else map.mapArray[x1/XSIZE][y1/YSIZE].setData({roadNegX: true})

                        this.scene.transitSprite(map.mapArray[x1/XSIZE][y1/YSIZE]);

                        map.mapArray[x1/XSIZE][y1/YSIZE].name = "Road";
                        map.mapArray[x1/XSIZE][y1/YSIZE].clearTint();
                    }

                    if(xdiff > ydiff) {
                        x1 = pointer.dragboxCoords[2];
                    }
                    else x1 = pointer.dragboxCoords[0];

                    for(y1 = ymin; y1 <= ymax; y1 += YSIZE){
                        if(y1 != ymin && y1 != ymax){
                            map.mapArray[x1/XSIZE][y1/YSIZE].setData({roadPosY: true, roadNegY: true})
                        }
                        else if(y1 == ymin){
                            map.mapArray[x1/XSIZE][y1/YSIZE].setData({roadPosY: true})
                        }
                        else map.mapArray[x1/XSIZE][y1/YSIZE].setData({roadNegY: true})

                        this.scene.transitSprite(map.mapArray[x1/XSIZE][y1/YSIZE]);

                        map.mapArray[x1/XSIZE][y1/YSIZE].name = "Road";
                        map.mapArray[x1/XSIZE][y1/YSIZE].clearTint();
                    }

                    // Straight road edge cases
                    var xSame, ySame;
                    if(pointer.dragboxCoords[1] == pointer.dragboxCoords[3]){
                        ySame = true;
                        if(!map.mapArray[pointer.dragboxCoords[2]/XSIZE][pointer.dragboxCoords[3]/YSIZE + 1].getData("roadNegY")){
                            map.mapArray[pointer.dragboxCoords[2]/XSIZE][pointer.dragboxCoords[3]/YSIZE].setData({roadPosY: false});
                            this.scene.transitSprite(map.mapArray[pointer.dragboxCoords[2]/XSIZE][pointer.dragboxCoords[3]/YSIZE]);
                        }
                    }
                    if(pointer.dragboxCoords[0] == pointer.dragboxCoords[2]){
                        xSame = true;
                        if(!map.mapArray[pointer.dragboxCoords[2]/XSIZE][pointer.dragboxCoords[3]/YSIZE + 1].getData("roadNegX")){
                            map.mapArray[pointer.dragboxCoords[2]/XSIZE][pointer.dragboxCoords[3]/YSIZE].setData({roadPosX: false});
                            this.scene.transitSprite(map.mapArray[pointer.dragboxCoords[2]/XSIZE][pointer.dragboxCoords[3]/YSIZE]);
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
  transitSprite(tile, posX = tile.getData("roadPosX"), negX = tile.getData("roadNegX"), posY = tile.getData("roadPosY"), negY = tile.getData("roadNegY")){
    switch(true){
        case posX && negX && posY && negY:
            tile.setTexture('roadInt');
            break;
        case posX && negX && posY && !negY:
            tile.setTexture('roadXPosY');
            break;
        case posX && negX && !posY && negY:
            tile.setTexture('roadXNegY');
            break;
        case posX && negX && !posY && !negY:
            tile.setTexture('roadX');
            break;
        case posX && !negX && posY && negY:
            tile.setTexture('roadYPosX');
            break;
        case posX && !negX && posY && !negY:
            tile.setTexture('roadPosXPosY');
            break;
        case posX && !negX && !posY && negY:
            tile.setTexture('roadPosXNegY');
            break;
        case posX && !negX && !posY && !negY:
            tile.setTexture('roadPosX');
            break;
        case !posX && negX && posY && negY:
            tile.setTexture('roadYNegX');
            break;
        case !posX && negX && posY && !negY:
            tile.setTexture('roadNegXPosY');
            break;
        case !posX && negX && !posY && negY:
            tile.setTexture('roadNegXNegY');
            break;
        case !posX && negX && !posY && !negY:
            tile.setTexture('roadNegX');
            break;
        case !posX && !negX && posY && negY:
            tile.setTexture('roadY');
            break;
        case !posX && !negX && posY && !negY:
            tile.setTexture('roadPosY');
            break;
        case !posX && !negX && !posY && negY:
            tile.setTexture('roadNegY');
            break;
        case !posX && !negX && !posY && !negY:
            tile.setTexture('roadInt');
            break;
    }
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