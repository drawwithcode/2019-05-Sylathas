//Define variables for the tilemap
var tilemap, tileset, tileSize = 50, tileOrig = 15;

//Define Variables for the player
var player = {}, newPlayer, player, sprite2, collisionGroup, playerImg, moveleft = false, moveright = false, hit = false;

//Define Variables for the world
var offset = 0, scrollSpeed = 10, GRAVITY = 0.3, setWidth = 6, mapWidth;

//Initialize recognition of the voice
var myRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
myRec.continuous = true; // do continuous recognition
myRec.interimResults = true;
var mostrecentword;

//Preload tileset, tilemap and player image
function preload(){
    tileset = loadImage('./assets/tileset.png');
    tilemap = loadJSON('./assets/tilemap.json');
    playerImg = loadImage('./assets/player.png')
}

function setup() {
    pixelDensity(1);
    createCanvas(windowWidth,windowHeight)
    mapWidth = tilemap.layers[0].width;
    mapHeight = tilemap.height;
    tileSize = height/tilemap.height;
    noSmooth(0);
    player=createSprite(300,500,tileSize/2,tileSize/2);
    player.addImage(playerImg)
    player.scale=tileSize/tileOrig;
    collisionGroup = new Group();
    drawCollisionMap();
    
    myRec.start(); // start recording
}

function draw() {
    offset=player.position.x-width/3;
    if (offset<0) {
        offset=0;
    } else if(offset>mapWidth*tileSize-width) {
        offset= mapWidth*tileSize-width;
    }
    push();
    translate(-offset,0);

    var gravity = createVector(0, 0.1);
    
    drawTileMap();
    
    //Initiate Collision
    if (player.collide(collisionGroup)) {
        player.velocity.y=0;
    }
    
    //Move when boolean are true
    if (moveright === true) {
        player.velocity.x=(5)
    } else if (moveleft === true) {
        player.velocity.x=(-5)
    } else {
        player.velocity.x = 0;
    }
    
    //Jump with up arrow
    if (keyWentDown(UP_ARROW)) {
        player.velocity.y=(-10)
    }
    
    //Use gravity to push down player
    player.velocity.y+=GRAVITY;
    player.collide(collisionGroup);

    drawSprite(player);
    pop();
    
    //Draw last word
    fill(255);
    textSize(50);
    text(mostrecentword, width/2, height/2);
    
    //Draw tutorial
    fill(255,150);
    noStroke();
    rect(20,20,300,180);
    fill(0);
    textSize(15);
    text('Move using your voice', 40, 60);
    var textY = 90;
    text('Say right to move right.', 40, textY);
    textY+=20; text('Say left to move left.', 40, textY);
    textY+=20; text('Say stop to stop moving', 40, textY);
    textY+=20; text('Press UP on the arrow keys to jump', 40, textY);
    textY+=20; text('Try reaching the end of the level', 40, textY);
}

//Get words and if left, right or stop change boolean
function parseResult() {
  mostrecentword = myRec.resultString.split(' ').pop();

  if(mostrecentword.indexOf("left")!==-1) {
    if(moveright === true){
       moveleft = true; 
       moveright = false;
    } else {
       moveleft = true; 
    }
  } else if (mostrecentword.indexOf("right")!==-1) {
    if(moveleft === true){
       moveleft = false; 
       moveright = true;
    } else {
       moveright = true;   
    }
  } else if (mostrecentword.indexOf("stop")!==-1) {
    moveleft = false; 
    moveright = false;
  }
}

//Next three functions: Draw the Tiles, Tilemap and Collision Map

function Tile(POSX,POSY,TILE) {
  this.x = tileSize*POSX;
  this.y = tileSize*POSY;
  this.tilex = (TILE-1)%setWidth*tileOrig;
  this.tiley = Math.floor((TILE-1)/setWidth)*tileOrig;
  //OCCLUSION CULLING
  if(this.x<width+offset&&this.x>-tileSize+offset) {
    image(tileset,this.x,this.y,tileSize,tileSize,this.tilex,this.tiley,tileOrig,tileOrig);
  }
}

function drawTileMap() {
  for(layer=0; layer<tilemap.layers.length; layer++) {
    for(row=0;row<mapWidth; row++) {
      for (col=0;col<=mapHeight;col++) {
        var tile = tilemap.layers[layer].data[col*mapWidth+row]
        newTile = new Tile(row,col,tile);
      }
    }
  }
}

function drawCollisionMap() {
  for(layer=0; layer<tilemap.layers.length; layer++) {
    for(row=0;row<mapWidth; row++) {
      for (col=0;col<=mapHeight;col++) {
        var tile = tilemap.layers[layer].data[col*mapWidth+row]
        var tilePos = createVector(row*tileSize,col*tileSize);
        if(tile!=6&&tile!=1&&tile!=11&&tile!=12) {
          tileCollide = createSprite(tilePos.x+tileSize/2, tilePos.y+tileSize/2, tileSize,tileSize);
          collisionGroup.add(tileCollide);
        }
      }
    }
  }
}

//Responsive Window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}