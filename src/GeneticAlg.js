const { Conf } = require("./Conf");
const { Rand } = require("./Util");
const { Board, Individual } = require("./Chess");
const _ = require("underscore");

class GeneticAlg
{
    constructor(population = 100)
    {
        // Initial population.  
        this.population = this.genPopulation(population);
        this.board = new Board(Conf.QUEENS);
        this.board.update(this.population[0]);
        this.board.print();

        // console.log(this.population);
        let ps = this.getParent();
        console.log("p1", ps[0]);
        console.log("p2", ps[1]);
        console.log("child", this.reproduceCrossover(ps[0], ps[1]));
    }

    genChromosome(){
        return Rand.sequence(8);
    }

    genPopulation(size)
    {
        let population = Array(size).fill(null).map(
            x => new Individual(this.genChromosome()).calcFitness()
        );

        return population;
    }

    getParent()
    {
        let parent1 = null;
        let parent2 = null;

        let fitnessSum = 0;
        this.population.forEach(
            x => fitnessSum += x.fitness
        );
        
        this.population.forEach(
            x => x.survival = x.fitness/(fitnessSum*1.0)
        );

        while(true)
        {
            let parent1Rand = Math.random();
            let parent1Rn = this.population.map(
                x => { if(x.survival <= parent1Rand){ return x } }
            );

            if(parent1Rn[0]){
                parent1 = parent1Rn[0];
                break;
            }
        }

        while(true)
        {
            let parent2Rand = Math.random();
            let parent2Rn = this.population.map(
                x => { if(x.survival <= parent2Rand){ return x } }
            ); 

            let t = Rand.number(parent2Rn.length);
            if(parent2Rn[t])
            {
                parent2 = parent2Rn[t];
                if(!_.isEqual(parent2, parent1)){
                    break;
                }

                break;
            }
        }

        return [parent1, parent2];
    }

    reproduceCrossover(parent1, parent2)
    {
        let n = parent1.sequence.length;
        let c = Rand.number(n);

        let child = new Individual();
        child.sequence = [...parent1.sequence.slice(0, c), ...parent2.sequence.slice(c)];
        child.calcFitness();

        return child;
    }

    mutate(child)
    {
        if(child.survival < Conf.MUTATE)
        {
            let c = Rand.number(child.sequence.length);
            child.sequence[c] = Rand.number(Conf.QUEENS);
        }
    }
}

module.exports = {
    GeneticAlg : GeneticAlg
}