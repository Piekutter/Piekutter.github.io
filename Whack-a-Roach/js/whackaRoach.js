// Lawrence Piekut 
// Date: 2014 - Updated 2022 Feb. Including new ES6 (EcmaScript 6 aka EcmaScript 2015) 
// Idea to add a shadow over the hitting area. Idea to be able to purchase a bigger mallet or other weapon with points.
// Declare global vars.
var canvas;
var ctx;
var ctx2;
var timer = 45; //Game time in seconds
var initTimer = timer*1000; //The timer at start time in milliseconds
var width;
var height;
var loopCntr = 0;
// Loopspeed set to 40 milliseconds
const LOOPSPEED = 40;
// Decrement timer every real second. FPS
const DECREMENTTIMER = 1000 / LOOPSPEED;
var intervalID;
// Animal object
var animal={type:"none",xC:1,yC:1};
// Statistics
var points=0;
var clicks=0;
var roachesCreated=0;
var killedRoaches=0;
var molesCreated=0;
var molesWhacked=0;
//  difficulty setting.
var difficulty = {speed:0,chance:0,type:"medium"};
// Global Variables. Used for Random position now moved here to create the small hole before the animal
var x;
var y;
var game = {playing : false, playAgain : false}; //object used to control playing status.

//Used to play the sound when hovering over a difficulty button. Auto-play has now been removed by browsers. Will update this.
function buttonover() {
	var buttonOver = document.getElementById("buttono");
	buttonOver.currentTime = 0;
	buttonOver.play();	
}

