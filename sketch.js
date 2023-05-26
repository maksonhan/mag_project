let tumblerDraw = false;
let amountParticles = 600;
let maxParticlesVertical = 25;
let constSpeed = 1;

//inizialization sample shape
let SideX;
let SideY;
let b2;
let a2;
let b1;
let a1;
let wchan;

class MetalParticle {

  constructor() {
    this.x;
    this.y;
    this.xFirst;
    this.yFirst;
    this.r = 3;
    this.xSpeed;
    this.ySpeed;
    this.trace = [];
  }

  createParticle() {
    circle(this.x, this.y, this.r);
  }

  restartPos() {
    this.x = this.xFirst;
    this.y = this.yFirst;
    // this.xSpeed = 0;
    // this.ySpeed = 0;
  }

  chooseCentrPartcleDir() {
    //расстояние до верхнего края центральной части
    let distY1 = abs(this.y - (SideY/2 - a2 + wchan ));
    //расстояние до нижнего края центральной части
    let distY2 = abs(this.y - (SideY/2 + a2 - wchan ));
    //расстояние до левого края центральной части
    let distX1 = abs(this.x - (SideX/2 - a1 + wchan ));
    //расстояние до правого края центральной части
    let distX2 = abs(this.x - (SideX/2 + a1 - wchan ));

    if(((distY1 == distY2) & (distY1/distX1 <= 1) & (distY1/distX2 <= 1)) || (distX2/distY1 == 1) || (distX1/distY1 == 1) || (distX1/distY2 == 1) || (distX2/distY2 == 1)) return;

    //разбивакем движение по секторам
    if(distY1 < distY2 & (distX1/distY1) > 1 & (distX2/distY1) > 1) this.y -= constSpeed;
    else if (distY2 < distY1 & (distX1/distY2) > 1 & (distX2/distY2) > 1) this.y += constSpeed;
    else if(distX1 < distX2) this.x -= constSpeed;
    else this.x += constSpeed;

    
  }


  moveParticle() {

    //разбиеие движения по секторам с внешней стороны от канала
    if(this.x < SideX/2 + a1 & this.y < SideY/2 - a2 ) {
      if( this.x > SideX/2 - a1 ) {
        this.y += constSpeed;
      }
      else {
        this.x += PullToVertex(this.x,this.y,(SideX/2 - a1),(SideY/2 - a2)).dirX;
        this.y += PullToVertex(this.x,this.y,(SideX/2 - a1),(SideY/2 - a2)).dirY;
      }
    }

    else if (this.x < SideX/2 + a1 & this.y > SideY/2 + a2) {
      if( this.x > SideX/2 - a1 ) {
        this.y -= constSpeed;
      }
      else {
        this.x += PullToVertex(this.x,this.y,(SideX/2 - a1),(SideY/2 + a2)).dirX;
        this.y += PullToVertex(this.x,this.y,(SideX/2 - a1),(SideY/2 + a2)).dirY;
      }
    }

    else if (this.x < SideX & this.y < SideY/2 + a2) {
      if( this.x > SideX/2 + a1 & this.y > SideY/2 - a2) {
        this.x -= constSpeed;
      }

      else if(this.x <= SideX/2 - a1) {
        this.x += constSpeed;
      }

      else if(this.x > SideX/2+a1 & this.y < SideY/2 - a2) {
        this.x += PullToVertex(this.x,this.y,(SideX/2 + a1),(SideY/2 - a2)).dirX;
        this.y += PullToVertex(this.x,this.y,(SideX/2 + a1),(SideY/2 - a2)).dirY;
      }

    }

    else {
      this.x += PullToVertex(this.x,this.y,(SideX/2 + a1),(SideY/2 + a2)).dirX;
      this.y += PullToVertex(this.x,this.y,(SideX/2 + a1),(SideY/2 + a2)).dirY;
    }



    // this.x += this.xSpeed;
    // this.y += this.ySpeed;
    if(this.x >= SideX || this.x <=  0) {     
      this.restartPos();
    }
    if(this.y >= SideY || this.y <=  0) {     
      this.restartPos();      
    }

    // if( dist(this.xFirst, this.yFirst, this.x,this.y) >= constSpeed*100) {     
    //   this.restartPos();      
    // }

    //проверка на попадание частицы во внутренний контур. 
    // if(this.y <= SideY/2 + a2 & this.x <= SideX/2 + a1) {
    //   if( this.x >= SideX/2 - a1 & this.y >=  SideY/2 - a2  ) this.restartPos();
    // }


    //разбиеие движения по секторам с внешней стороны от канала
    if((this.x <= SideX/2 + a1 & this.y <= SideY/2 + a2) & (this.x >= SideX/2 - a1 & this.y >= SideY/2 - a2)) {

      this.chooseCentrPartcleDir();

      if (!((this.x >= SideX/2 - a1 + wchan & this.x <= SideX/2 + a1 - wchan) & (this.y >= SideY/2 - a2 + wchan & this.y <= SideY/2 + a2 -wchan))) {
        this.restartPos();
      }
    }

  }


  makeTrace() {
    push();
    strokeWeight(0.3);
    stroke('#EB5250');
    line(this.x, this.y, this.xFirst, this.yFirst);
    pop();
  }

  // testTrace() {

  //   if(this.xSpeed != 0 || this.ySpeed != 0) {

  //     for(let i=0; i< this.trace.length; i++) {
  //       circle(this.trace[i].x, this.trace[i].y, 0.2);
  //     }

  //     let track = {x:this.x, y:this.y};
  //     this.trace.push(track);
  //   }
  //   else return;
    
  // }


}

let particles = [];


