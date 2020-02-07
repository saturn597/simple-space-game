import Phaser from 'phaser';

import ApproachBaddy from './approachBaddy';
import BasicBaddy from './basicBaddy';
import SweepBaddy from './sweepBaddy';

import Config from './config';

const level1 = {
    // Baddy types that can appear in level
    baddyTypes: [
        ApproachBaddy,
        BasicBaddy,
        SweepBaddy,
    ],

    // Number of baddies in level
    count: 20,

    // Time it takes for baddy to appear after the previous one
    minDelay: 1000,
    maxDelay: 5000,

    // Bounds on the baddies
    bounds: {
        // Bounds on speed
        maxSpeed: 300,
        minSpeed: 100,

        // The size of the "step" for baddies that sweep left to right
        minStep: 50,
        maxStep: 200,

        // Bounds for starting coordinates
        minX: 0,
        maxX: Config.gameWidth,
        minY: 0,
        maxY: Config.gameHeight * (1 - Config.playerWorldFraction),

        // For baddies that accelerate, the ratio of acceleration to max
        // speed
        speedRatio: 1.5,
    },
};

const levelParams = [
    level1,
];


function generateLevel(difficulty) {
    const rnd = Phaser.Math.RND;

    const level = [];
    const params = levelParams[difficulty];

    let timeInLevel = 0;

    for (let i = 0; i < params.count; i++) {
        timeInLevel += rnd.integerInRange(params.minDelay, params.maxDelay);

        const baddyType = rnd.pick(params.baddyTypes);
        const newBaddy = {
            time: timeInLevel,
            type: baddyType,
            config: baddyType.randomConfig(params.bounds),
        };

        level.push(newBaddy);
    }

    return level;
}

export default generateLevel;
