let tumblerDraw = false;
let amountParticles = 700;
let maxParticlesVertical = 25;

//inizialization sample shape
let SideA;
let SideB;
let b2;
let a2;
let b1;
let a1;

class MetalParticle {

  constructor() {
    // this.x = random(10, SideA-10);
    // this.y = random(10, SideB-10);
    this.x;
    this.y;
    this.xFirst;
    this.yFirst;
    this.r = 3;
    this.xSpeed = random(-0.5,0.5);
    this.ySpeed = random(-0.5,0.5);
  }

  createParticle() {
    circle(this.x, this.y, this.r);
  }

  restartPos() {
    // this.x = this.xFirst;
    // this.y = this.yFirst;
    this.xSpeed = 0;
    this.ySpeed = 0;
  }


  moveParticle() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if(this.x >= SideA || this.x <=  0) {     
      this.restartPos();
    }
    if(this.y >= SideA || this.y <=  0) {     
      this.restartPos();      
    }

    //проверка на попадание частицы во внутренний контур. 
    if(this.y <= SideB - a2 & this.x<= SideA - a1) {
      if( this.x >= a1 & this.y >=  a2  ) this.restartPos();
    }

  }

}

let particles = [];


function setup() {
  createCanvas(1000, 800);


  for(let i = 0; i<amountParticles; i++) {
    particles.push(new MetalParticle());    

    // particles[i].xFirst = particles[i].x;
    // particles[i].yFirst = particles[i].y;
  }

  // setGrid(particles);

  noLoop();
}


function draw() {
  background(51);
  fill('#BAC3D5');
  
  beginShape();
  vertex(width/2 - SideA/2, height/2 - SideB/2);
  vertex(width/2 + SideA/2, height/2 - SideB/2);
  vertex(width/2 + SideA/2, height/2 + SideB/2);
  vertex(width/2 - SideA/2, height/2 + SideB/2);


  beginContour();
  vertex(width/2 - SideA/2 + a1, height/2 - SideB/2 + a2);
  vertex(width/2 - SideA/2 + a1, height/2 + SideB/2 - a2);
  vertex(width/2 + SideA/2 - a1, height/2 + SideB/2 - a2);
  vertex(width/2 + SideA/2 - a1, height/2 - SideB/2 + a2);
  endContour();

  endShape(CLOSE);

  translate(width/2 - SideA/2,height/2 - SideB/2);
  fill('red');

  for (let i = 0; i<particles.length; i++) {
    particles[i].createParticle();
    particles[i].moveParticle();
  }

  
}



function setGrid(particles) {

  let devider = ceil(amountParticles/maxParticlesVertical); //делитель определяет количество стобцов на которое будет разбиваться сетка из частиц

  for(let a = 0; a<devider; a++) {
  let sliceParticles = particles.slice((amountParticles/devider)*a, (amountParticles/devider)*(a+1));

  for (let i = 0; i<sliceParticles.length; i++) {

    let posX = (a+1)*SideA/(devider+1);
    let posY = (i+1)*SideB/(sliceParticles.length+1);

    if(posY <= SideB - a2 & posX <= SideA - a1) {
      //проверяем расположение частиц относительно внутренного контура, если попадают, то перепрыгиваем на следующую итерацию, не присваивая значения
      if( posX >= a1 & posY >=  a2  ) {
        sliceParticles[i].x = NaN; // Убираем частицы, которые попадают в новый внутренний контур при изменение параметров изделия
        sliceParticles[i].y = NaN;
        sliceParticles[i].xFirst = NaN;
        sliceParticles[i].yFirst = NaN;

        continue;
      }
    }

    sliceParticles[i].x = posX;
    sliceParticles[i].y = posY;


    sliceParticles[i].xFirst = sliceParticles[i].x;
    sliceParticles[i].yFirst = sliceParticles[i].y;
  }

 }
}

