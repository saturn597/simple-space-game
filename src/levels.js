import ApproachBaddy from './approachBaddy';
import BasicBaddy from './basicBaddy';
import SweepBaddy from './sweepBaddy';

const level1 = [

    {
        config: {
            acceleration: 500,
            maxSpeed: 200,
            speed: 0,
            x: 180,
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
            initialRight: false,
        },
        time: 5,
        type: SweepBaddy,
    },

    {
        config: {
            x: 180,
            speed: 400,
            step: 100,
            initialRight: true,
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
