const _ = require("underscore");

module.exports =
{
    Rand: 
    {
        /**
         * Returns a random number between 0..n;
         * @param {int} n 
         */
        number(n) 
        {
            return _.random(n-1);
        },

        /**
         * Returns a random float.
         */
        float() 
        {
            return Math.random()
        },

        /**
         * Returns an Array with shuffled ints.
         * @param {int} n - array length. 
         */
        sequence(n)
        {
            let arr = [];
            for(let i=0; i < n; i++, arr[i-1] = _.random(n-1));
            return arr;
        }
    }
};