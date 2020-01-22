import Phaser from 'phaser';

import Config from './config';

export default class StarScene extends Phaser.Scene {
    constructor() {
        super({ key: 'starScene', active: true });
        this.stars = [];
    }

    create() {
        const width = this.physics.world.bounds.width;
        const height = this.physics.world.bounds.height;

        const maxSpeed = Config.maxStarSpeed;
        const minSpeed = Config.minStarSpeed;

        for (let i = 0; i < Config.numStars; i++) {
            const x = Phaser.Math.RND.between(0, width);
            const y = Phaser.Math.RND.between(0, height);
            const size = Phaser.Math.RND.between(0, Config.maxStarSize);

            this.stars.push({
                rect: this.add.rectangle(x, y, size, size, '0xffffff'),
                speed: Phaser.Math.RND.between(minSpeed, maxSpeed),
            });
        }
    }

    update(time, delta) {
        for (let star of this.stars) {
            star.rect.y += delta * star.speed / 1000;
            if (star.rect.y > this.physics.world.bounds.height) {
                const maxSpeed = Config.maxStarSpeed;
                const minSpeed = Config.minStarSpeed;
                star.speed = Phaser.Math.RND.between(minSpeed, maxSpeed);
                star.rect.y = 0;
            }
        }
    }
}
