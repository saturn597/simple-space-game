import Phaser from 'phaser';

import Scene from './scene';
import TitleScene from './titlescene';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, },
        },
    },
    width: 360,
    height: 640,
    scene: [TitleScene, Scene],
};

const game = new Phaser.Game(config);
