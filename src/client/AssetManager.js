import roadsRegularAssets from '../../assets/assetLists/roadsRegular'

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
    constructor(name, assets){
        this.name = name;
        this.assets = assets;
    }
}

class TransitGroup extends AssetGroup{
    constructor(name, assets){
        super(name, assets);
    }
}

export default class AssetManager{
    constructor(){
    // Create all assets here
    const roadTilesRegular = new TransitGroup("roadsRegular", roadsRegularAssets)
    }
    // loads asset JSON data into scene
    getAssetMap(scene){
        return [
            ...roadsRegularAssets.assets,

        ]
    }
}