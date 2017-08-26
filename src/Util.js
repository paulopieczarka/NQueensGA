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
            return Math.floor(Math.random()*n);
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
            for(let i=0; i < n; i++, arr[i-1] = i-1);
            
            return _.shuffle(arr);
        }
    }
};