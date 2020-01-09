import Phaser from 'phaser';

import Scene from './scene';

// TODO: switch to Phaser.AUTO below. The VM I'm using for development doesn't
// like WebGL.

const config = {
    type: Phaser.CANVAS,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, },
        },
    },
    width: 360,
    height: 640,
    scene: Scene,
};

const game = new Phaser.Game(config);