function getShape(event) {
    b2 =  document.getElementById('b2').value*10;
    a2 =  b2-document.getElementById('a2').value*10;
    b1 =  document.getElementById('b1').value*10;
    a1 =  b1-document.getElementById('a1').value*10;
    SideA =  b1*2;;
    SideB =  b2*2;

    //проверяем на корректно введеные значения
    if(!checkInp(a1,b1,a2,b2)) {event.preventDefault()};

    setGrid(particles);

    document.getElementById('simulation').style.display = "flex";
    document.getElementById('chart-section').style.display = "block";

    redraw();

    //скролинг к блоку
    const el = document.getElementById('simulation_block');
    el.scrollIntoView({behavior: "smooth"});
}


function checkInp(a1,b1,a2,b2) {

  //Проверка, на пустые инпуты
  if (Number(document.getElementById('a1').value) >= Number(document.getElementById('b1').value)) {
    alert('Значение b1 должно быть > a1');
    return false;
  }
  else if (Number(document.getElementById('a2').value) >= Number(document.getElementById('b2').value)) {
    alert('Значение b2 должно быть > a2');
    return false;
  }
  else
    {return true;}
  
}


function resetSketch() {
  stopDraw();

  for(let i = 0; i<particles.length; i++) {
    particles[i].x = particles[i].xFirst;
    particles[i].y = particles[i].yFirst;
    particles[i].xSpeed = random(-0.5,0.5);
    particles[i].ySpeed = random(-0.5,0.5);
  }   
}

// function reDrawRandomParticles() {

//   stopDraw()

//   for(let i = 0; i<particles.length; i++) {
//     particles[i].x = random(10, SideA-10);
//     particles[i].y = random(10, SideB-10);
//   } 

// }


function stopDraw() {

  if(!tumblerDraw) {
    loop();   
    tumblerDraw = true;
  } else {
    noLoop();
    tumblerDraw = false;
  }

}


      


// let flock;

// function setup() {
//   createCanvas(640, 360);
//   createP("Drag the mouse to generate new boids.");

//   flock = new Flock();
//   // Add an initial set of boids into the system
//   for (let i = 0; i < 2; i++) {
//     let b = new Boid(width / 2,height / 2);
//     flock.addBoid(b);
//   }
// }

// function draw() {
//   background(51);
//   flock.run();
// }

// // Add a new boid into the System
// function mouseDragged() {
//   flock.addBoid(new Boid(mouseX, mouseY));
// }

// // The Nature of Code
// // Daniel Shiffman
// // http://natureofcode.com

// // Flock object
// // Does very little, simply manages the array of all the boids

// function Flock() {
//   // An array for all the boids
//   this.boids = []; // Initialize the array
// }

// Flock.prototype.run = function() {
//   for (let i = 0; i < this.boids.length; i++) {
//     this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually  
//   }
// }

// Flock.prototype.addBoid = function(b) {
//   this.boids.push(b);
// }

// // The Nature of Code
// // Daniel Shiffman
// // http://natureofcode.com

// // Boid class
// // Methods for Separation, Cohesion, Alignment added

// function Boid(x, y) {
//   this.acceleration = createVector(0, 0);
//   this.velocity = createVector(random(-1, 1), random(-1, 1));
//   this.position = createVector(x, y);
//   this.r = 3.0;
//   this.maxspeed = 3;    // Maximum speed
//   this.maxforce = 0.05; // Maximum steering force
// }

// Boid.prototype.run = function(boids) {
//   this.flock(boids);
//   this.update();
//   this.borders();
//   this.render();
// }

// Boid.prototype.applyForce = function(force) {
//   // We could add mass here if we want A = F / M
//   this.acceleration.add(force);
// }

// // We accumulate a new acceleration each time based on three rules
// Boid.prototype.flock = function(boids) {
//   let sep = this.separate(boids);   // Separation
//   let ali = this.align(boids);      // Alignment
//   let coh = this.cohesion(boids);   // Cohesion
//   // Arbitrarily weight these forces
//   sep.mult(1.5);
//   ali.mult(1.0);
//   coh.mult(1.0);
//   // Add the force vectors to acceleration
//   this.applyForce(sep);
//   this.applyForce(ali);
//   this.applyForce(coh);
// }

