import Phaser from 'phaser';

import Config from './config';

export default class Player {
    constructor(scene, bounds) {
        this.scene = scene;

        const x = bounds.x + bounds.width / 2;
        const y = bounds.y + bounds.height / 2;
        this.sprite = scene.physics.add.sprite(x, y, 'player').
            setCollideWorldBounds(true).
            setDrag(200);
        this.sprite.body.setBoundsRectangle(bounds);

        this.graphics = this.scene.add.graphics();
        this.alpha = 0;
        this.cursors = scene.input.keyboard.createCursorKeys();
        scene.input.keyboard.on('keydown-SPACE', this.shoot, this);
    }

    hit() {
        this.alpha = 1;
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: Config.shieldDuration,
        });
    }

    shoot() {
        const bullet = this.scene.bullets.create(
            this.sprite.x,
            this.sprite.body.top,
        );
    }

    update() {
        const accel = Config.playerAccel;
        this.sprite.setAcceleration(0);
        if (this.cursors.left.isDown) {
            this.sprite.setAccelerationX(-accel);
        }
        if (this.cursors.right.isDown) {
            this.sprite.setAccelerationX(accel);
        }
        if (this.cursors.up.isDown) {
            this.sprite.setAccelerationY(-accel);
        }
        if (this.cursors.down.isDown) {
            this.sprite.setAccelerationY(accel);
        }
        this.sprite.body.acceleration.normalize().scale(accel);

        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, this.alpha);
        this.graphics.beginPath();
        this.graphics.arc(this.sprite.x, this.sprite.y, this.sprite.width, 0, 2 * Math.PI);
        this.graphics.strokePath();
    }
}
