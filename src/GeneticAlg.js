const { Conf } = require("./Conf");
const { Rand } = require("./Util");
const { Board, Individual } = require("./Chess");
const _ = require("underscore");

class GeneticAlg
{
    constructor(population = 100)
    {
        let f = n => (n<2)?1: f(n-1) + n;
        Conf.STOP_CTR = f(Conf.QUEENS-1);
        console.log(Conf.STOP_CTR);

        // this.__forPresentationOnly(population);
        this.run(population);
    }

    run(population)
    {
        console.log("START");
        this.average = 0;
        this.population = this.genPopulation(population);

        let fitnessvals = this.population.map( x => x.fitness );
        
        let it = 0;
        while(!_.contains(fitnessvals, Conf.STOP_CTR) && it < Conf.MAX_ITER)
        {
            this.population = this.newGeneration(it);
            this.average += this.population[0].fitness;
            fitnessvals = this.population.map( x => x.fitness );
            it++;
        }

        let results = [];
        this.population.forEach(x => {
            if(x.fitness === Conf.STOP_CTR)
            {
                let board = new Board(Conf.QUEENS);
                board.update(x);
                console.log(x);
                results.push(board);
            }
        });

        this.average /= it;
        console.log("------------------------------");
        console.log("Results found: "+results.length);
        console.log("Fitness average: "+this.average);
        results.forEach(board => {
            board.print();
        });
    }

    newGeneration(it)
    {
        this.population = this.population.sort((a, b) => b.fitness - a.fitness);

        console.log("Running genect alg.. #"+it+" \t ["+(Conf.STOP_CTR-this.population[0].fitness)+" ~ "+(this.average/it)+"]");
        let newPopulation = [];
        for(let i=0; i < this.population.length; i++)
        {
            let parents = this.getParent();
            let child = this.reproduceCrossover(parents[0], parents[1]);

            if(Conf.MUTATE_FLAG){
                child = this.mutate(child);
            }

            newPopulation.push(child);
        }

        return newPopulation;
    }

    __forPresentationOnly(population)
    {
        // Initial population.  
        this.population = this.genPopulation(population);
        this.board = new Board();
        this.board.update(this.population[0]);
        this.board.print();

        // console.log(this.population);
        let ps = this.getParent();
        console.log("p1", ps[0]);
        console.log("p2", ps[1]);
        console.log("child", this.reproduceCrossover(ps[0], ps[1]));
    }

    genChromosome(){
        return Rand.sequence(Conf.QUEENS);
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

        child.calcFitness();
        return child;
    }
}

module.exports = {
    GeneticAlg : GeneticAlg
}