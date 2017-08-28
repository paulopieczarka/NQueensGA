const _ = require("underscore");
const { Conf } = require("./Conf");

class Board
{
    constructor(size = 8)
    {
        this.matrix = null;
        this.size = size;
        this.clean();
    }

    clean() {
        this.matrix = Array(this.size).fill(0).map(
            x => Array(this.size).fill(0)
        );
    }

    update(individual)
    {
        this.clean();
        for(let i=0; i < this.size; i++){
            let x = individual.getGene(i);
            this.matrix[x][i] = 1;
        }
    }

    print()
    {
        console.log("------------------------------");
        console.log(this.matrix);
        console.log("------------------------------");
    }
}

class Individual
{
    constructor(chromosome)
    {
        this.sequence = chromosome ? chromosome : Array(8).fill(-1);
        this.fitness = 0.0;
        this.survival = null;
    }

    getGene(index){
        return this.sequence[index];
    }

    calcFitness(){
        this.fitness = this.getFitness();
        return this;
    }

    getFitness()
    {
        let clashes = 0;
        let rowColClashes = Math.abs(this.sequence.length - _.unique(this.sequence).length);
        clashes += rowColClashes;

        //Diagonal clashes.
        for(let i=0; i < this.sequence.length; i++)
        {
            for(let j=0; j < this.sequence.length; j++)
            {
                if(i != j)
                {
                    let dx = Math.abs(i - j);
                    let dy = Math.abs(this.sequence[i] - this.sequence[j]);
                    if(dx === dy){
                        clashes++;
                    }
                }
            }
        }

        // 28 max fitness.
        return Conf.STOP_CTR - clashes;
    }
}

module.exports = {
    Board : Board,
    Individual : Individual
}