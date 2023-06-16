//технические переменные
let fr = 30; // стартовый FPS
let firstAmountParticles = 600;
let firstApproach = true;
let scaleApproach = 2.3; // увеличение размеров детали при переходе ко второму приближению 
let zoom = 10; // умножение введёных значений для вырисовки на канвасе
let tumblerDraw = false;
let amountParticles = firstAmountParticles;
let maxParticlesVertical = 25;
let counterFillChannel = 45; //цветовое значение канала
let experimentMode = false;


//переменные процесса
let P = 200; //сила давления в kH
let t = 0; // счётчик кадров
let ptime  = t/fr; // реальное физическое время t/fr (счётчик кадров, деленное на количество кадров в секунду)
let constSpeed = 1;
let minHeight; //значение толщины при котором останавливается процесс
let currentHeight; //текущая толщина заготовки
let deltaH; // разница между текущей и первоначальной толщиной


//параметры изделия
let tetaS;
let sigmaS;
let h0; // первоначальная толщина
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
    this.cornerZone = false; //метка для частиц в секторе S13 и аналогичных
    this.expDist = 0; 
  }

  createParticle() {
    firstApproach ? circle(this.x, this.y, this.r) : circle(this.x, this.y, this.r + 2);
  }

  restartPos() {
    this.expDist += abs(this.x - this.xFirst); //кеширование пройденного частицой расстояния при рестарте позиции (при пересечения линии канала)

    this.x = this.xFirst;
    this.y = this.yFirst;
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
    if(distY1 < distY2 & (distX1/distY1) > 1 & (distX2/distY1) > 1) this.y -= this.getV21();
    else if (distY2 < distY1 & (distX1/distY2) > 1 & (distX2/distY2) > 1) this.y += this.getV21();
    else if(distX1 < distX2) this.x -= this.getU22();
    else this.x += this.getU22();

    
  }

  checkCrossCornerChannel(hx,hy) {

    let dis = dist(this.x, this.y, hx, hy);
    dis <= (r2) ? this.restartPos() : NaN;

  }


  // checkCrossCornerChannel3 () {

  //   let diag = sqrt(sq(r2) + sq(r2));
  //   let delta = diag - r2;
  //   let disToVertexR2 = sqrt(sq(a2-r2) + sq(b2-r2));

  //   let dis = dist(this.x, this.y, SideX/2, SideY/2);
  //   dis <=  disToVertexR2 + (sqrt(sq(r2) + sq(r2)) - delta) ? this.restartPos() : NaN;
  // }

  getV11() {
    // currentHeight = Number(document.getElementById('height').value) - t/100;
    // deltaH = document.getElementById('height').value - currentHeight;
    let posY = abs(this.y - SideY/2);
    let v11 = -(1/currentHeight )*(posY - b)*(deltaH/ptime );

    return abs(v11/fr); //делим на количество кадров в секунду, т.к прорисовка происходит fr раз в секунду
  }

  getV21() {
    // currentHeight = Number(document.getElementById('height').value) - t/100;
    // deltaH = document.getElementById('height').value - currentHeight;
    let posY = abs(this.y - SideY/2);
    let v11 = -(1/currentHeight )*(posY)*(deltaH/ptime );

    return abs(v11/fr); //делим на количество кадров в секунду, т.к прорисовка происходит fr раз в секунду
  }

  getU12() {
  let posX = abs(this.x - SideX/2);
  let u12 = -(1/currentHeight )*(posX - a)*(deltaH/ptime ); 

  return abs(u12/fr); //делим на количество кадров в секунду, т.к прорисовка происходит fr раз в секунду
  }

  getU22() {
  let posY = abs(this.y - SideY/2);
  let posX = abs(this.x - SideX/2);
  let a1 = a2 - wchan - r1;
  let b1 = b2 - wchan - r1;
  let u12 = -(1/currentHeight )*(posX - posY - (a1-b1) )*(deltaH/ptime ); 

  return abs(u12/fr); //делим на количество кадров в секунду, т.к прорисовка происходит fr раз в секунду
  }

  getVp() {

  let p; // полярная координата, x/cos или y/sin
  let angle_fi;
  let pi_fi;
  let Vp;
  let sin_fi;
  let cos_fi;
  let posX = abs(this.x - SideX/2) - (a2-r2);
  let posY = abs(this.y - SideY/2) - (b2-r2);
  let horizontalSide = a-(a2-r2); // длина стороны X сектора
  let verticalSide = b-(b2-r2); // длина стороны Y сектора

  //Зона S131
  //
  if ( ( posX / posY ) <= (horizontalSide - r3)/verticalSide) {  
    p = sqrt(sq(horizontalSide-r3) + sq(verticalSide) ) - r2;
    sin_fi = (horizontalSide-r3) / p;
    Vp = -(1/(2*currentHeight) )*(deltaH/ptime )*(p+sq(b)/(p*sq(sin_fi)) ); 
  }

  //Зона S132
  else if (posY / posX <= (verticalSide-r3)/horizontalSide ) {
    p = sqrt(sq(horizontalSide) + sq(verticalSide-r3) ) - r2;
    cos_fi = horizontalSide/ p;
    Vp = -(1/(2*currentHeight) )*(deltaH/ptime )*(p+sq(a)/(p*sq(cos_fi)) );
  }

  //Зона S133
  else {
    //p = sqrt(sq(horizontalSide) + sq(verticalSide-r3) ) - r2;
    angle_fi = PI/2 - atan( (verticalSide-r3) / horizontalSide ) - atan( (horizontalSide-r3) / verticalSide ); // в радианах
    //определяем p
    atan(posX/posY) > (angle_fi/2 + atan( (verticalSide-r3) / horizontalSide ) ) ? p = sqrt(sq(horizontalSide-r3) + sq(verticalSide) ) - r2 : p = sqrt(sq(horizontalSide) + sq(verticalSide-r3) ) - r2;
    
    pi_fi = ((a - r3)*cos(angle_fi) + (b-r3)*sin(angle_fi)) + sqrt( abs( sq((a - r3)*cos(angle_fi) + (b-r3)*sin(angle_fi)) - (sq(a - r3) + sq(b-r3) - sq(r3)) ) ) ;

    Vp = -(1/(2*currentHeight) )*(deltaH/ptime )*(sq(pi_fi)/p - p );
  } 
  
  return abs(Vp/fr/3); //делим на количество кадров в секунду, т.к прорисовка происходит fr раз в секунду
  } 

  getVp24() {

  let p; // полярная координата, x/cos или y/sin
  let Vp;

  p = sqrt(sq(r1) + sq(r1) );
  Vp = -(p/(2*currentHeight) )*(deltaH/ptime ); 
  
  return abs(Vp/fr); //делим на количество кадров в секунду, т.к прорисовка происходит fr раз в секунду
  } 

  moveParticle() {

    this.cornerZone = false;

    let maxR = Math.max(wchan + r1, r2);

    //разбиение движения по секторам с внешней стороны от канала

     // сектор S11
    if(this.x < SideX/2 + a2 - maxR & this.x > SideX/2 - a2 + maxR & this.y < SideY/2 - b2 ) 
    { 
      // this.y += constSpeed;
      this.y += this.getV11(SideY/2 - b);     
    }

    // сектор симметричный S13 по Ox
    else if(this.x <= SideX/2 - a2 + maxR & this.y <= SideY/2 - b2 + maxR & !(this.x > SideX/2 - a2 + wchan & this.y > SideY/2 - b2 + wchan) ) {

     //симметричный по Ox S13
      if(this.x <= SideX/2 - a2 + r2 & this.y <= SideY/2 - b2 + r2) {
      this.cornerZone = true;
      this.checkCrossCornerChannel(SideX/2 - a2 + r2, SideY/2 - b2 + r2 );
      // this.x += PullToVertex(this.x,this.y,SideX/2 - a2 + r2, SideY/2 - b2 + r2).dirX;
      // this.y += PullToVertex(this.x,this.y,SideX/2 - a2 + r2, SideY/2 - b2 + r2).dirY;

      let speed = this.getVp();
      this.x += PullToVertex2(this.x,this.y,SideX/2 - a2 + r2, SideY/2 - b2 + r2, speed).dirX;
      this.y += PullToVertex2(this.x,this.y,SideX/2 - a2 + r2, SideY/2 - b2 + r2, speed).dirY;
     }

     else if (this.y > SideY/2 - b2 + r2) {
      this.x += this.getU12();
     }

    else if (this.x > SideX/2 - a2 + r2 ) {
      this.y += this.getV11();
     }

    }

    // сектор симметричный S11 по Oy
    else if (this.x < SideX/2 + a2 - maxR & this.x > SideX/2 - a2 + maxR & this.y > SideY/2 + b2) {
        this.y -= this.getV11();
    }

    // сектор симметричный S13 по диагонали и аналогичный S24
    else if (this.x <= SideX/2 - a2 + maxR & this.y >= SideY/2 + b2 - maxR & !(this.x > SideX/2 - a2 + wchan & this.y < SideY/2 + b2 - wchan)) {
      

      //симметричный по диагонали S13
      if(this.x <= SideX/2 - a2 + r2 & this.y >= SideY/2 + b2 - r2) {
      this.cornerZone = true;
      this.checkCrossCornerChannel(SideX/2 - a2 + r2, SideY/2 + b2 - r2 );    
      // this.x += PullToVertex(this.x,this.y,SideX/2 - a2 + r2, SideY/2 + b2 - r2 ).dirX;
      // this.y += PullToVertex(this.x,this.y,SideX/2 - a2 + r2, SideY/2 + b2 - r2 ).dirY;

      let speed = this.getVp();
      this.x += PullToVertex2(this.x,this.y,SideX/2 - a2 + r2, SideY/2 + b2 - r2, speed ).dirX;
      this.y += PullToVertex2(this.x,this.y,SideX/2 - a2 + r2, SideY/2 + b2 - r2, speed ).dirY;
     }

     else if (this.y < SideY/2 + b2 - r2) {
      this.x += this.getU12();
     }

    else if (this.x > SideX/2 - a2 + r2 ) {
      this.y -= this.getV11();
     } 
      
    }

    else if (this.x < SideX & this.y < SideY/2 + b2 - maxR) {
      //сектор S12
      if( this.x > SideX/2 + a2 & this.y > SideY/2 - b2 + maxR) {
        this.x -= this.getU12();
      }
      //сектор симметричный S12 по Ox
      else if(this.x < SideX/2 - a2) {
        this.x += this.getU12();
      }

      //сектор S13
      else if(this.x >= SideX/2 + a2 - maxR & this.y <= SideY/2 - b2 + maxR & !(this.x < SideX/2 + a2 - wchan & this.y > SideY/2 - b2 + wchan)  ) {
        
         // S13
         if(this.x >= SideX/2 + a2 - r2 & this.y <= SideY/2 - b2 + r2) {
          this.cornerZone = true;
          this.checkCrossCornerChannel(SideX/2 + a2 - r2, SideY/2 - b2 + r2 );
          // this.x += PullToVertex(this.x,this.y,(SideX/2 + a2-r2),(SideY/2 - b2 + r2)).dirX;
          // this.y += PullToVertex(this.x,this.y,(SideX/2 + a2-r2),(SideY/2 - b2 + r2)).dirY;

          let speed = this.getVp();
          this.x += PullToVertex2(this.x,this.y,(SideX/2 + a2-r2),(SideY/2 - b2 + r2), speed).dirX;
          this.y += PullToVertex2(this.x,this.y,(SideX/2 + a2-r2),(SideY/2 - b2 + r2), speed).dirY;

          // this.x -= this.getVp(SideX/2 + a2 - r2 , SideY/2 - b2 + r2);
          // this.y -= this.getVp(SideX/2 + a2 - r2 , SideY/2 - b2 + r2);
         }

         else if (this.y > SideY/2 - b2 + r2) {
          this.x -= this.getU12();
         }

        else if (this.x < SideX/2 + a2 - r2 ) {
          this.y += this.getV11();
         }
        
      }

    }

    //сектор симметричный S13 по Oy
    else if (this.x >= SideX/2 + a2 - maxR & this.y >= SideY/2 + b2 - maxR & !(this.x < SideX/2 + a2 - wchan & this.y < SideY/2 + b2 - wchan) ) {

     //симметричный по Oy S13
      if(this.x >= SideX/2 + a2 - r2 & this.y >= SideY/2 + b2 - r2) {
      this.cornerZone = true;
      this.checkCrossCornerChannel(SideX/2 + a2 - r2, SideY/2 + b2 - r2 );
      // this.x += PullToVertex(this.x,this.y,SideX/2 + a2 - r2, SideY/2 + b2 - r2).dirX;
      // this.y += PullToVertex(this.x,this.y,SideX/2 + a2 - r2, SideY/2 + b2 - r2).dirY;

      let speed = this.getVp();
      this.x += PullToVertex2(this.x,this.y,SideX/2 + a2 - r2, SideY/2 + b2 - r2, speed).dirX;
      this.y += PullToVertex2(this.x,this.y,SideX/2 + a2 - r2, SideY/2 + b2 - r2, speed).dirY;
     }

     else if (this.y < SideY/2 + b2 - r2) {
      this.x -= this.getU12();
     }

    else if (this.x < SideX/2 + a2 - r2 ) {
      this.y -= this.getV11();
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

      let speed = this.getVp24();

      //сектор S24
     if(this.x > SideX/2 + a2 - wchan - r1 & this.y < SideY/2 - b2 + wchan + r1) {
      (dist(this.x, this.y, SideX/2 + a2 - wchan - r1, SideY/2 - b2 + wchan + r1) > r1) ?  this.restartPos() : NaN;
      // this.x -= PullToVertex(this.x,this.y,(SideX/2 + a2-wchan-r1),(SideY/2 - b2 + wchan + r1)).dirX;
      // this.y -= PullToVertex(this.x,this.y,(SideX/2 + a2-wchan-r1),(SideY/2 - b2 + wchan + r1)).dirY;    
      this.x -= PullToVertex2(this.x,this.y,(SideX/2 + a2-wchan-r1),(SideY/2 - b2 + wchan + r1), speed).dirX;
      this.y -= PullToVertex2(this.x,this.y,(SideX/2 + a2-wchan-r1),(SideY/2 - b2 + wchan + r1), speed).dirY;
     }

      //сектор симмитричный S24 по Oy 
     if(this.x > SideX/2 + a2 - wchan - r1 & this.y > SideY/2 + b2 - wchan - r1) {
      (dist(this.x, this.y, SideX/2 + a2 - wchan - r1, SideY/2 + b2 - wchan - r1) > r1) ?  this.restartPos() : NaN;
      // this.x -= PullToVertex(this.x, this.y, SideX/2 + a2 - wchan - r1, SideY/2 + b2 - wchan - r1).dirX;
      // this.y -= PullToVertex(this.x, this.y, SideX/2 + a2 - wchan - r1, SideY/2 + b2 - wchan - r1).dirY;
      this.x -= PullToVertex2(this.x, this.y, SideX/2 + a2 - wchan - r1, SideY/2 + b2 - wchan - r1, speed).dirX;
      this.y -= PullToVertex2(this.x, this.y, SideX/2 + a2 - wchan - r1, SideY/2 + b2 - wchan - r1, speed).dirY;
     }

      //сектор симметричный S24 по Ox 
     if(this.x < SideX/2 - a2 + wchan + r1 & this.y < SideY/2 - b2 + wchan + r1) {
      (dist(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 - b2 + wchan + r1) > r1) ?  this.restartPos() : NaN;
      // this.x -= PullToVertex(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 - b2 + wchan + r1).dirX;
      // this.y -= PullToVertex(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 - b2 + wchan + r1).dirY;
      this.x -= PullToVertex2(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 - b2 + wchan + r1, speed).dirX;
      this.y -= PullToVertex2(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 - b2 + wchan + r1, speed).dirY;
     }

      //сектор симметричный S24 по диагонали 
     if(this.x < SideX/2 - a2 + wchan + r1 & this.y > SideY/2 + b2 - wchan - r1) {
      (dist(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 + b2 - wchan - r1) > r1) ?  this.restartPos() : NaN;
      // this.x -= PullToVertex(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 + b2 - wchan - r1).dirX;
      // this.y -= PullToVertex(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 + b2 - wchan - r1).dirY;
      this.x -= PullToVertex2(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 + b2 - wchan - r1, speed).dirX;
      this.y -= PullToVertex2(this.x, this.y, SideX/2 - a2 + wchan + r1, SideY/2 + b2 - wchan - r1, speed).dirY;
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

  expResults() {
    let data = {X:0, U:0};
    let X = abs(this.xFirst - SideX);
    let U = abs(this.x - this.xFirst) + this.expDist;// expDist - кеширование пройденного пути, при рестарте позиции (при сосприкосновении с границей каналом)

    data.X = X;
    data.U = U;
    resultExp.push(data);   
  }

}

// основной массив частиц
let particles = [];
//массив для режима эксперимента
let expParticles = [];
//массив для записи результатов эксперимента
let resultExp = [];

function setup() {

  createCanvas(1000, 730);
  frameRate(fr);

  for(let i = 0; i<amountParticles; i++) {
    particles.push(new MetalParticle());
  }

  b =  document.getElementById('b').value*zoom;
  b2 =  document.getElementById('b2').value*zoom;
  a =  document.getElementById('a').value*zoom;
  a2 =  document.getElementById('a2').value*zoom;
  wchan =  document.getElementById('wchan').value*zoom;
  SideX =  a*2;;
  SideY =  b*2;
  r1 =  document.getElementById('r1').value*zoom;
  r2 =  document.getElementById('r2').value*zoom;
  r3 =  document.getElementById('r3').value*zoom;
  currentHeight = Number(document.getElementById('height').value); // закон h1(t);
  minHeight = document.getElementById('minHeight').value; // толщина до которой сжимаем
  h0 = document.getElementById('height').value;
  deltaH = h0 - currentHeight;
  tetaS = document.getElementById('tetaS').value;

  setGrid(particles);

  noLoop();
}


function draw() {

  resultExp = []; //очищение массива с результатами вначале каждого цикла рисования
  flowProcess();

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

    if(experimentMode) {
      clearResultExp();
      push();
      fill('#E1D76D');
      stroke("red");
      strokeWeight(1);
      for (let i = 0; i<expParticles.length; i++) {
        expParticles[i].createParticle();
        expParticles[i].moveParticle();
        expParticles[i].expResults();
        expResultOutput((resultExp[i].X/zoom).toFixed(0), (resultExp[i].U/zoom).toFixed(2));
      }
      pop();
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

    if(experimentMode) {
      clearResultExp();
      push();
      fill('#E1D76D');
      stroke("red");
      strokeWeight(1);
      for (let i = 0; i<expParticles.length; i++) {
        expParticles[i].createParticle();
        expParticles[i].moveParticle();
        expParticles[i].expResults();
        expResultOutput((resultExp[i].X/zoom/scaleApproach).toFixed(0), (resultExp[i].U/zoom/scaleApproach).toFixed(2));
      }
      console.log(resultExp);
      pop();
    }


    pop();

    defLines();

   }


  noStroke();
  fill(255);
  textSize(15);
  text(`Время процесса ( t ) = ${ (ptime ).toFixed(1) } сек`, 10, 30);
  text(`Толщина изделия ( h ) = ${ (currentHeight).toFixed(1) } мм`, 10, 55);

}

function flowProcess() {

  if (currentHeight <= minHeight) {
    noLoop();
    tumblerDraw = false;
    return;
  }

  // закон h1(t); 
  currentHeight = h0 - ptime /5;
  // let l0 = document.getElementById('a').value;
  // let currentHeight2  = Math.cbrt(6*tetaS*l0*h0*ptime /(P - sigmaS) + Math.pow(h0,3) );
  //h0 - h1(t)
  deltaH = document.getElementById('height').value - currentHeight;

  t += 1;
  ptime  = t/fr;
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
  resetSketch();

  //проверяем на корректно введеные значения
  if(!checkInp()) {event.preventDefault()};

  if(firstApproach) {
    b =  document.getElementById('b').value*zoom;
    b2 =  document.getElementById('b2').value*zoom;
    a =  document.getElementById('a').value*zoom;
    a2 =  document.getElementById('a2').value*zoom;
    SideX =  a*2;
    SideY =  b*2;
    wchan =  document.getElementById('wchan').value*zoom;
    r1 =  document.getElementById('r1').value*zoom;
    r2 =  document.getElementById('r2').value*zoom;
    r3 =  document.getElementById('r3').value*zoom;
  }

  else {
    b =  scaleApproach*document.getElementById('b').value*zoom;
    b2 =  scaleApproach*document.getElementById('b2').value*zoom;
    a =  scaleApproach*document.getElementById('a').value*zoom;
    a2 =  scaleApproach*document.getElementById('a2').value*zoom;
    SideX =  a*2;
    SideY =  b*2;
    wchan =  scaleApproach*document.getElementById('wchan').value*zoom;
    r1 =  scaleApproach*document.getElementById('r1').value*zoom;
    r2 =  scaleApproach*document.getElementById('r2').value*zoom;
    r3 =  scaleApproach*document.getElementById('r3').value*zoom;
  }
 
  h0 = document.getElementById('height').value;
  minHeight = document.getElementById('minHeight').value; // толщина до которой сжимаем


  setGrid(particles);

  document.getElementById('simulation').style.display = "flex";
  document.getElementById('chart-section').style.display = "block";

  redraw();

  //скролинг к блоку
  const el = document.getElementById('simulation_block');
  el.scrollIntoView({behavior: "smooth"});
}


function checkInp() {

  let check_height = document.getElementById('height').value;
  let check_minHeight = document.getElementById('minHeight').value;
  let check_tetaS = document.getElementById('tetaS').value;
  let check_a = document.getElementById('a').value;
  let check_a2 = document.getElementById('a2').value;
  let check_b = document.getElementById('b').value;
  let check_b2 = document.getElementById('b2').value;
  let check_r1 = document.getElementById('r1').value;
  let check_r2 = document.getElementById('r2').value;
  let check_r3 = document.getElementById('r3').value;

  function mask(x) {
    if (x.match("^[0-9]*[.,]?[0-9]+$")) return true;
  }

  //Проверка, на пустые инпуты
  if ((check_height.length == 0) || (check_tetaS.length == 0) || (check_a2.length == 0) || (check_a.length == 0) || (check_b2.length == 0) || (check_b.length == 0) || (check_r1.length == 0) || (check_r2.length == 0) || (check_r3.length == 0) || (check_minHeight.length == 0) ) {
    alert('Заполните все поля!');
    return false;
  }
  //Проверка, на исключение букв в инпутах
  else if ((!mask(check_height)) || (!mask(check_tetaS)) || (!mask(check_a2)) || (!mask(check_a)) || (!mask(check_b2)) || (!mask(check_b)) || (!mask(check_minHeight) || (!mask(check_r1)) || (!mask(check_r2)) || (!mask(check_r3))   )  ) {
    alert('Значения должы быть числовыми!');
    return false;
  }
  // Проверка на то, что вводимые значения будут больше 0
  else if ((Number(check_height) <= 0) || (Number(check_tetaS) <= 0) || (Number(check_a2) <= 0) || (Number(check_a) <= 0) || (Number(check_b2) <= 0) || (Number(check_b) <= 0) || (Number(check_minHeight) <= 0) ){
    alert('Вводимые значения должны быть > 0');
    return false;
  }

  //Проверка, на пустые инпуты
  else if (Number(document.getElementById('a2').value) >= Number(document.getElementById('a').value)) {
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

  else if (Number(document.getElementById('minHeight').value) >= Number(document.getElementById('height').value)) {
    alert('Значение конечной толщины изделия (h)  не должно быть = или > начальной толщины (h0)');
    return false;
  }  

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
  currentHeight = Number(document.getElementById('height').value);
  t = 0;
  ptime  = 0;
  deleteAddedParicles();
  stopDraw();

  for(let i = 0; i<particles.length; i++) {
    particles[i].x = particles[i].xFirst;
    particles[i].y = particles[i].yFirst;
  }

  for(let i = 0; i<expParticles.length; i++) {
    expParticles[i].x = expParticles[i].xFirst;
    expParticles[i].y = expParticles[i].yFirst;
    expParticles[i].expDist = 0;
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
  let localt = dis/constSpeed;
  changespeed.dirX = abs(x-hx)/localt;
  changespeed.dirY = abs(y-hy)/localt;

  if(x-hx > 0) changespeed.dirX = -1*changespeed.dirX;
  if(y-hy > 0) changespeed.dirY = -1*changespeed.dirY;

  return changespeed;
}


function PullToVertex2(x,y,hx,hy,speed) {
  let changespeed = {dirX: 0, dirY: 0};
  let dis = dist(x,y,hx,hy);
  let localt = dis/speed;
  changespeed.dirX = abs(x-hx)/localt;
  changespeed.dirY = abs(y-hy)/localt;

  if(x-hx > 0) changespeed.dirX = -1*changespeed.dirX;
  if(y-hy > 0) changespeed.dirY = -1*changespeed.dirY;

  return changespeed;
}



function changeApproach() {

  resetSketch();
  deleteAddedParicles();

  firstApproach = !firstApproach;

  if(!firstApproach) {
    
    b *= scaleApproach;
    b2 *= scaleApproach;
    a *= scaleApproach;
    a2 *= scaleApproach;
    wchan *= scaleApproach;
    SideX *= scaleApproach;
    SideY *= scaleApproach;
    constSpeed *= scaleApproach;
    r1 *= scaleApproach;
    r2 *= scaleApproach;
    r3 *= scaleApproach;

    setGrid(particles);
    firstApproach = false;

    document.getElementById('changeApproach').innerText = "Первое приблжение";

    if(experimentMode) {
      for (let i = 0; i < quantity; i++) {
        expParticles[i].x = SideX - 20*scaleApproach*(i+1);
        expParticles[i].y =  SideY/2 - 10*scaleApproach;
        expParticles[i].xFirst =  expParticles[i].x;
        expParticles[i].yFirst =  expParticles[i].y;
      }
    }

  }

  else {
    
    b /= scaleApproach;
    b2 /= scaleApproach;
    a /= scaleApproach;
    a2 /= scaleApproach;
    wchan /= scaleApproach;
    SideX /= scaleApproach;
    SideY /= scaleApproach;
    constSpeed /= scaleApproach;
    r1 /= scaleApproach;
    r2 /= scaleApproach;
    r3 /= scaleApproach;

    setGrid(particles);
    firstApproach = true;

    document.getElementById('changeApproach').innerText = "Второе приблжение";

    if(experimentMode) {
      for (let i = 0; i < quantity; i++) {
        expParticles[i].x = SideX - 20*(i+1);
        expParticles[i].y = SideY/2 - 10;
        expParticles[i].xFirst =  expParticles[i].x;
        expParticles[i].yFirst =  expParticles[i].y;
      }
    }

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
    //т.к в функции draw происходит translate (смещение кисти) перед рисованием точек, нужно так же сместиться (в текущем случае в верхний левый угол заготовки)
    particles[amountParticles - 1].x = mouseX - (width/2 - SideX/2);
    particles[amountParticles - 1].y = mouseY - (height/2 - SideY/2);
    particles[amountParticles - 1].xFirst = mouseX - (width/2 - SideX/2);
    particles[amountParticles - 1].yFirst = mouseY - (height/2 - SideY/2);
  }

  else {
    particles[amountParticles - 1].x = mouseX  + SideX/2;
    particles[amountParticles - 1].y = mouseY - (height - SideY/2);
    particles[amountParticles - 1].xFirst = mouseX + SideX/2;
    particles[amountParticles - 1].yFirst = mouseY - (height - SideY/2);
  }
  
}

function deleteAddedParicles() {
  //удаляем все добавленные частицы до первоначального количества
  amountParticles = firstAmountParticles;
  particles = particles.slice(0, amountParticles);
}

function experiment() {
  expParticles = [];
  experimentMode = !experimentMode;
 
  resetSketch();  
  quantity = ((document.getElementById('a').value-document.getElementById('a2').value)/2)/2;


  for (let i = 0; i < quantity; i++) {
    expParticles.push(new MetalParticle());
    expParticles[i].x = width/2 + SideX/2 - 20*(i+1);
    expParticles[i].y = height/2 - 10;
    push();
    fill('#E1D76D');
    stroke("red");
    strokeWeight(1);
    expParticles[i].createParticle();
    pop();

    if (firstApproach) {
      //т.к в функции draw происходит translate (смещение кисти) перед рисованием точек, нужно так же сместиться (в текущем случае в верхний левый угол заготовки)
      expParticles[i].x = SideX - 20*(i+1);
      expParticles[i].y = SideY/2 - 10;
      expParticles[i].xFirst =  expParticles[i].x;
      expParticles[i].yFirst =  expParticles[i].y;
    }

    else {
      expParticles[i].x = SideX - 20*scaleApproach*(i+1);
      expParticles[i].y =  SideY/2 - 10*scaleApproach;
      expParticles[i].xFirst =  expParticles[i].x;
      expParticles[i].yFirst =  expParticles[i].y;
    }

    
  }

   if (experimentMode) {
    document.getElementById('exp').innerText = "Режим эксперимента (вкл)";
    document.getElementById('resExp').style.display = "block";
   } 
   else {
    document.getElementById('exp').innerText = "Режим эксперимента";
    document.getElementById('resExp').style.display = "none";
   }

}

function expResultOutput(X, U) {
  const table = document.getElementById('trResults');

    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');

    tr.appendChild(td1).textContent = X;
    tr.appendChild(td2).textContent = U;
       
    table.appendChild(tr);

    document.getElementById('tExp').innerText = `Время процесса (t) = ${ptime .toFixed(1)} сек`;
    document.getElementById('heightExp').innerText = `Текущая толщина заготовки (h) = ${currentHeight.toFixed(1)} мм`;
}

function clearResultExp() {
  const table = document.getElementById('trResults');
  table.innerHTML = '<tr><th>X  - начальное положение слоя, мм</th><th>U - смещение слоя, мм </th></tr>';
}


// вычисление суммарной силы контактного давления
// function calcPressure() {

//   //создаем новые переменные с припиской calc, т.к в ходе процесса у нас происходит zoom увеличение реальных размеров
//   let calc_a2 = document.getElementById('a2').value;
//   let calc_a = document.getElementById('a').value;
//   let calc_b2 = document.getElementById('b2').value;
//   let calc_b = document.getElementById('b').value;
//   let calc_r1 = document.getElementById('r1').value;
//   let calc_r2 = document.getElementById('r2').value;
//   let calc_r3 = document.getElementById('r3').value;

//   let calc_wchan = document.getElementById('wchan').value;
//   let calc_b1 = calc_b2 - calc_wchan;
//   let calc_a1 = calc_a2 - calc_wchan;

//   let Ps11;
//   let Ps12;

//   let Ps131;
//   let Ps132;
//   let Ps133;
//   let sumPs13;

//   let Ps21;
//   let Ps22;
//   let Ps23;
//   let Ps24;
//   let sumPs2;

//   let sumP;

// // Вычисление силы в области S11

//   Ps11 = (calc_a1 - calc_r1)* (2*tetaS*(calc_b - calc_b2) - tetaS/currentHeight  * sq(calc_b - calc_b2) );

//   console.log(Ps11);
// // Вычисление силы в области S12
//   Ps12 = (calc_b1 - calc_r1) * (2*tetaS*(calc_a - (calc_a1 + calc_r2)) + tetaS/currentHeight * sq(calc_a - (calc_a1 + calc_r2)) ) ;
//   console.log(Ps12);

// // Вычисление сил в угловой внешней части

//   Ps131 = (1+calc_r2/currentHeight)*sq(calc_b)* (calc_b1 - calc_r1)/( (calc_a - calc_a1) - (calc_r3 - calc_r1) )  -  2*tetaS/(3*currentHeight) * sq(calc_b)  * ( (calc_b1 - calc_r1)*sqrt( sq(calc_b1 - calc_r1) + sq( (calc_a - calc_a1) - (calc_r3 - calc_r1) ) ) / sq( (calc_a - calc_a1) - (calc_r3 - calc_r1) )   + 3/2 * Math.log( abs( tan(1/2)*atan( ((calc_a - calc_a1) - (calc_r3 - calc_r1))/(calc_b1 - calc_r1) ) ) ) - tetaS*sq(calc_r2)*( PI/2 - atan( ((calc_a - calc_a1) - (calc_r3 - calc_r1))/(calc_b1 - calc_r1) ) ) + 2*tetaS/currentHeight  * Math.pow(calc_r2,3)/3  * (PI/2 - atan( ((calc_a - calc_a1) - (calc_r3 - calc_r1))/(calc_b1 - calc_r1) ) )  );
//   console.log(Ps131);
//   Ps132 = (tetaS*calc_r2*sq(calc_a)/currentHeight) * (calc_b - calc_r3)/(calc_a - (calc_a1 - calc_r1))  - tetaS*sq(calc_r2)*atan( (calc_b - calc_r3)/(calc_a -(calc_a1 - calc_r1) ) )  +  (2*tetaS/currentHeight)*(Math.pow(calc_r2,3)/3)*atan( (calc_b - calc_r3)/(calc_a -(calc_a1 - calc_r1) ) );
//   console.log(Ps132);
//   Ps133 = ( atan (((calc_a - calc_a1) - (calc_r3 - calc_r1))/ (calc_b1-calc_r1) ) - atan( (calc_b - calc_r3)/(calc_a - (calc_a1 - calc_r1) ) ) ) * ( (tetaS + tetaS*calc_r2/currentHeight )* (2*sq(calc_a - calc_r3) + 2*sq(calc_b - calc_r3) - 2*sq(calc_r3) - 2*sq(calc_r2) ) - (2*tetaS/(3*currentHeight))*(2*sqrt(2)*( Math.pow(calc_a - calc_r3,3) + Math.pow(calc_b - calc_r3,3) - 2*Math.pow(calc_r3, 3) - Math.pow(calc_r2,3) ) )  );
//   console.log(Ps133);
//   sumPs13 = Ps131+Ps132+Ps133;
// //Вычисление сил в центральной части
//   Ps21 = (calc_a1 - calc_b1)*(2*tetaS*calc_b1 + sq(calc_b1)*2*tetaS/(2*currentHeight) );
//   console.log(Ps21);
//   Ps22 = tetaS*(sq(calc_r1) - sq(calc_b1)) - (tetaS/(3*currentHeight))*(Math.pow(calc_r1,3) - Math.pow(calc_b1,3));
//   console.log(Ps22);
//   Ps23 = tetaS*(sq(calc_r1) - sq(calc_b1) ) - (tetaS/(3*currentHeight))*( Math.pow(calc_r1,3) - Math.pow(calc_b1,3) );
//   console.log(Ps23);
//   Ps24 = (2*tetaS*sq(calc_r1)+ (1/3) *2*tetaS*Math.pow(calc_r1,3)/currentHeight)*(PI/2);
//   console.log(Ps24);
//   sumPs2 = Ps21 + Ps22 + Ps23 + Ps24;
  
// // Суммарная сисла штамповки рассмотренной зоны
//   sumP = Math.trunc(4*(Ps11+Ps12+sumPs13+sumPs2)/1000); //выражаем в килоНьютанах
//   return sumP;

// }