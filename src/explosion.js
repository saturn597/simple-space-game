import Phaser from 'phaser';

import Config from './config';

export default class Explosion extends Phaser.GameObjects.Arc {
    constructor(scene, x, y, target, callback, config) {
        // Start an explosion centered at (x, y). When it reaches the target,
        // callback is called.

        super(scene, x, y, 0, 0, 360, false, config.color, config.alpha);
        scene.add.existing(this);

        this.callback = callback;
        this.target = target;

        this.setStrokeStyle(config.outlineWeight, config.outlineColor);

        this.tween = scene.tweens.add({
            alpha: config.finalAlpha,
            duration: config.radius / config.speed,
            radius: config.radius,
            onComplete: () => this.destroy(),
            targets: this,
        });
    }

    preUpdate() {
        this.update();
    }

    update() {
        if (this.target) {
            const circle = new Phaser.Geom.Circle(this.x, this.y, this.radius);

            // Does our radius contain any corner of the target sprite?
            const contains = [
                this.target.getBottomLeft(),
                this.target.getBottomRight(),
                this.target.getTopLeft(),
                this.target.getTopRight(),
            ].some(p => circle.contains(p.x, p.y));

            if (contains) {
                this.callback();
                this.target = null;
            }
        }
    }
}
