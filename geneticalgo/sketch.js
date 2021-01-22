// Cities
var cities = [];
//var totalCities = window.prompt("Enter number of cities: ");
//var totalCities = 10;

// Best path overall
var recordDistance = Infinity;
var bestEver;

// Population of possible orders
var population = [];

//var popTotal = window.prompt("Enter population number: ");
var popTotal = 500;

function setup() {
	//console.log(cities_array);
    createCanvas(300, 600);

  // Make random cities
  for (var i = 0; i < cities_array.length; i++) {
  //  var vold = createVector(random(20, width - 20), random(20, height/2 - 60));
	var v =createVector(cities_array[i].x, cities_array[i].y);
    cities[i] = v;
  }

  //Create population
 for (var i = 0; i < popTotal; i++) {
    population[i] = new DNA(cities_array.length);
  }

}

function draw() {
	
  background(0);

  // Each round let's find the best and worst
  var minDist = Infinity;
  var maxDist = 0;
  // Search for the best this round and overall
  var bestNow;
  for (var i = 0; i < population.length; i++) {
    var d = population[i].calcDistance();
    // Is this the best ever?
    if (d < recordDistance) {
      recordDistance = d;
      bestEver = population[i];
    }
    // Is this the best this round?
    if (d < minDist) {
      minDist = d;
      bestNow = population[i];
    }
    // Is this the worst?
    if (d > maxDist) {
      maxDist = d;
    }
  }
  
  
  
   //show genetic algo output
  let s = 'Genetic Algorithm\n';
  fill(255);
  text(s, 10, 10, 250, 50); // Text wraps within text box
  // Show the best this round
  translate(50, 50);
  bestNow.show();
  //line( width/3, 0,width/3, height/2);
  line( 0, height/2,width, height/2);
  // Show the best ever!
  translate(0, height / 2);
  bestEver.show();
  //line( width/3, 0,width/3, height/2);

  // Map all the fitness values between 0 and 1
  var sum = 0;
  for (var i = 0; i < population.length; i++) {
    sum += population[i].mapFitness(minDist, maxDist);
  }
  // Normalize them to a probability between 0 and 1
  for (var i = 0; i < population.length; i++) {
    population[i].normalizeFitness(sum);
  }
  // Selection
  // A new population
  var newPop = [];
  // Sam population size
  for (var i = 0; i < population.length; i++) {
    // Pick two
    var a = pickOne(population);
    var b = pickOne(population);
    // Crossover!
    var order = a.crossover(b);
    newPop[i] = new DNA(cities_array.length, order);
  }
  // New population!
  population = newPop;
  
}

// This is a new algorithm to select based on fitness probability!
// It only works if all the fitness values are normalized and add up to 1
function pickOne() {
  // Start at 0
  var index = 0;
  // Pick a random number between 0 and 1
  var r = random(1);
  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= population[index].fitness;
    // And move on to the next
    index += 1;
  }
  // Go back one
  index -= 1;
  return population[index];
}