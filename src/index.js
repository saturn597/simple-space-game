import Phaser from 'phaser';

import Config from './config';
import GameScene from './gameScene';
import HudScene from './hudScene';
import StarScene from './starScene';

import {
    EndScene,
    GameOverScene,
    LevelEndScene,
    TitleScene
} from './textScenes';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, },
        },
    },
    width: Config.gameWidth,
    height: Config.gameHeight,
    scene: [
        TitleScene,
        HudScene,
        StarScene,
        GameScene,
        LevelEndScene,
        GameOverScene,
        EndScene,
    ],
};

const game = new Phaser.Game(config);
