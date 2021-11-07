import Phaser from 'phaser';

import Config from './config';

export default class Hud extends Phaser.Scene {
    constructor() {
        super({ key: 'hud', active: true });
        this.shield = 0;
        this.enemies = 0;
    }

    create() {
        const borderStart = Config.hudHeight - Config.borderWidth;
        const right = this.cameras.main.width;
        const center = right / 2;

        const textConfig = { fill: '#ffffff', font: '15px Courier',
                         strokeThickness: 1 };

        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000);
        graphics.fillRect(0, 0, right, Config.hudHeight);
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, borderStart, right, Config.borderWidth);

        this.shieldText = this.add.text(7, 7, '', textConfig);
        this.enemiesText = this.add.text(center, 7, '', textConfig).
            setOrigin(0.5, 0);
        this.levelText = this.add.text(right - 7, 7, '', textConfig).
            setOrigin(1, 0);

        const game = this.scene.get('gameScene');

        game.events.on('setEnemies', n => {
            this.enemiesText.text = 'Left: ' + n;
        });

        game.events.on('setShields', n => {
            this.shieldText.text = 'Shield: ' + n;
        });

        /*game.events.on('setLevel', n => {
            this.levelText.text = 'Lvl: ' + n;
        });*/
    }
}
