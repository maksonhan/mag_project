let firstAmountParticles = 600;
let firstApproach = true;
let tumblerDraw = false;
let amountParticles = firstAmountParticles;
let maxParticlesVertical = 25;
let constSpeed = 1;
let counterFillChannel = 45;

//inizialization sample shape
let SideX;
let SideY;
let b;
let b2;
let a;
let a2;
let wchan;
let r1;
let r2;
let r3;

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
    this.cornerZone = false;
  }

  createParticle() {
    firstApproach ? circle(this.x, this.y, this.r) : circle(this.x, this.y, this.r + 2);
  }

  restartPos() {
    this.x = this.xFirst;
    this.y = this.yFirst;
    // this.xSpeed = 0;
    // this.ySpeed = 0;
    counterFillChannel += 0.005;
  }

  chooseCentrPartcleDir() {
    //расстояние до верхнего края центральной части
    let distY1 = abs(this.y - (SideY/2 - b2 + wchan ));
    //расстояние до нижнего края центральной части
    let distY2 = abs(this.y - (SideY/2 + b2 - wchan ));
    //расстояние до левого края центральной части
    let distX1 = abs(this.x - (SideX/2 - a2 + wchan ));
    //расстояние до правого края центральной части
    let distX2 = abs(this.x - (SideX/2 + a2 - wchan ));

    // Остановка движения частиц находящихся на линии раздела течения
    if(((distY1 == distY2) & (distY1/distX1 <= 1) & (distY1/distX2 <= 1)) || (distX2/distY1 == 1) || (distX1/distY1 == 1) || (distX1/distY2 == 1) || (distX2/distY2 == 1)) return;

    //разбивакем движение по секторам
    if(distY1 < distY2 & (distX1/distY1) > 1 & (distX2/distY1) > 1) this.y -= constSpeed;
    else if (distY2 < distY1 & (distX1/distY2) > 1 & (distX2/distY2) > 1) this.y += constSpeed;
    else if(distX1 < distX2) this.x -= constSpeed;
    else this.x += constSpeed;

    
  }

  checkCrossCornerChannel(hx,hy) {

    // let diag = sqrt(2*sq(r1+ wchan));
    // let delta = diag - r1 + wchan;

    // let firstDis = dist(this.xFirst, this.yFirst, hx, hy);

    // let dis = dist(this.x, this.y, hx, hy);

    // if(firstDis >= diag) {
    //   dis <= diag? this.restartPos() : NaN;
    // }

    // else {
    //   dis <= (r1+wchan) ? this.restartPos() : NaN;
    // }

    let dis = dist(this.x, this.y, hx, hy);
    dis <= (r2) ? this.restartPos() : NaN;

    // dis <= (sqrt(sq(a2-(a2-r1 - wchan) - wchan) + sq(b2-(b2-r1 - wchan) - wchan)) + wchan) ? this.restartPos() : NaN;
    // sqrt(sq(a2-r1) + sq(b2-r1)) + wchan;
  }


    checkCrossCornerChannel3 () {

    let diag = sqrt(sq(r2) + sq(r2));
    let delta = diag - r2;
    let disToVertexR2 = sqrt(sq(a2-r2) + sq(b2-r2));

    let dis = dist(this.x, this.y, SideX/2, SideY/2);
    dis <=  disToVertexR2 + (sqrt(sq(r2) + sq(r2)) - delta) ? this.restartPos() : NaN;
  }

  //   checkCrossCornerChannel4 () {

  //   let disCenterToVertexR2 = dist(SideX/2, SideY/2, SideX/2 + a2 - r2, SideY/2 - b2 + r2);

  //   let dis = dist(this.x, this.y, SideX/2, SideY/2);
  //   dis <=  disCenterToVertexR2 + r2 ? this.restartPos() : NaN;
  // }

  //   checkCrossCornerChannel2 () {

  //   let diag = sqrt(sq(r1) + sq(r1));
  //   let delta = diag - r1;

  //   let bigDiag = sqrt(sq(r2) + sq(r2));
  //   let bigDelta = bigDiag - r2;
    
  //   let dis = dist(this.x, this.y, SideX/2, SideY/2);
  //   dis <= sqrt(sq(r1) + sq(r1)) - delta ? this.restartPos() : NaN;
  // }


  moveParticle() {

    this.cornerZone = false;

    let maxR = Math.max(wchan + r1, r2);

    //разбиение движения по секторам с внешней стороны от канала

     // сектор S11
    if(this.x < SideX/2 + a2 - maxR & this.x > SideX/2 - a2 + maxR & this.y < SideY/2 - b2 ) 
    { 
      this.y += constSpeed;      
    }

    // сектор симметричный S13 по Ox
    else if(this.x <= SideX/2 - a2 + maxR & this.y <= SideY/2 - b2 + maxR & !(this.x > SideX/2 - a2 + wchan & this.y > SideY/2 - b2 + wchan) ) {

     //симметричный по Ox S13
      if(this.x <= SideX/2 - a2 + r2 & this.y <= SideY/2 - b2 + r2) {
      this.cornerZone = true;
      this.checkCrossCornerChannel(SideX/2 - a2 + r2, SideY/2 - b2 + r2 );
      // this.checkCrossCornerChannel3();
      this.x += PullToVertex(this.x,this.y,SideX/2 - a2 + r2, SideY/2 - b2 + r2).dirX;
      this.y += PullToVertex(this.x,this.y,SideX/2 - a2 + r2, SideY/2 - b2 + r2).dirY;
     }

     else if (this.y > SideY/2 - b2 + r2) {
      this.x += constSpeed;
     }

    else if (this.x > SideX/2 - a2 + r2 ) {
      this.y += constSpeed;
     }

    }

    // сектор симметричный S11 по Oy
    else if (this.x < SideX/2 + a2 - maxR & this.x > SideX/2 - a2 + maxR & this.y > SideY/2 + b2) {
        this.y -= constSpeed;
    }

    // сектор симметричный S13 по диагонали и аналогичный S24
    else if (this.x <= SideX/2 - a2 + maxR & this.y >= SideY/2 + b2 - maxR & !(this.x > SideX/2 - a2 + wchan & this.y < SideY/2 + b2 - wchan)) {
      

      //симметричный по диагонали S13
      if(this.x <= SideX/2 - a2 + r2 & this.y >= SideY/2 + b2 - r2) {
      this.cornerZone = true;
      this.checkCrossCornerChannel(SideX/2 - a2 + r2, SideY/2 + b2 - r2 );
      // this.checkCrossCornerChannel3();
      this.x += PullToVertex(this.x,this.y,SideX/2 - a2 + r2, SideY/2 + b2 - r2 ).dirX;
      this.y += PullToVertex(this.x,this.y,SideX/2 - a2 + r2, SideY/2 + b2 - r2 ).dirY;
     }

     else if (this.y < SideY/2 + b2 - r2) {
      this.x += constSpeed;
     }

    else if (this.x > SideX/2 - a2 + r2 ) {
      this.y -= constSpeed;
     } 
      
    }

    else if (this.x < SideX & this.y < SideY/2 + b2 - maxR) {
      //сектор S12
      if( this.x > SideX/2 + a2 & this.y > SideY/2 - b2 + maxR) {
        this.x -= constSpeed;
      }
      //сектор симметричный S12 по Ox
      else if(this.x < SideX/2 - a2) {
        this.x += constSpeed;
      }

      //сектор S13
      else if(this.x >= SideX/2 + a2 - maxR & this.y <= SideY/2 - b2 + maxR & !(this.x < SideX/2 + a2 - wchan & this.y > SideY/2 - b2 + wchan)  ) {
        
         // S13
         if(this.x >= SideX/2 + a2 - r2 & this.y <= SideY/2 - b2 + r2) {
          this.cornerZone = true;
          this.checkCrossCornerChannel(SideX/2 + a2 - r2, SideY/2 - b2 + r2 );
          // this.checkCrossCornerChannel3();
          this.x += PullToVertex(this.x,this.y,(SideX/2 + a2-r2),(SideY/2 - b2 + r2)).dirX;
          this.y += PullToVertex(this.x,this.y,(SideX/2 + a2-r2),(SideY/2 - b2 + r2)).dirY;
         }

         else if (this.y > SideY/2 - b2 + r2) {
          this.x -= constSpeed;
         }

        else if (this.x < SideX/2 + a2 - r2 ) {
          this.y += constSpeed;
         }
        
      }

    }

    //сектор симметричный S13 по Oy
    else if (this.x >= SideX/2 + a2 - maxR & this.y >= SideY/2 + b2 - maxR & !(this.x < SideX/2 + a2 - wchan & this.y < SideY/2 + b2 - wchan) ) {

     //симметричный по Oy S13
      if(this.x >= SideX/2 + a2 - r2 & this.y >= SideY/2 + b2 - r2) {
      this.cornerZone = true;
      this.checkCrossCornerChannel(SideX/2 + a2 - r2, SideY/2 + b2 - r2 );
      // this.checkCrossCornerChannel3();
      this.x += PullToVertex(this.x,this.y,SideX/2 + a2 - r2, SideY/2 + b2 - r2).dirX;
      this.y += PullToVertex(this.x,this.y,SideX/2 + a2 - r2, SideY/2 + b2 - r2).dirY;
     }

     else if (this.y < SideY/2 + b2 - r2) {
      this.x -= constSpeed;
     }

    else if (this.x < SideX/2 + a2 - r2 ) {
      this.y -= constSpeed;
     }     

    }


    // рестарт частиц, которые залетели в канал с внешней части детали (относительно канала), не считая угловые зоны
    if (!this.cornerZone) {
      if (!((this.x >= SideX/2 - a2 + wchan & this.x <= SideX/2 + a2 - wchan) & (this.y >= SideY/2 - b2 + wchan & this.y <= SideY/2 + b2 - wchan)))  {
         ((this.x >= SideX/2 - a2 & this.x <= SideX/2 + a2) & (this.y >= SideY/2 - b2 & this.y <= SideY/2 + b2)) ? this.restartPos() : NaN;
      }
    }



    if(this.x >= SideX || this.x <=  0) {     
      this.restartPos();
    }
    if(this.y >= SideY || this.y <=  0) {     
      this.restartPos();      
    }


    //определение движения частиц в центральной части заготовки
    if((this.x <= SideX/2 + a2 - wchan & this.y <= SideY/2 + b2 - wchan) & (this.x >= SideX/2 - a2 + wchan & this.y >= SideY/2 - b2 + wchan)) {

      this.chooseCentrPartcleDir();

      //сектор S24
     if(this.x > SideX/2 + a2 - wchan - r1 & this.y < SideY/2 - b2 + wchan + r1) {
      (dist(this.x, this.y, SideX/2 + a2 - wchan - r1, SideY/2 - b2 + wchan + r1) > r1) ?  this.restartPos() : NaN;
      this.x -= PullToVertex(this.x,this.y,(SideX/2 + a2-wchan-r1),(SideY/2 - b2 + wchan + r1)).dirX;
      this.y -= PullToVertex(this.x,this.y,(SideX/2 + a2-wchan-r1),(SideY/2 - b2 + wchan + r1)).dirY;
     }

      //сектор симмитричный S24 по Oy 
     if(this.x > SideX/2 + a2 - wchan - r1 & this.y > SideY/2 + b2 - wchan - r1) {
      (dist(this.x, this.y, SideX/2 + a2 - wchan - r1, SideY/2 + b2 - wchan - r1) > r1) ?  this.restartPos() : NaN;
      this.x -= PullToVertex(this.x, this.y, SideX/2 + a2 - wchan - r1, SideY/2 + b2 - wchan - r1).dirX;
      this.y -= PullToVertex(this.x, this.y, SideX/2 + a2 - wchan - r1, SideY/2 + b2 - wchan - r1).dirY;
     }

      //сектор симметричный S24 по Ox 
     if(this.x < SideX/2 - a2 + wchan + r1 & this.y < SideY/2 - b2 + wchan + r1) {
      (dist(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 - b2 + wchan + r1) > r1) ?  this.restartPos() : NaN;
      this.x -= PullToVertex(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 - b2 + wchan + r1).dirX;
      this.y -= PullToVertex(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 - b2 + wchan + r1).dirY;
     }

      //сектор симметричный S24 по диагонали 
     if(this.x < SideX/2 - a2 + wchan + r1 & this.y > SideY/2 + b2 - wchan - r1) {
      (dist(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 + b2 - wchan - r1) > r1) ?  this.restartPos() : NaN;
      this.x -= PullToVertex(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 + b2 - wchan - r1).dirX;
      this.y -= PullToVertex(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 + b2 - wchan - r1).dirY;
     }

      // если частица вылетает за пределы контура центральной части или внешней части за каналом, - резетаем
      if (!((this.x >= SideX/2 - a2 + wchan & this.x <= SideX/2 + a2 - wchan) & (this.y >= SideY/2 - b2 + wchan & this.y <= SideY/2 + b2 - wchan))) {
        this.restartPos();
      }
    }

  }


  makeTrace() {
    push();
    firstApproach ? strokeWeight(0.3) : strokeWeight(0.7);
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

  createCanvas(1000, 730);


  for(let i = 0; i<amountParticles; i++) {
    particles.push(new MetalParticle());
  }

  b =  document.getElementById('b').value*10;
  b2 =  document.getElementById('b2').value*10;
  a =  document.getElementById('a').value*10;
  a2 =  document.getElementById('a2').value*10;
  wchan =  document.getElementById('wchan').value*10;
  SideX =  a*2;;
  SideY =  b*2;
  r1 =  document.getElementById('r1').value*10;
  r2 =  document.getElementById('r2').value*10;
  r3 =  document.getElementById('r3').value*10;

  setGrid(particles);

  noLoop();
}


