import Phaser from 'phaser';

export default class SweepBaddy extends Phaser.GameObjects.PathFollower {
    constructor(scene, config) {
        const path = new Phaser.Curves.Path(config.x, 0);
        super(scene, path, config.x, 0, 'ship');

        this.setOrigin(0.5, 1);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const bounds = scene.physics.world.bounds;
        const max = bounds.bottom + this.height + config.step;
        let rightSide = config.initialRight;
        for (let y = config.step; y < max; y += config.step) {
            if (rightSide) {
                path.lineTo(bounds.right, y);
            } else {
                path.lineTo(bounds.left, y);
            }
            rightSide = !rightSide;
        }

        this.startFollow({
            duration: 1000 * path.getLength() / config.speed,
            onComplete: () => this.destroy(),
        });

        this.name = 'Sweep Baddy';
    }
}
