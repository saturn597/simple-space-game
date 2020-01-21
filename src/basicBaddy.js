import Phaser from 'phaser';

export default class BasicBaddy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, config) {
        super(scene, config.x, 0, 'ship');

        this.setOrigin(0.5, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.flipY = true;
        this.setVelocityY(config.speed);

        this.name = 'BasicBaddy';
    }

    update() {
        if (this.body.top > this.scene.physics.world.bounds.bottom) {
            // NB: calling destroy removes us from our group automatically.
            this.destroy();
        }
    }
}
