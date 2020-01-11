import Phaser from 'phaser';

import Config from './config';

export default class Player {
    constructor(scene, bounds) {
        this.scene = scene;

        const x = bounds.x + bounds.width / 2;
        const y = bounds.y + bounds.height / 2;
        this.sprite = scene.physics.add.sprite(x, y, 'ship').
            setCollideWorldBounds(true).
            setDrag(200);
        this.sprite.body.setBoundsRectangle(bounds);

        this.cursors = scene.input.keyboard.createCursorKeys();
        scene.input.keyboard.on('keydown-SPACE', this.shoot, this);
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
    }
}
