import Phaser from 'phaser';

import Config from './config';
import levels from './levels';
import Player from './player';

import bulletImage from './assets/bullet.png';
import shipImage from './assets/ship.png';

export default class GameScene extends Phaser.Scene {

    constructor(level) {
        super({
            key: 'gameScene',
        });
    }

    init(data) {
        this.levelNumber = data.nextLevelNumber;
        this.level = levels[this.levelNumber];
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

    endLevel() {
        const levelsLeft = levels.length - this.levelNumber - 1;
        const nextScene = levelsLeft ? 'levelEndScene' : 'endScene';
        const startNextScene = () => {
            this.scene.start(
                nextScene,
                { nextLevelNumber: this.levelNumber + 1 }
            );
        };

        this.time.addEvent({
            delay: 1000,
            callback: startNextScene,
        });
    }

    setupLevel() {
        let baddiesLeft = this.level.length;

        for (const item of this.level) {
            const addBaddy = () => {
                const newBaddy = new item.type(this, item.config);
                this.baddies.add(newBaddy);
                newBaddy.on('destroy', () => {
                    baddiesLeft--;
                    if (baddiesLeft === 0) {
                        this.endLevel();
                    }
                });
            };

            this.time.addEvent({
                callback: addBaddy,
                delay: item.time * 1000,
            });
        }
    }

    update() {
        this.player.update();
    }
}