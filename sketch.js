var bgImg, asteroidImg, spaceshipImg;
var player;
var asteroidArray, laserArray;
var blastOffImg;
var timerValue = 3;
var spaceHealthCount = 100;
var gameState="START";
var winningScore=0;
function preload(){
  bgImg=loadImage("Sprites/bg.jpg");
  asteroidImg=loadAnimation("Sprites/astroid.png");
  spaceshipImg=loadAnimation("Sprites/Spaceship.png");
  laserImg=loadImage("Sprites/laser.png");
  blastOffImg=loadAnimation("Sprites/Blastoff.png");
  clapSound = loadSound('Claps.mp3');
 lazerSound = loadSound('lazerShot.mp3');
  sadSound = loadSound('sadLose.mp3');
}
function setup() {
  createCanvas(displayWidth,displayHeight-150);
  player=createSprite(displayWidth/2,displayHeight/2+200);
  player.addAnimation("SpaceShip",spaceshipImg);
  player.scale=0.3;
  edges = createEdgeSprites();
  asteroidArray= new Group();
  laserArray= new Group();
}
function timeIt() {
  if (timerValue > 0) {
    timerValue--;
  }
}

function draw() {
  background(bgImg);  
  drawSprites();
  if (gameState==="START"){
    moveShip();
    spawnObstacles();
    shootLasers();
    asteroidDestroy();
    spaceHealthCheck();
    if (player.isTouching(edges[0]) || player.isTouching(edges[1])) 
  { 
    player.bounceOff(edges[0]); 
    player.bounceOff(edges[1]); }
    if(winningScore===100){
      lazerSound.stop();
      clapSound.play();
      gameState="WIN";
    }
    if (spaceHealthCount===1){
      lazerSound.play();
      gameState="END";
    }
  }else if(gameState==="END"){
    //sadSound.play();
  console.log("Game has ended");
  background("YELLOW");
    textSize(40);
    fill("RED");
    text("You lost the game!",displayWidth/2,displayHeight/2);
  }
  //console.log(spaceHealthCount);
  barStatus("spaceship health",50,spaceHealthCount,"red");
  barStatus("Progress Bar",100,winningScore,"BLUE");
  console.log(winningScore);
  console.log("HC:"+spaceHealthCount);
  if (winningScore>=100&&spaceHealthCheck!=1&&gameState==='WIN'){
    clapSound.stop(2);
    background("YELLOW");
    textSize(40);
    fill("RED");
    text("Yay,You have won the game!",displayWidth/2,displayHeight/2);

  }
}
function moveShip(){
  if (keyWentDown("LEFT_ARROW")) {
  player.velocityX=-10;
  }
  if (keyWentUp("LEFT_ARROW")){
    player.velocityX=0;
  }
  if (keyWentDown("RIGHT_ARROW")) {
    player.velocityX=10;
    }
    if (keyWentUp("RIGHT_ARROW")){
      player.velocityX=0;
    }
}

function spawnObstacles(){
  //console.log("spawnObstacles");
  if (frameCount % 1 ===0) {
    var asteroid = createSprite(displayWidth/2,-10, 10, 20);
    asteroid.x = Math.round(random(50,displayWidth-100));
    asteroid.addAnimation("asteroidImg",asteroidImg);
    asteroid.addAnimation("Blastoff", blastOffImg);
    asteroid.scale=0.3;
    asteroid.velocityY = 3;
    asteroid.lifetime = displayHeight/3;
    asteroidArray.add(asteroid);
  }
}

function shootLasers(){
  if(keyWentDown("SPACE")){
    lazerSound.play();
    var laser = createSprite(player.x,player.y);
    laser.velocityY = -10;
    laser.addImage(laserImg);
    laser.scale=0.3;
    laser.rotateToDirection=true;
    laser.lifetime = 60;
    laserArray.add(laser);
  }
}

function asteroidDestroy(){
  for(var i = 0; i < asteroidArray.length; i = i+1){
    if(laserArray.isTouching(asteroidArray.get(i))){
      //asteroidArray.get(i).lifetime=0;
      console.log("asteroidDestroy");
      asteroidArray.get(i).changeAnimation("Blastoff",blastOffImg);
      setInterval(timeIt, 100);
      if (timerValue == 0) {
      asteroidArray.get(i).lifetime=0;
      asteroidArray.get(i).remove();
      timerValue = 3;
      winningScore=winningScore+1;

      }
      
    }
   
  }
}

function barStatus(type,y,w,color){
  stroke(color);
  fill(color);
  textSize(15);
  text(type,width-150,y-10);
  fill("WHITE");
  rect(width-150,y,100,20);
  fill(color);
  rect(width-150,y,w,20);
  
}
function spaceHealthCheck(){
  for(var i = 0; i < asteroidArray.length; i = i+1){
    if(asteroidArray.get(i).y>height){
      spaceHealthCount= spaceHealthCount-1;
      asteroidArray.remove(asteroidArray.get(i));
    }
    

  }

}