//On document ready event.
$(function(){
	//Audio
	var Ow = document.getElementById("ow");
	var squish = document.getElementById("squish");
	var mallet = document.getElementById("mallet");
	//Draw an image before start on the canvas
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
 	var img = new Image();
	img.onload = function() {
	  ctx.drawImage(img,1,1);
		};
	img.src = "images/moleHolesBG.jpg";
	//get my canvas
	canvas2 = document.getElementById("myCanvas2");
	//Change the cursor to a mallet
	//canvas2.style.cursor="url('images/mallet2.gif')25 70,auto";
	//Draw the cute mole
	ctx2 = canvas2.getContext("2d");
	var img2 = new Image();
	img2.onload = function() {
	  ctx2.drawImage(img2,15,15);
		};
	img2.src = "images/cutemole.png";
	ctx2.font = "bold 24px sans-serif";
	ctx2.fillText("Please help me kill the roaches!",175,50);
	//Get the width and height of the canvas
	width = canvas.width;
    height = canvas.height;
	//timer = $("#timer").text();
	$("#timer").text(timer);
	//points = $("#points").text(); //Decided to remove this as it could sometimes read as a text.
	//console.log(timer);
	
 	// Add Mouse Event Listener to canvas
	$("#myCanvas2").mousedown(function (e) {
	    if (game.playing){
			clicks++;
			mallet.currentTime = 0;
			mallet.play();	
			canvas2.style.cursor="url('images/malletD.gif'),auto";
			var canvasPosition = $(this).offset();
			  if(e.offsetX==undefined) //I noticed firefox wasn't working so I found this on http://stackoverflow.com/questions/12704686/html5-with-jquery-e-offsetx-is-undefined-in-firefox
			  {
				var mouseX = e.pageX-$('#myCanvas2').offset().left;
				var mouseY = e.pageY-$('#myCanvas2').offset().top;
			  }             
			  else                     // works in Google Chrome
			  {
				var mouseX = e.offsetX;
				var mouseY = e.offsetY;
			  }
			//Check if the Mouse click is within the Animal object. I first used 100 and 67 because that is the size of the image but decided to go bigger to make it a little easier.
			if (mouseX >= animal.xC && mouseX <= animal.xC + 120 && mouseY >= animal.yC && mouseY <= animal.yC + 75)
			{
				if (animal.type == "roach")
				{
					var img = new Image();
					img.onload = function() {
						ctx.drawImage(img,animal.xC,animal.yC);
					};
					img.src = "images/deadRoach.png";
					squish.currentTime = 0;
					squish.play();
					// After roach gets squashed quickly change the animal to type none so it wont register 2nd hit AND clear object on screen.
					//Issue with clicking and clearing screen after game over. Another check on timer.
					if (timer != 0)
					{
						ctx2.clearRect(0, 0, width, height);
						//Add points for kill
						points = (points + 2);	
						//Count roaches killed
						killedRoaches++;
					}
					animal.type="none";
				}
				else if (animal.type == "mole")
				{
					Ow.currentTime = 0;
					Ow.play();	
					points = (points - 5);
					// After roach gets squashed quickly change the animal to type none so it wont register 2nd hit. Don't clear mole on screen looks better.
					animal.type="none";
					molesWhacked++;
				}
				$("#points").text(points);	
			}
		} //END OF if (game.playing)
		else if (game.playAgain) 
		{
			mallet.currentTime = 0;
			mallet.play();	
			canvas2.style.cursor="url('images/malletD.gif'),auto";
			var canvasPosition = $(this).offset();
			if(e.offsetX==undefined) //I noticed firefox wasn't working so I found this on http://stackoverflow.com/questions/12704686/html5-with-jquery-e-offsetx-is-undefined-in-firefox
			{
				var mouseX = e.pageX-$('#myCanvas2').offset().left;
				var mouseY = e.pageY-$('#myCanvas2').offset().top;
			}             
			else                 // works in Google Chrome
			{
				var mouseX = e.offsetX;
				var mouseY = e.offsetY;
			}
			loopCntr = 0;
			points=0;
			clicks=0;
			roachesCreated=0;
			killedRoaches=0;
			molesCreated=0;
			molesWhacked=0;
			ctx2.clearRect(215, 60, width, height);
			img = new Image();
			img.onload = function() {
			   ctx.drawImage(img,1,1);
			};
			img.src = "images/moleHolesBG.jpg";
			//Reset the Cursor
			canvas2.style.cursor="default";
			//Reset the timer back to the original time.
			timer = initTimer/1000;
			$("#startbtn").fadeIn();
			$("#startbtnE").fadeIn();
			$("#startbtnH").fadeIn();
			$("#instructions").fadeIn();
			$("#timer").text(initTimer/1000);
			$("#points").text("0");	
			game.playAgain = false;
			// REMOVE NAME INPUT BOX
			var input = document.getElementById("name");
			if (input)
			{
				// insert player score
				localStorage.player.name = getElementById("name");
				input.parentNode.removeChild(input);
			}
			
		}

	});
		//On mouseup change cursor back
		$("#myCanvas2").mouseup(function (e) {
		   if (game.playing){
			   canvas2.style.cursor="url('images/mallet2.gif')25 70,auto";
			}
	}); 

});	
//difficulty.speed is the amount of loops to go through before an "Animal" is created. Effectively measured in desired milliseconds / LOOPSPEED = loops
//Eg easy : time = new roach every 1200ms / current LOOPSPEED = loops. If current LOOPSPEED = 40 then 1200 / 40 = 30 loops.
//Easy = 1200ms. Medium = 800ms. HARD = 480ms 
//difficulty.chance is the probability that a MOLE will appear. The Value is a percentage. IE 10 = 10%, 25 = 25%, etc. (recently changed to 2 digit number (from 1) for a more flexible probability)
function easy() {
	difficulty.speed = (1200/LOOPSPEED) ; //Before I hard coded 30 loops. This allows for different LOOPSPEED Settings.
	difficulty.chance = 10;
	difficulty.type = "easy";
	startGame();
}
function medium() {
	difficulty.speed = (800/LOOPSPEED); 
	difficulty.chance = 20;
	difficulty.type = "medium";
	startGame();
}
function hard() {			
	difficulty.speed = (480/LOOPSPEED);
	difficulty.chance = 30;
	difficulty.type = "hard";
	startGame();
}

function startGame() {

	game.playing = true;
	//Change the cursor to a mallet. Bring this here because the mallet doesn't look good and is hard to use over difficulty selection buttons.
	canvas2.style.cursor="url('images/mallet2.gif')25 70,auto";
	
	var btnActive = document.getElementById("btnActive");
	btnActive.currentTime = 0;
	btnActive.play();
    // clear the canvas before re-drawing.
    ctx.clearRect(0, 0, width, height);
	ctx2.clearRect(0, 0, width, height);
	// Remove the start button and the instructions
	$("#startbtn").fadeOut();
	$("#startbtnE").fadeOut();
	$("#startbtnH").fadeOut();
	$("#instructions").fadeOut();
	// new background for the game
	var img = new Image();
	img.onload = function() {
	  ctx.drawImage(img,1,1,800,400);
		};
	img.src = "images/grass.jpg";
	intervalID = setInterval(gameloop,LOOPSPEED);
}

