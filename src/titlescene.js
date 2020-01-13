import Phaser from 'phaser';

import levels from './levels';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'titleScene',
        });
    }

    create() {
        const cam = this.cameras.main;
        this.add.text(cam.width / 2, cam.height / 2, 'Space to start',
            {
                fill: '#ffffff',
                font: '25px Courier',
            }).
            setOrigin(0.5);
        this.input.keyboard.once('keyup_SPACE', () => {
            this.scene.start('gameScene', levels[0]);
        });
    }
}