function setup() {
  createCanvas(1000, 800);


  for(let i = 0; i<amountParticles; i++) {
    particles.push(new MetalParticle());    

    // particles[i].xFirst = particles[i].x;
    // particles[i].yFirst = particles[i].y;
  }

  b2 =  document.getElementById('b2').value*10;
  a2 =  document.getElementById('a2').value*10;
  b1 =  document.getElementById('b1').value*10;
  a1 =  document.getElementById('a1').value*10;
  wchan =  document.getElementById('wchan').value*10;
  SideX =  b1*2;;
  SideY =  b2*2;

  setGrid(particles);

  noLoop();
}


function draw() {
  background(51);
  fill('#BAC3D5');
  
  beginShape();
  vertex(width/2 - SideX/2, height/2 - SideY/2);
  vertex(width/2 + SideX/2, height/2 - SideY/2);
  vertex(width/2 + SideX/2, height/2 + SideY/2);
  vertex(width/2 - SideX/2, height/2 + SideY/2);


  beginContour();
  vertex(width/2 - a1, height/2 - a2);
  vertex(width/2 - a1, height/2 + a2);
  vertex(width/2 + a1, height/2 + a2);
  vertex(width/2 + a1, height/2 - a2);
  endContour();

  endShape(CLOSE);

  fill('#BAC3D5');
  rect(width/2 - a1 + wchan, height/2 - a2 + wchan, a1*2-wchan*2, a2*2-wchan*2);

  translate(width/2 - SideX/2,height/2 - SideY/2);
  fill('red');


  for (let i = 0; i<particles.length; i++) {
    particles[i].createParticle();
    particles[i].moveParticle();
    particles[i].makeTrace();
  }
  
}



function setGrid(particles) {

  let devider = ceil(amountParticles/maxParticlesVertical); //делитель определяет количество стобцов на которое будет разбиваться сетка из частиц

  for(let a = 0; a<devider; a++) {
  let sliceParticles = particles.slice((amountParticles/devider)*a, (amountParticles/devider)*(a+1));

  for (let i = 0; i<sliceParticles.length; i++) {

    let posX = (a+1)*SideX/(devider+1);
    let posY = (i+1)*SideY/(sliceParticles.length+1);

    if( (posX <= SideX/2 + a1 & posY <= SideY/2 + a2) & (posX >= SideX/2 - a1 & posY >= SideY/2 - a2)) {
      //проверяем расположение частиц относительно внутренного контура, если попадают, то перепрыгиваем на следующую итерацию, не присваивая значения
      
      if (!((posX >= SideX/2 - a1 + wchan & posX <= SideX/2 + a1 - wchan) & (posY >= SideY/2 - a2 + wchan & posY <= SideY/2 + a2 -wchan))) {
        sliceParticles[i].x = NaN; // Убираем частицы, которые попадают в новый внутренний контур при изменение параметров изделия
        sliceParticles[i].y = NaN;
        sliceParticles[i].xFirst = NaN;
        sliceParticles[i].yFirst = NaN;
        continue;
      }

      // if( posX >= SideX/2-a1 & posY >= SideY/2 - a2  ) {
      //   sliceParticles[i].x = NaN; // Убираем частицы, которые попадают в новый внутренний контур при изменение параметров изделия
      //   sliceParticles[i].y = NaN;
      //   sliceParticles[i].xFirst = NaN;
      //   sliceParticles[i].yFirst = NaN;

      //   continue;
      // }
    }

    sliceParticles[i].x = posX;
    sliceParticles[i].y = posY;


    sliceParticles[i].xFirst = sliceParticles[i].x;
    sliceParticles[i].yFirst = sliceParticles[i].y;
  }

 }
}

function getShape(event) {

    //проверяем на корректно введеные значения
    if(!checkInp()) {event.preventDefault()};

    b2 =  document.getElementById('b2').value*10;
    a2 =  document.getElementById('a2').value*10;
    b1 =  document.getElementById('b1').value*10;
    a1 =  document.getElementById('a1').value*10;
    SideX =  b1*2;
    SideY =  b2*2;
    wchan =  document.getElementById('wchan').value*10;


    setGrid(particles);

    document.getElementById('simulation').style.display = "flex";
    document.getElementById('chart-section').style.display = "block";

    redraw();

    //скролинг к блоку
    const el = document.getElementById('simulation_block');
    el.scrollIntoView({behavior: "smooth"});
}


function checkInp() {

  //Проверка, на пустые инпуты
  if (Number(document.getElementById('a1').value) >= Number(document.getElementById('b1').value)) {
    alert('Значение b1 должно быть > a1');
    return false;
  }
  else if (Number(document.getElementById('a2').value) >= Number(document.getElementById('b2').value)) {
    alert('Значение b2 должно быть > a2');
    return false;
  }

  else if (Number(document.getElementById('wchan').value) >= Number(document.getElementById('a1').value)) {
    alert('Значение ширины канала не должно быть > а1');
    return false;
  }

  else if (Number(document.getElementById('wchan').value) >= Number(document.getElementById('a2').value)) {
    alert('Значение ширины канала не должно быть > а2');
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
  }   
}

// function reDrawRandomParticles() {

//   stopDraw()

//   for(let i = 0; i<particles.length; i++) {
//     particles[i].x = random(10, SideX-10);
//     particles[i].y = random(10, SideY-10);
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


function PullToVertex(x,y,hx,hy) {
  let changespeed = {dirX: 0, dirY: 0};
  let dis = dist(x,y,hx,hy);
  let t = dis/constSpeed;
  changespeed.dirX = abs(x-hx)/t;
  changespeed.dirY = abs(y-hy)/t;

  if(x-hx > 0) changespeed.dirX = -1*changespeed.dirX;
  if(y-hy > 0) changespeed.dirY = -1*changespeed.dirY;

  return changespeed;
}


// console.log(PullToVertex(particles[1].x,particles[1].y,a1,a2));