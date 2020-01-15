import BasicBaddy from './basicBaddy';
import SweepBaddy from './sweepBaddy';

const level1 = [

    {
        config: {
            x: 180,
            speed: 400,
            step: 100,
            initialRight: true,
        },
        time: 1,
        type: SweepBaddy,
    },

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

export default [level1];
