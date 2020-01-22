import Phaser from 'phaser';

import GameScene from './gameScene';
import StarScene from './starScene';
import { EndScene, LevelEndScene, TitleScene } from './textScenes';

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
    scene: [TitleScene, StarScene, GameScene, LevelEndScene, EndScene,],
};

const game = new Phaser.Game(config);
