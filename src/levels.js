import ApproachBaddy from './approachBaddy';
import BasicBaddy from './basicBaddy';
import SweepBaddy from './sweepBaddy';

const level1 = [

    {
        config: {
            acceleration: 500,
            maxSpeed: 200,
            x: 300,
            y: 100,
        },
        time: 1,
        type: ApproachBaddy,
    },
];

const level2 = [

    {
        config: {
            x: 180,
            speed: 400,
            step: 100,
            fromRight: false,
        },
        time: 5,
        type: SweepBaddy,
    },

    {
        config: {
            x: 180,
            speed: 400,
            step: 100,
            fromRight: true,
        },
        time: 5,
        type: SweepBaddy,
    },


    {
        config: {
            x: 200,
            speed: 400,
        },
        time: 7.4,
        type: BasicBaddy,
    },

];

export default [level1, level2];
