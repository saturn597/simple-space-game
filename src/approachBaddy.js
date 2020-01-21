import Phaser from 'phaser';
import BasicBaddy from './basicBaddy';

export default class ApproachBaddy extends BasicBaddy {
    constructor(scene, config) {
        super(scene, config);
        this.config = config;
        this.name = 'ApproachBaddy';
    }

    update() {
        const angle = this.scene.physics.accelerateToObject(
            this,
            this.scene.player.sprite,
            this.config.acceleration
        );

        this.setAngle(angle * (180 / Math.PI) - 90);

        // accelerateToObject lets us set max X and Y speed, but doesn't let us
        // set a max for the velocity's total magnitude. So do it manually
        // here.
        const maxSpeed = this.config.maxSpeed;
        if (this.body.velocity.length() > maxSpeed) {
            this.body.velocity.normalize().scale(maxSpeed);
        }
    }
}
