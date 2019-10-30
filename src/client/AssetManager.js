let XSIZE = 16;
let YSIZE = 16;

class Asset{
    constructor(name, fileName, ID){
        this.name = name;
        this.fileName = fileName;
        this.ID = ID;
    }
}

class MultiTileAsset extends Asset{
    constructor(name, fileName, ID, x, y){
        super(name, fileName, ID);
        this.x = x;
        this.y = y;
    }
}

class SubTileAsset extends Asset{
    constructor(name, fileName, ID, x, y){
        super(name, fileName, ID);
        this.x = x;
        this.y = y;
    }
}

class AssetGroup{
    constructor(name, ID, assets){
        this.name = name;
        this.ID = ID;
        this.assets = assets;
    }
}

class TransitGroup extends AssetGroup{
    constructor(name, ID, assets){
        super(name, ID, assets);
    }
}

export default class AssetManager{
    constructor(){

    }
    // loads asset JSON data into scene
    loadAssets(scene){
        scene.load.on('filecomplete-json-assetData', function(key, type, data){
            console.log(data);
            for(var x = 0; x < data.length; x++){
                this.scene.load.image(data[x].name, 'assets/' + data[x].fileName);
            }
        });
        scene.load.json({
            key: 'assetData',
            url: 'assets/assetGroups.json'
        });
    }
}