function gameloop() {
	// check timer
	if (timer == 0)
	{
		//Game finish.
		endgame();
	}
	else
	{	
		//Decrement Timer;
		loopCntr++;
		if (loopCntr % DECREMENTTIMER == 0)
		{
			timer--;
			$("#timer").text(timer);
		}
		
		// Draw the random image if the loopCntr has reached the appropriate time. (The time is different depending on the difficulty). 
		if (loopCntr % difficulty.speed == 0)
		{
		// A roach should NOT be created unless there is enough time left to create another roach in the set difficulty (including hole 180ms). 
		// EG There should be at least 800ms + 180ms = 980ms left on medium before creating a new roach. .
		// To solve this we need to know how many milliseconds remain. intiTimer - loopCntr * LOOPSPEED = ms remaining. Removed 180 from check
		   if (timer < 3 && initTimer - loopCntr * LOOPSPEED < difficulty.speed * LOOPSPEED)
		   {}
		   else
		   {   		
			// Choose random position for hole and bug here. Draw the hole 180 milliseconds before the bug appears.
			//Get Random x position
			x = Math.floor((Math.random()*(width-100))+1);
			y = Math.floor((Math.random()*(height-50))+1);
			// draw circle didn't look good so use the image instead.
			var img = new Image();
			img.onload = function() {
				ctx.drawImage(img,x,y+36);
			};
			img.src = "images/hole.png";
			setTimeout("drawRandomAnimal()",180);
		   }
		}
		// 3 Seconds or less notification
		if (timer < 4 && loopCntr % 25 == 0)
		{
			var notify = document.getElementById("beep");
			notify.currentTime = 0;
			notify.play();
		}
	}
}

function drawRandomAnimal(){
	ctx2.clearRect(0, 0, width, height);
	// Roach or Mole?
	var animalRandom = Math.floor((Math.random()*100)+1);
	var img2 = new Image();
	img2.onload = function() {
	  ctx2.drawImage(img2,x,y);
		};
	// difficulty creates > Chance 30% mole on Hard, 20% on Medium, 10% on Easy. 
	if (animalRandom > difficulty.chance)
	{
		animal.type="roach";
		animal.xC=x;
		animal.yC=y;
		img2.src = "images/smallRoach.png";
		roachesCreated++;
	}
	else
	{	
		animal.type="mole";
		animal.xC=x;
		animal.yC=y;
		img2.src = "images/smallMole.png";
		molesCreated++;
	}
}

