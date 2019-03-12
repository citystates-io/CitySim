import Phaser, { Game, Scene } from 'phaser';
import IsoPlugin from 'phaser3-plugin-isometric';

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
    this.load.scenePlugin({
      key: 'IsoPlugin',
      url: IsoPlugin,
      sceneKey: 'iso'
    });
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
    this.spawnTiles();
  }

  spawnTiles() {
    var tile;

    for (var xx = 0; xx < 512*4; xx += 16) {
      for (var yy = 0; yy < 512*4; yy += 16) {
        tile = this.add.isoSprite(xx, yy, 0, 'tile', this.isoGroup);
        tile.setInteractive();

        tile.on('pointerover', function() {
          this.setTint(0x86bfda);
          this.isoZ += 5;
        });

        tile.on('pointerout', function() {
          this.clearTint();
          this.isoZ -= 5;
        });
      }
    }
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

new Game(config);