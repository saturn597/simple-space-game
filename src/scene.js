import Phaser from 'phaser';

import Config from './config';
import Player from './player';

import bulletImage from './assets/bullet.png';
import shipImage from './assets/ship.png';

export default class Scene extends Phaser.Scene {

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

        this.player = new Player(this, playerBounds);
    }

    update() {
        this.player.update();
    }
}
