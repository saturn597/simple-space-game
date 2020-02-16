import Phaser from 'phaser';

export default class SweepBaddy extends Phaser.GameObjects.PathFollower {
    constructor(scene, config) {

        // Method for keeping us just out of view for our first frame.  Just
        // setting our origin doesn't work because we rotate to the path
        // direction when startFollow is called.  Instead, calculate the
        // distance from sprite center to one corner of our sprite.  This will
        // be the distance we need to maintain from the game arena so that we
        // are completely outside it no matter what our angle.
        const frame = scene.textures.get('sweeper').get(0);
        const distance = Math.sqrt((frame.width / 2)**2 + (frame.height / 2)**2)
        const startY = -distance;

        const path = new Phaser.Curves.Path(config.x, startY);
        super(scene, path, config.x, startY, 'sweeper');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const bounds = scene.physics.world.bounds;
        const max = bounds.bottom + this.height + config.step;
        const points = [];
        let rightSide = config.fromRight;
        for (let y = config.step; y < max; y += config.step) {
            if (rightSide) {
                points.push(new Phaser.Math.Vector2(bounds.right, y));
            } else {
                points.push(new Phaser.Math.Vector2(bounds.left, y));
            }
            rightSide = !rightSide;
        }
        path.splineTo(points);

        this.startFollow({
            duration: 1000 * path.getLength() / config.speed,
            onComplete: () => {
                this.destroy();
            },
            rotateToPath: true,
        });

        this.name = 'Sweep Baddy';
    }

    static randomConfig(bounds) {
        const rnd = Phaser.Math.RND;
        return {
            fromRight: rnd.pick([true, false]),
            speed: rnd.integerInRange(bounds.minSpeed, bounds.maxSpeed),
            step: rnd.integerInRange(bounds.minStep, bounds.maxStep),
            x: rnd.integerInRange(bounds.minX, bounds.maxX),
        };
    }
}