function draw() {

  background('#2b2D31');
  fill('#BAC3D5');
  stroke('#333');

  //вырисовка первого приближения
  if(firstApproach) {

    rectMode(CENTER);
    rect(width/2, height/2, SideX, SideY, r3);

    //постепенная заливка канала
    (counterFillChannel <= 84) ? fillChannel(counterFillChannel) : fillChannel(84);

    fill('#BAC3D5');
    rect(width/2, height/2, a2*2-wchan*2, b2*2-wchan*2, r1);

    push();
    translate(width/2 - SideX/2,height/2 - SideY/2);
    fill('red');


    for (let i = 0; i<particles.length; i++) {
      particles[i].createParticle();
      particles[i].moveParticle();
      particles[i].makeTrace();
    }

    pop();

    defLines();

  }

  //вырисовка второго приближения
   if(!firstApproach) {

    rectMode(CENTER);
    rect(0, height, SideX, SideY, r3);

    //постепенная заливка канала
    (counterFillChannel <= 84) ? fillChannel(counterFillChannel) : fillChannel(84);

    fill('#BAC3D5');
    rect(0, height, a2*2-wchan*2, b2*2-wchan*2, r1);

    push();
    translate(-SideX/2, height-SideY/2);
    fill('red');

    for (let i = 0; i<particles.length; i++) {
      particles[i].createParticle();
      particles[i].moveParticle();
      particles[i].makeTrace();
    }
    pop();

    defLines();

   }



  
}



