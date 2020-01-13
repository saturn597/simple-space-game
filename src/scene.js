import Phaser from 'phaser';

import Config from './config';
import Player from './player';

import bulletImage from './assets/bullet.png';
import shipImage from './assets/ship.png';

export default class Scene extends Phaser.Scene {

    constructor(level) {
        super({
            key: 'gameScene',
        });
    }

    init(data) {
        this.level = data;
    }

    preload() {
        this.load.image('ship', shipImage);
        this.load.image('bullet', bulletImage);
    }

    create() {
        const worldBounds = this.physics.world.bounds;

        // confine player to some portion of game area
        const playerBounds = new Phaser.Geom.Rectangle(
            worldBounds.x,
            worldBounds.y,
            worldBounds.width,
            worldBounds.height,
        );
        playerBounds.top = playerBounds.height * (Config.playerWorldFraction);

        // Mark upper edge of game area so we know when a bullet goes past it.
        // Could also do this using the global collideWorldBounds event.
        this.upperEdge = this.physics.add.existing(
            this.add.rectangle(0, -10, worldBounds.width, 10).setOrigin(0),
            true);  // true makes it a static body

        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: Config.bulletMax,
            velocityY: -Config.bulletVelocity,
        });

        this.baddies = this.physics.add.group();

        // The default callback when something is added to a group resets a
        // bunch of sprite values that we're setting in our baddy constructors,
        // so don't want that.
        this.baddies.createCallback = null;

        // run the update methods of baddies during updates
        this.baddies.runChildUpdate = true;

        this.physics.add.collider(
            this.bullets,
            this.upperEdge,
            ((e, b) => this.bullets.remove(b, true, true))
        );

        this.physics.add.collider(
            this.bullets,
            this.baddies,
            ((bullet, baddy) => {
                this.baddies.remove(baddy, true, true);
                this.bullets.remove(bullet, true, true);
            })
        );

        this.setupLevel();

        this.player = new Player(this, playerBounds);
    }

    setupLevel() {
        for (const baddy of this.level) {
            const cb = () =>
                this.baddies.add(new baddy.type(this, baddy.config));
            this.time.addEvent({
                callback: cb,
                delay: baddy.time * 1000,
            });
        }
    }

    update() {
        this.player.update();
    }
}
