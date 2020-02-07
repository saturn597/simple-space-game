import Phaser from 'phaser';
import BasicBaddy from './basicBaddy';

export default class ApproachBaddy extends BasicBaddy {
    constructor(scene, config) {
        super(scene, config);
        this.config = config;
        this.name = 'ApproachBaddy';

        // Should be possible for approach baddy to come from side of screen -
        // so come from either right or left if x is 0.
        if (this.x === 0) {
            if (config.fromRight) {
                this.x = this.worldBounds.right + this.getBounds().width / 2;
            } else {
                this.x = -this.getBounds().width / 2;
            }
        }
    }

    update() {
        const angle = this.scene.physics.accelerateToObject(
            this,
            this.scene.player.sprite,
            this.config.acceleration
        );

        // Rotate ship so it's pointed where we're going
        this.setAngle(angle * (180 / Math.PI) - 90);

        // accelerateToObject lets us set max X and Y speed, but doesn't let us
        // set a max for the velocity's total magnitude. So do it manually
        // here.
        const maxSpeed = this.config.maxSpeed;
        if (this.body.velocity.length() > maxSpeed) {
            this.body.velocity.normalize().scale(maxSpeed);
        }
    }

    static randomConfig(bounds) {
        const rnd = Phaser.Math.RND;
        const maxSpeed = rnd.integerInRange(bounds.minSpeed, bounds.maxSpeed);
        const acceleration = maxSpeed * bounds.speedRatio;

        const config = {
            acceleration,
            fromRight: rnd.pick([true, false]),
            maxSpeed,
            x: rnd.integerInRange(bounds.minX, bounds.maxX),
            y: rnd.integerInRange(bounds.minY, bounds.maxY),
        };

        // If y == 0, baddy approaches from top. If x == 0, baddy approaches
        // from left or right side.
        config[rnd.pick(['x', 'y'])] = 0;

        return config;
    }
}