function setGrid(particles) {

  let devider = ceil(firstAmountParticles/maxParticlesVertical); //делитель определяет количество стобцов на которое будет разбиваться сетка из частиц

  for(let a = 0; a<devider; a++) {
  let sliceParticles = particles.slice((firstAmountParticles/devider)*a, (firstAmountParticles/devider)*(a+1));

  for (let i = 0; i<sliceParticles.length; i++) {

    let posX = (a+1)*SideX/(devider+1);
    let posY = (i+1)*SideY/(sliceParticles.length+1);

     //проверяем расположение частиц относительно внутренного контура, если попадают, то перепрыгиваем на следующую итерацию, не присваивая значения
    if( (posX <= SideX/2 + a2 & posX >= SideX/2 - a2 ) & (posY <= SideY/2 + b2 & posY >= SideY/2 - b2)) { 


      let bigDiag = sqrt(sq(r2) + sq(r2));
      let bigDelta = bigDiag - r2;

      let diag = sqrt(sq(r1) + sq(r1));
      let delta = diag - r1;
      

       // Убираем частицы, которые попадают в новый внутренний контур при изменении параметров изделия
      if (!((posX >= SideX/2 - a2 + wchan & posX <= SideX/2 + a2 - wchan) & (posY >= SideY/2 - b2 + wchan & posY <= SideY/2 + b2 - wchan)) & (dist(SideX/2, SideY/2, posX, posY) < sqrt(sq(a2) + sq(b2)) - bigDelta ) ) { 
       
        // (dist(SideX/2, SideY/2, posX, posY) <= sqrt(sq(a2 - wchan) + sq(b2 - wchan)) + wchan - 1 )
        sliceParticles[i].x = NaN; 
        sliceParticles[i].y = NaN;
        sliceParticles[i].xFirst = NaN;
        sliceParticles[i].yFirst = NaN;
        continue;
      }

      else if(((posX >= SideX/2 - a2 + wchan & posX <= SideX/2 + a2 - wchan) & (posY >= SideY/2 - b2 + wchan & posY <= SideY/2 + b2 - wchan)) & (dist(SideX/2, SideY/2, posX, posY) > sqrt(sq(a2 - wchan) + sq(b2 - wchan)) - delta )  ) {
        sliceParticles[i].x = NaN; 
        sliceParticles[i].y = NaN;
        sliceParticles[i].xFirst = NaN;
        sliceParticles[i].yFirst = NaN;
        continue;
      }

    }

    // убираем частицы, которые остались после обрезания углов заготовки r3
    else {
      let diag = sqrt(sq(r3) + sq(r3));
      let delta = diag - r3;

      if ( dist(SideX/2, SideY/2, posX, posY) > sqrt(sq(SideX/2) + sq(SideY/2)) - delta  ) { 
       
        sliceParticles[i].x = NaN; 
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

  counterFillChannel = 45

  //проверяем на корректно введеные значения
  if(!checkInp()) {event.preventDefault()};

  if(firstApproach) {
    b =  document.getElementById('b').value*10;
    b2 =  document.getElementById('b2').value*10;
    a =  document.getElementById('a').value*10;
    a2 =  document.getElementById('a2').value*10;
    SideX =  a*2;
    SideY =  b*2;
    wchan =  document.getElementById('wchan').value*10;
    r1 =  document.getElementById('r1').value*10;
    r2 =  document.getElementById('r2').value*10;
    r3 =  document.getElementById('r3').value*10;
  }

  else {
    b =  2.3*document.getElementById('b').value*10;
    b2 =  2.3*document.getElementById('b2').value*10;
    a =  2.3*document.getElementById('a').value*10;
    a2 =  2.3*document.getElementById('a2').value*10;
    SideX =  a*2;
    SideY =  b*2;
    wchan =  2.3*document.getElementById('wchan').value*10;
    r1 =  2.3*document.getElementById('r1').value*10;
    r2 =  2.3*document.getElementById('r2').value*10;
    r3 =  2.3*document.getElementById('r3').value*10;
  }
 


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
  if (Number(document.getElementById('a2').value) >= Number(document.getElementById('a').value)) {
    alert('Значение a должно быть > a2');
    return false;
  }
  else if (Number(document.getElementById('b2').value) >= Number(document.getElementById('b').value)) {
    alert('Значение b должно быть > b2');
    return false;
  }

  else if (Number(document.getElementById('wchan').value) >= Number(document.getElementById('a2').value)) {
    alert('Значение ширины канала не должно быть > а1');
    return false;
  }

  else if (Number(document.getElementById('wchan').value) >= Number(document.getElementById('b2').value)) {
    alert('Значение ширины канала не должно быть > а2');
    return false;
  }

  // else if (sq(Number(document.getElementById('r3').value)) > (Number(document.getElementById('b2').value) * Number(document.getElementById('a2').value))/2 ) {
  //   alert('Значение r3*r3 не может быть > (a2 * b2)/2, иначе обрежется канал заготовки');
  //   return false;
  // }

  // else if (Number(document.getElementById('r3').value) > Number(document.getElementById('b').value) || Number(document.getElementById('r3').value) > Number(document.getElementById('a').value) ) {
  //   alert('Значение r3 не может быть > a или b, согласно геометрическим ограничениям прямоугольника со скрулёнными углами ');
  //   return false;
  // }

  else if ( Number(document.getElementById('r3').value) > Math.min(Number(document.getElementById('a').value), Number(document.getElementById('b').value) )  ) {
    alert(`Максимальное значение скругления r3 при текущих параметрах заготовки = ${Math.min(Number(document.getElementById('a').value), Number(document.getElementById('b').value))}`);
    return false;
  }

  else if ( Number(document.getElementById('r2').value) > Math.min(Number(document.getElementById('a2').value), Number(document.getElementById('b2').value))  ) {
    alert(`Максимальное значение скругления r2 при текущих параметрах заготовки = ${Math.min(Number(document.getElementById('a2').value), Number(document.getElementById('b2').value) )}`);
    return false;
  }

  else if ( Number(document.getElementById('r2').value) < sqrt(2*sq(Number(document.getElementById('r2').value) - Number(document.getElementById('wchan').value)  ) )  ) {
    alert(`Максимальное значение скругления r2 при текущих параметрах заготовки = ${ (-Number(document.getElementById('wchan').value)*sqrt(2)/(1-sqrt(2)) ) }`);
    return false;
  }

  else if (Number(document.getElementById('r1').value) > Math.min((Number(document.getElementById('a2').value) - Number(document.getElementById('wchan').value)), (Number(document.getElementById('b2').value) - Number(document.getElementById('wchan').value)))  ) {
    alert(`Максимальное значение скругления r1 при текущих параметрах заготовки = ${Math.min((Number(document.getElementById('a2').value) - Number(document.getElementById('wchan').value)), (Number(document.getElementById('b2').value) - Number(document.getElementById('wchan').value)) )}`);
    return false;
  }

  else
    {return true;}
  
}


function resetSketch() {
  counterFillChannel = 45;
  deleteAddedParicles();
  stopDraw();

  for(let i = 0; i<particles.length; i++) {
    particles[i].x = particles[i].xFirst;
    particles[i].y = particles[i].yFirst;
  }   
}



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



function changeApproach() {

  deleteAddedParicles();

  firstApproach = !firstApproach;

  if(!firstApproach) {
    
    b *= 2.3;
    b2 *= 2.3;
    a *= 2.3;
    a2 *= 2.3;
    wchan *= 2.3;
    SideX *= 2.3;
    SideY *= 2.3;
    constSpeed *= 2.3;
    r1 *= 2.3;
    r2 *= 2.3;
    r3 *= 2.3;

    setGrid(particles);
    firstApproach = false;

    document.getElementById('changeApproach').innerText = "Первое приблжение";
  }

  else {
    
    b /= 2.3;
    b2 /= 2.3;
    a /= 2.3;
    a2 /= 2.3;
    wchan /= 2.3;
    SideX /= 2.3;
    SideY /= 2.3;
    constSpeed /= 2.3;
    r1 /= 2.3;
    r2 /= 2.3;
    r3 /= 2.3;

    setGrid(particles);
    firstApproach = true;

    document.getElementById('changeApproach').innerText = "Второе приблжение";
  }

  redraw();
}


function fillChannel(i) {
  colorMode(HSB);
  fill(220,13,i);

  if(firstApproach) rect(width/2, height/2, a2*2, b2*2, r2);

  else rect(0, height, a2*2, b2*2, r2);

  
  colorMode(RGB);
}


function defLines() {

  strokeWeight(2);

  if(firstApproach) {
    stroke('#FFAA64');
    line(0, height/2 - b+r3, width, height/2 - b+r3);
    stroke('#48FF54');
    line(width/2+a-r3,height,width/2+a-r3,0);
    stroke('#FF70C7');
    line(0,height/2 - b2 + wchan + r1,width,height/2 - b2 + wchan + r1);
    stroke('#C7CDFF');
    line(width/2 + a2 - wchan - r1,0, width/2 + a2 - wchan - r1, height);

    noStroke();
    fill(255);
    textSize(15);
    text('b-r3',width-50, height/2 - b+r3 - 5);
    text('a-r3',width/2+a-r3 + 5, 25); 
    text('b1-r1',width-50, height/2 - b2 + wchan + r1 +20);
    text('a1-r1',width/2 + a2 - wchan - r1 -50, 25);
  }

  else {
    stroke('#FFAA64');
    line(0, height - b+r3, width, height - b +r3);
    stroke('#48FF54');
    line(a-r3,height,a-r3,0);
    stroke('#FF70C7');
    line(0,height - b2 + wchan + r1,width,height - b2 + wchan + r1);
    stroke('#C7CDFF');
    line(a2 - wchan - r1,0, a2 - wchan - r1, height);

    noStroke();
    fill(255);
    textSize(15);
    text('b-r3',width - 50,  height - b+r3 - 5);
    text('a-r3',a-r3 + 5, 20); 
    text('b1-r1', width - 50, height - b2 + wchan + r1 +20);
    text('a1-r1',a2 - wchan - r1 -50, 20);
  }

  strokeWeight(1);
 
}


function mouseClicked() {
  //Добавляем новую частицу при нажатии
  particles.push(new MetalParticle());
  amountParticles += 1;
  
  particles[amountParticles - 1].x = mouseX;
  particles[amountParticles - 1].y = mouseY;
  particles[amountParticles - 1].createParticle();

  if (firstApproach) {
    // translate(width/2 - SideX/2,height/2 - SideY/2);
    //т.к в функции draw происходит translate (смещение кисти) перед рисованием точек, нужно так же сместиться (в текущем случае в верхний левый угол заготовки)
    particles[amountParticles - 1].x = mouseX - (width/2 - SideX/2);
    particles[amountParticles - 1].y = mouseY - (height/2 - SideY/2);
    particles[amountParticles - 1].xFirst = mouseX - (width/2 - SideX/2);
    particles[amountParticles - 1].yFirst = mouseY - (height/2 - SideY/2);
  }

  else {
    // translate(-SideX/2, height-SideY/2);
    particles[amountParticles - 1].x = mouseX  + SideX/2;
    particles[amountParticles - 1].y = mouseY - (height - SideY/2);
    particles[amountParticles - 1].xFirst = mouseX + SideX/2;
    particles[amountParticles - 1].yFirst = mouseY - (height - SideY/2);
  }
  
}

function deleteAddedParicles() {
  //удаляем все добавленные мышкой частицы до первоначального количества
  amountParticles = firstAmountParticles;
  particles = particles.slice(0, amountParticles);
}
