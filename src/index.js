import Phaser from 'phaser';

import GameScene from './gameScene';
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
    scene: [TitleScene, GameScene],
};

const game = new Phaser.Game(config);
