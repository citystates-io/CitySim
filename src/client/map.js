import IsoPlugin from 'phaser3-plugin-isometric';

export default class Map{
    constructor(rows, columns){
        this.rows = rows;
        this.columns = columns;

        // tile array creation
        this.mapArray = new Array(this.rows).fill(0).map(()=>new Array(this.columns).fill(0));
        //let YSIZE = 16;
        //let XSIZE = 16;
        //for (var xx = 0; xx < XSIZE*64; xx += XSIZE) {
        //    for (var yy = 0; yy < YSIZE*64; yy += YSIZE) {
        //        this.mapArray[xx/XSIZE][yy/YSIZE] = this.scene.add.isoSprite(xx, yy, 0, 'tile', this.isoGroup);
        //        this.mapArray[xx/XSIZE][yy/YSIZE].name = "Terrain";
        //        this.mapArray[xx/XSIZE][yy/YSIZE].setInteractive({dropZone: true});
        //        this.scene.input.setDraggable(map.mapArray[xx/XSIZE][yy/YSIZE]);
                // call tile UI system here

        //    }
        //}
    };
}