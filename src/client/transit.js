export default class Transit{
    constructor(name, textureArray, buttonImage, ID){
        this.name = name;
        this.textureArray = textureArray;
        this.buttonImage = buttonImage;
        this.ID = ID;
    }
    setTexture(tile, posX = tile.getData("roadPosX"), negX = tile.getData("roadNegX"), posY = tile.getData("roadPosY"), negY = tile.getData("roadNegY")){
        switch(true){
            case posX && negX && posY && negY:
                tile.setTexture(this.textureArray.Int);
                tile.setData({texture: this.textureArray.Int})
                break;
            case posX && negX && posY && !negY:
                tile.setTexture(this.textureArray.XPosY);
                tile.setData({texture: this.textureArray.XPosY})
                break;
            case posX && negX && !posY && negY:
                tile.setTexture(this.textureArray.XNegY);
                tile.setData({texture: this.textureArray.XNegY})
                break;
            case posX && negX && !posY && !negY:
                tile.setTexture(this.textureArray.X);
                tile.setData({texture: this.textureArray.X})
                break;
            case posX && !negX && posY && negY:
                tile.setTexture(this.textureArray.YPosX);
                tile.setData({texture: this.textureArray.YPosX})
                break;
            case posX && !negX && posY && !negY:
                tile.setTexture(this.textureArray.PosXPosY);
                tile.setData({texture: this.textureArray.PosXPosY})
                break;
            case posX && !negX && !posY && negY:
                tile.setTexture(this.textureArray.PosXNegY);
                tile.setData({texture: this.textureArray.PosXNegY})
                break;
            case posX && !negX && !posY && !negY:
                tile.setTexture(this.textureArray.PosX);
                tile.setData({texture: this.textureArray.PosX})
                break;
            case !posX && negX && posY && negY:
                tile.setTexture(this.textureArray.YNegX);
                tile.setData({texture: this.textureArray.YNegX})
                break;
            case !posX && negX && posY && !negY:
                tile.setTexture(this.textureArray.NegXPosY);
                tile.setData({texture: this.textureArray.NegXPosY})
                break;
            case !posX && negX && !posY && negY:
                tile.setTexture(this.textureArray.NegXNegY);
                tile.setData({texture: this.textureArray.NegXNegY})
                break;
            case !posX && negX && !posY && !negY:
                tile.setTexture(this.textureArray.NegX);
                tile.setData({texture: this.textureArray.NegX})
                break;
            case !posX && !negX && posY && negY:
                tile.setTexture(this.textureArray.Y);
                tile.setData({texture: this.textureArray.Y})
                break;
            case !posX && !negX && posY && !negY:
                tile.setTexture(this.textureArray.PosY);
                tile.setData({texture: this.textureArray.PosY})
                break;
            case !posX && !negX && !posY && negY:
                tile.setTexture(this.textureArray.NegY);
                tile.setData({texture: this.textureArray.NegY})
                break;
            case !posX && !negX && !posY && !negY:
                tile.setTexture(this.textureArray.None);
                tile.setData({texture: this.textureArray.None})
                break;
        }
    }
}