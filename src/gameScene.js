import Phaser from 'phaser';

import Config from './config';
import generateLevel from './levelGenerator';
import Player from './player';

import bulletImage from './assets/bullet.png';
import dropperImage from './assets/dropper.png';
import followerImage from './assets/follower.png';
import playerImage from './assets/player.png';
import sweeperImage from './assets/sweeper.png';


export default class GameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'gameScene',
        });

        this.levels = [generateLevel(0)];
    }

    init(data) {
        this.levelNumber = data.nextLevelNumber;
        this.level = this.levels[this.levelNumber];
        this.shields = data.shields;
        this.ending = false;
    }

    preload() {
        this.load.image('bullet', bulletImage);
        this.load.image('dropper', dropperImage);
        this.load.image('follower', followerImage);
        this.load.image('player', playerImage);
        this.load.image('sweeper', sweeperImage);
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

        this.graphics = this.add.graphics();
        this.graphics.alpha = 0;
        this.graphics.clear();
        this.graphics.lineStyle(1, 0xffffff, 1);
        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.fillRect(0, 0, worldBounds.width, worldBounds.height);

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

        this.player = new Player(this, playerBounds);

        this.physics.add.overlap(
            this.player.sprite,
            this.baddies,
            (playerSprite, baddySprite) => {
                baddySprite.destroy();
                this.damagePlayer();
            }
        );

        this.physics.add.overlap(
            this.bullets,
            this.baddies,
            (bullet, baddy) => {
                this.baddies.remove(baddy, true, true);
                this.bullets.remove(bullet, true, true);
            }
        );

        this.physics.add.collider(
            this.bullets,
            this.upperEdge,
            (e, b) => this.bullets.remove(b, true, true)
        );

        this.setupLevel();

        this.events.emit('setEnemies', this.level.length);
        this.events.emit('setLevel', this.levelNumber + 1);
        this.events.emit('setShields', this.shields);

    }

    damagePlayer() {
        this.flash();
        this.player.hit();
        this.shields--;
        if (this.shields < 0) {
            this.shields = 0;
        }
        this.events.emit('setShields', this.shields);

        if (this.shields <= 0) {
            this.endLevel();
        }
    }

    endLevel() {
        if (this.ending) {
            // The end of the scene could be triggered by more than one thing
            // at the same time. For example, the last baddy is destroyed by
            // colliding with the player, simultaneously reducing shields to 0.
            // Avoid letting our callback get called more than once.
            return;
        }
        this.ending = true;

        const levelsLeft = this.levels.length - this.levelNumber - 1;
        const nextLevelNumber = levelsLeft ? this.levelNumber + 1 : 0;

        let delay, nextScene;
        if (this.shields <= 0) {
            delay = Config.lossDelay;
            nextScene = 'gameOverScene';
        } else {
            delay = Config.levelCompletionDelay;
            nextScene = levelsLeft ? 'levelEndScene' : 'endScene';
        }

        const startNextScene = () => {
            const shields = levelsLeft ? this.shields : 0;

            this.scene.start(
                nextScene,
                {
                    nextLevelNumber,
                    shields,
                }
            );
        };

        this.time.addEvent({
            delay,
            callback: startNextScene,
        });
    }

    flash() {
        this.graphics.alpha = 1;
        this.tweens.add({
            targets: this.graphics,
            alpha: 0,
            duration: Config.flashDuration,
        });
    }

    setupLevel() {
        let baddiesLeft = this.level.length;

        for (const item of this.level) {
            const addBaddy = () => {
                const newBaddy = new item.type(this, item.config);
                this.baddies.add(newBaddy);
                newBaddy.on('escape', () => {
                    this.damagePlayer();
                });
                newBaddy.on('destroy', () => {
                    baddiesLeft--;
                    this.events.emit('setEnemies', baddiesLeft);
                    if (baddiesLeft === 0) {
                        this.endLevel();
                    }
                });
            };

            this.time.addEvent({
                callback: addBaddy,
                delay: item.time,
            });
        }
    }

    update() {
        this.player.update();
    }
}
