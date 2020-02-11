import Phaser from 'phaser';

export default class Hud extends Phaser.Scene {
    constructor() {
        super({ key: 'hud', active: true });
        this.shield = 0;
        this.enemies = 0;
    }

    create() {
        const right = this.cameras.main.width;
        const center = right / 2;
        const config = { fill: '#ffffff', font: '15px Courier', };

        this.shieldText = this.add.text(10, 10, '', config);
        this.enemiesText = this.add.text(center, 10, '', config).
            setOrigin(0.5, 0);
        this.levelText = this.add.text(right - 10, 10, '', config).
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
