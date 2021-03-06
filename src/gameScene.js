import Phaser from 'phaser';

import Config from './config';
import Explosion from './explosion';
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
        this.endEvent = null;
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

        // When members are added to a physics group, the group calls
        // internalCreateCallback, which sets values to defaults.  We don't
        // want any defaults set there, since it'd override values set in the
        // baddy constructors.
        this.baddies.internalCreateCallback = null;

        // run the update methods of baddies during updates
        this.baddies.runChildUpdate = true;

        this.player = new Player(this, playerBounds);

        this.physics.add.overlap(
            this.player.sprite,
            this.baddies,
            (playerSprite, baddySprite) => {
                // Damage player FIRST, since they should lose if they run out
                // of shields.
                this.damagePlayer();
                baddySprite.destroy();
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
        if (this.endEvent && this.shields > 0) {
            // This means we're already ending the level, and we still have
            // shields.  No changes needed.
            return;
        }

        if (this.endEvent && this.nextScene === 'gameOverScene') {
            // Also, no changes needed if a loss ending is already in process.
            return;
        }

        const levelsLeft = this.levels.length - this.levelNumber - 1;
        const nextLevelNumber = levelsLeft ? this.levelNumber + 1 : 0;

        let delay;

        if (this.shields <= 0) {
            // We've run out of shields, so should lose.
            if (this.endEvent) {
                // If we make it here, there's a victory ending in process, but
                // the loss should override it. Stop the existing end event.
                this.endEvent.remove();
            }
            delay = Config.lossDelay;
            this.nextScene = 'gameOverScene';
        } else {
            // If the level is ending and we haven't run out of shields, then
            // that's a victory. Complete the level or complete the game.
            delay = Config.levelCompletionDelay;
            this.nextScene = levelsLeft ? 'levelEndScene' : 'endScene';
        }

        const startNextScene = () => {
            const shields = levelsLeft ? this.shields : 0;

            this.scene.start(
                this.nextScene,
                {
                    nextLevelNumber,
                    shields,
                }
            );
        };

        this.endEvent = this.time.addEvent({
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
                newBaddy.on('explode', (x, y) => {
                    new Explosion(
                        this,
                        x,
                        y,
                        this.player.sprite,
                        () => this.damagePlayer(),
                        Config.explosionConfig,
                    );
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
