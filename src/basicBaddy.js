import Phaser from 'phaser';

export default class BasicBaddy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, config) {
        super(scene, config.x || 0, config.y || 0, 'ship');
        this.name = 'BasicBaddy';

        this.worldBounds = scene.physics.world.bounds;

        this.originY = 1;  // If y is 0, start just above the screen
        this.flipY = true;  // TODO: Remove if I make separate baddy sprites

        scene.physics.add.existing(this);  // must precede setVelocity
        this.setVelocityY(config.speed || 0);

        scene.add.existing(this);
    }

    update() {
        if (this.body.top > this.worldBounds.bottom) {
            this.emit('escape');
            // NB: calling destroy removes us from our group automatically.
            this.destroy();
        }
    }

    static randomConfig(bounds) {
        const rnd = Phaser.Math.RND;

        return {
            speed: rnd.integerInRange(bounds.minSpeed, bounds.maxSpeed),
            x: rnd.integerInRange(bounds.minX, bounds.maxX),
        }
    }
}