// // Method to update location
// Boid.prototype.update = function() {
//   // Update velocity
//   this.velocity.add(this.acceleration);
//   // Limit speed
//   this.velocity.limit(this.maxspeed);
//   this.position.add(this.velocity);
//   // Reset accelertion to 0 each cycle
//   this.acceleration.mult(0);
// }

// // A method that calculates and applies a steering force towards a target
// // STEER = DESIRED MINUS VELOCITY
// Boid.prototype.seek = function(target) {
//   let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
//   // Normalize desired and scale to maximum speed
//   desired.normalize();
//   desired.mult(this.maxspeed);
//   // Steering = Desired minus Velocity
//   let steer = p5.Vector.sub(desired,this.velocity);
//   steer.limit(this.maxforce);  // Limit to maximum steering force
//   return steer;
// }

// Boid.prototype.render = function() {
//   // Draw a triangle rotated in the direction of velocity
//   let theta = this.velocity.heading() + radians(90);
//   fill(127);
//   stroke(200);
//   push();
//   translate(this.position.x, this.position.y);
//   rotate(theta);
//   beginShape();
//   vertex(0, -this.r * 2);
//   vertex(-this.r, this.r * 2);
//   vertex(this.r, this.r * 2);
//   endShape(CLOSE);
//   pop();
// }

// // Wraparound
// Boid.prototype.borders = function() {
//   if (this.position.x < -this.r)  this.position.x = width + this.r;
//   if (this.position.y < -this.r)  this.position.y = height + this.r;
//   if (this.position.x > width + this.r) this.position.x = -this.r;
//   if (this.position.y > height + this.r) this.position.y = -this.r;
// }

// // Separation
// // Method checks for nearby boids and steers away
// Boid.prototype.separate = function(boids) {
//   let desiredseparation = 25.0;
//   let steer = createVector(0, 0);
//   let count = 0;
//   // For every boid in the system, check if it's too close
//   for (let i = 0; i < boids.length; i++) {
//     let d = p5.Vector.dist(this.position,boids[i].position);
//     // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
//     if ((d > 0) && (d < desiredseparation)) {
//       // Calculate vector pointing away from neighbor
//       let diff = p5.Vector.sub(this.position, boids[i].position);
//       diff.normalize();
//       diff.div(d);        // Weight by distance
//       steer.add(diff);
//       count++;            // Keep track of how many
//     }
//   }
//   // Average -- divide by how many
//   if (count > 0) {
//     steer.div(count);
//   }

//   // As long as the vector is greater than 0
//   if (steer.mag() > 0) {
//     // Implement Reynolds: Steering = Desired - Velocity
//     steer.normalize();
//     steer.mult(this.maxspeed);
//     steer.sub(this.velocity);
//     steer.limit(this.maxforce);
//   }
//   return steer;
// }

// // Alignment
// // For every nearby boid in the system, calculate the average velocity
// Boid.prototype.align = function(boids) {
//   let neighbordist = 50;
//   let sum = createVector(0,0);
//   let count = 0;
//   for (let i = 0; i < boids.length; i++) {
//     let d = p5.Vector.dist(this.position,boids[i].position);
//     if ((d > 0) && (d < neighbordist)) {
//       sum.add(boids[i].velocity);
//       count++;
//     }
//   }
//   if (count > 0) {
//     sum.div(count);
//     sum.normalize();
//     sum.mult(this.maxspeed);
//     let steer = p5.Vector.sub(sum, this.velocity);
//     steer.limit(this.maxforce);
//     return steer;
//   } else {
//     return createVector(0, 0);
//   }
// }

// // Cohesion
// // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
// Boid.prototype.cohesion = function(boids) {
//   let neighbordist = 50;
//   let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
//   let count = 0;
//   for (let i = 0; i < boids.length; i++) {
//     let d = p5.Vector.dist(this.position,boids[i].position);
//     if ((d > 0) && (d < neighbordist)) {
//       sum.add(boids[i].position); // Add location
//       count++;
//     }
//   }
//   if (count > 0) {
//     sum.div(count);
//     return this.seek(sum);  // Steer towards the location
//   } else {
//     return createVector(0, 0);
//   }
// }


