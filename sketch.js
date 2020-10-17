
var dog, happyDog
var database
var foodS, foodStock

var feed, addFood

var fedTime, lastFed

var foodObj

var changeGameState, readGameState

function preload()
{
  dog1IMG=loadImage("images/dogImg.png")
  happyDog=loadImage("images/dogImg1.png")
  bedroom=loadImage("images/bedRoom.png")
  garden=loadImage("images/garden.png")
  washroom=loadImage("images/washRoom.png")
  sadDog=loadImage("images/sadDog.png")
}

function setup() {
  database = firebase.database();
  createCanvas(1200, 400);
  foodObj = new Food();
  
  dog = createSprite(250,250,20,20);
  dog.addImage(dog1IMG);
  dog.scale = 0.15
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods); 
  
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val()
  });
    
  

}

function draw() {  
  background(46,139,87);

  foodObj.display();


  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Playing")
    foodObj.display();
  }

  if(gameState!=="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  drawSprites();

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour(),
      gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
      Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}