function endgame(){
 	clearInterval(intervalID);
	game.playing = false;
	// clear the canvas before re-drawing.
	// future > Check the difficulty. If Hard and passed then fight big Australian Roach. Else display results.
    ctx.clearRect(0, 0, width, height);
	ctx2.clearRect(0, 0, width, height);
	var gradient = ctx.createLinearGradient(0,0,0,400);
	gradient.addColorStop(0,"white");
	gradient.addColorStop(0.5,"lightsteelblue");
	gradient.addColorStop(1,"navy");
	ctx.fillStyle = gradient;
	ctx.fillRect(0,0,800,400);

	// draw the mole
	var img2 = new Image();
	img2.onload = function() {
		ctx2.drawImage(img2,15,15);
	};
	img2.src = "images/cutemole.png";
	//STATS
	ctx2.fillText(" - STATISTICS -",260,90);
	ctx2.fillText("POINTS: " + points,260,120);
	ctx2.fillText("Roaches Killed: " + killedRoaches + " out of " + roachesCreated,260,150);
	var killPercentage = Math.round(killedRoaches/roachesCreated*1000)/10;
	ctx2.fillText("Kill Percentage: " + killPercentage+"%",260,180);
	ctx2.fillText("Moles Whacked: " + molesWhacked + " out of " + molesCreated,260,210);
	//ctx2.fillText("Moles Whacked: " + molesWhacked,260,230);
	ctx2.fillText("Clicks: " + clicks,260,240);
	var accuracy = Math.round(killedRoaches/clicks*1000)/10;
	ctx2.fillText("Accuracy: " + accuracy+"%",260,270);
	//var killPercentage = Math.round(killedRoaches/roachesCreated*1000)/10;
	//ctx2.fillText("Kill Percentage: " + killPercentage+"%",260,320);
	ctx2.fillText("Difficulty: " + difficulty.type,260,300);
	ctx2.fillStyle = "white";
	ctx2.fillText("CLICK TO PLAY AGAIN",280,360);
	ctx2.fillStyle = "black";
	ctx2.font = "bold 24px sans-serif";
	//Highest score use local storage. Will add this in the near future
/* 	if (typeof(Storage) !== "undefined")
	{
		// if local storage object "player" does not exist create it.. Use an array of objects?
		if (!localStorage.player.score)
		{	
			var player = {name:" ",score: points};
			localStorage.player = player;
		}
		else
		{
			// CREATE A NAME INPUT BOX
			var input = document.createElement("INPUT");
			input.setAttribute('id',"name");
			document.body.appendChild(input);
			var player = {name:" ",score: points};
			localStorage.player = player;
		}
	} */

	// DISPLAY END OF GAME MESSAGE
	switch(difficulty.type)
	{
		case "easy":
			if (accuracy == 100)
			{
				ctx2.fillText("Great! Try again on medium difficulty",175,50);
			}
			else if (points >= 60)
			{
				ctx2.fillText("AMAZING! YOU DID IT! THANK YOU!",175,50);
			}
			else if (points >= 50)
			{
				ctx2.fillText("GREAT JOB! But I still see some roaches.",175,50);
			}
			else if (points >= 30)
			{
				ctx2.fillText("Really? Is it that hard to kill roaches?",175,50);
			}
			else if (points > 0 )
			{
				ctx2.fillText("OH NO THE COCKROACHES ARE TAKING OVER!",175,50);
			}
			else if (molesWhacked/molesCreated > 0.7)
			{
				ctx2.fillText("OW! YOU MOLE FOE!",175,50);
			}
			else
			{
				ctx2.fillText("I'll get my revenge on you!",175,50);
			}
			break;
		case "medium":
			if (accuracy == 100)
			{
				ctx2.fillText("Excellent! Try again on hard difficulty",175,50);
			}
			else if (points >= 62)
			{
				ctx2.fillText("AMAZING! YOU DID IT! THANK YOU!",175,50);
			}
			else if (points >= 50)
			{
				ctx2.fillText("GREAT JOB! But I still see some roaches.",175,50);
			}
			else if (points >= 30)
			{
				ctx2.fillText("You almost did it",175,50);
			}
			else if (points > 0 )
			{
				ctx2.fillText("OH NO THE COCKROACHES ARE TAKING OVER!",175,50);
			}
			else if (molesWhacked/molesCreated > 0.7)
			{
				ctx2.fillText("YOU MOLE FOE!",175,50);
			}
			else
			{
				ctx2.fillText("I'll get my revenge on you!",175,50);
			}
			break;
		case "hard":
			if (accuracy == 100)
			{
				ctx2.fillText("PERFECT! YOU HAVE UNLOCKED INSANE DIFFICULTY",175,50);
			}
			else if (accuracy > 80 && killPercentage > 80)
			{
				ctx2.fillText("Excellent! Can you get perfect accuracy?",175,50);
			}
			else if (points >= 65)
			{
				ctx2.fillText("AMAZING! You Killed em' THANK YOU!",175,50);
			}
			else if (points >= 50)
			{
				ctx2.fillText("GREAT JOB! But I still see some roaches.",175,50);
			}
			else if (points >= 30)
			{
				ctx2.fillText("You almost did it",175,50);
			}
			else if (points > 0 )
			{
				ctx2.fillText("OH NO THE COCKROACHES ARE TAKING OVER!",175,50);
			}
			else if (molesWhacked/molesCreated > 0.6)
			{
				ctx2.fillText("YOU MOLE FOE!",175,50);
			}
			else
			{
				ctx2.fillText("I'll get my revenge on you!",175,50);
			}
			break;
	}

	game.playAgain = true;
}