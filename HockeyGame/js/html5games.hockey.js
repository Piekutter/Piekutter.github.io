//Lawrence Piekut
// 2014. Game made using Javascript and JQuery and following HTML5 Games Development by example
// I made a very basic AI (CPU) option. Perhaps I will improve it in the future
var KEY = {
UP1: 81, //Q 
DOWN1: 65, //A 
UP2: 80, //P
DOWN2: 76 //L
}
//Global variable of array to store the key pressed status
var hockey = {
scoreA : 0, // score for player A
scoreB : 0, // score for player B
timer : 0
}
hockey.pressedKeys = [];
hockey.ball = {
speed: 5,
x: 150,
y: 100,
directionX: 1,
directionY: 1
}
//Pause button
var pause = true;
var playPauseBtn = document.getElementById("play_pause");
//Audio
var pucksound = document.getElementById("pucksound");
var goodOl = document.getElementById("goodOld");
//autoplay is now disabled. Below will give an error.
goodOl.play();
//Keep count of saves
var savesHabs = 0;
var savesLeafs = 0;
//CPU or Player
var cpu = false;
//Game object dimensions here if they don't change in game on the fly
//Get height of paddle B
var paddleBHeight = parseInt($("#paddleB").height());
var halfPaddleB = paddleBHeight/2;
var ballHeight = parseInt($("#ball").height());
var playGroundHeight = parseInt($("#playground").height());

$(function(){
	
	//goodOl.get(0).play();
	//goodOl.play();   $('..some selector..') this returns an array of actual DOM objects matching your selector. 
	//The .play() method is a native HTML5 method that you need to invoke on the actual native DOM element. 
	//So you need to fetch this native DOM element from the array which is returned by the jQuery selector. 
	//And because you are using an id selector (#goodOld) we can assume that there is a single element in your 
	//DOM matching this selector so we can safely use .get(0) to fetch it. So basically when you use $(...) 
	//you can invoke only jQuery functions on the result and play is not.
	
	//set onchange radio button listener
	$('input:radio').on('change', function(){
		if ($(this).val() == "CPU")
		{
			cpu = true;
			$("#player2Desc").fadeOut();
		}
		else
		{
			cpu = false;
			$("#player2Desc").fadeIn();
		}
	});
	// mark down what key is down and up into an array called "pressedKeys"
	$(document).keydown(function(e){
		//console.log(e.keyCode);
	hockey.pressedKeys[e.which] = true;
	});
	$(document).keyup(function(e){
	hockey.pressedKeys[e.which] = false;
	});
	// register button listener
	//--var button = document.getElementById("pause_game");-->
	//var button = $("pause_game");
	//$("#pause_game").click(pausegame);
	
});

function play_pause(){
	if (pause){
		pause=false;
		$("#winner").text("");
		$("#saves").text("");
		hockey.timer = setInterval(gameloop,30);
		playPauseBtn.value = "PAUSE";
		goodOl.pause();
	}
	else
	{	
		pause=true;
		clearInterval(hockey.timer);
		playPauseBtn.value = "PLAY";
		goodOl.play();
	}
}

function gameloop() {
	moveBall();
    movePaddles();
}
function movePaddles() {
    // use our custom timer to continuously check if a key is pressed.
	//CPU moves paddle.
	//Unless height of paddle will vary throughout game, get height of ball and paddle once at beginning not every loop. Only top and bottom every loop
	if (cpu)
	{
		var paddleBTop = parseInt($("#paddleB").css("top"));
		var paddleBBottom = paddleBTop + paddleBHeight;
		if ( hockey.ball.directionY == 1 && (hockey.ball.y+ballHeight) > (paddleBTop) && paddleBBottom < (playGroundHeight -30) )
		{
			$("#paddleB").css("top", paddleBTop + 12);
		}
		else if( hockey.ball.directionY == -1 && hockey.ball.y < (paddleBTop+paddleBHeight) && paddleBTop > 20)
		{
			$("#paddleB").css("top", paddleBTop - 12);
		}		
/* 				if ( hockey.ball.directionY == 1 && (hockey.ball.y+ballHeight) > (paddleBTop+halfPaddleB) && paddleBBottom < (playGroundHeight -30) )
		{
			$("#paddleB").css("top", paddleBTop + 12);
		}
		else if( hockey.ball.directionY == -1 && hockey.ball.y < paddleBTop && paddleBTop > 30)
		{
			$("#paddleB").css("top", paddleBTop - 12);
		}	 */
	}
	else
	{
		if (hockey.pressedKeys[KEY.UP2]) {
			// move the paddle B up 5 pixels
			var top = parseInt($("#paddleB").css("top"));
			if (top > 0){
				$("#paddleB").css("top", top - 5);
				}
		}
		if (hockey.pressedKeys[KEY.DOWN2]) {
			// move the paddle B down 5 pixels
			var top = parseInt($("#paddleB").css("top"));
			var bottom = top + parseInt($("#paddleB").css("height"));
			var playgroundHeight = parseInt($("#playground").height());
			if (bottom < playgroundHeight){
				$("#paddleB").css("top", top + 5);
			}
		}
	}
	if (hockey.pressedKeys[KEY.UP1]) {
        // move the paddle A up 5 pixels
        var top = parseInt($("#paddleA").css("top"));
		if (top > 0){
			$("#paddleA").css("top", top - 5);
		}
	}
    if (hockey.pressedKeys[KEY.DOWN1]) {
        // move the paddle A down 5 pixels
        var top = parseInt($("#paddleA").css("top"));
		var bottom = top + parseInt($("#paddleA").css("height"));
		var playgroundHeight = parseInt($("#playground").height());
		if (bottom < playgroundHeight){
			$("#paddleA").css("top", top + 5);
		}
    }
}

function moveBall() {
	// reference useful variables
	var playgroundHeight = parseInt($("#playground").height());
	var playgroundWidth = parseInt($("#playground").width());
	//Added ball dimensions so ball doesn't bounce past boundries
	var ballheight = parseInt($("#ball").height());
	var ballwidth = parseInt($("#ball").width());
	var ball = hockey.ball;
	// check playground boundary
	// check bottom edge
	if (ball.y + ballheight + ball.speed*ball.directionY > playgroundHeight)
	{
		ball.directionY = -1;
	}
	// check top edge
	else if (ball.y + ball.speed*ball.directionY < 0)  //added else because we dont need to do this check if the one above is true.
	{
		ball.directionY = 1;
	}
	// check right edge
	if (ball.x + ballwidth + ball.speed*ball.directionX > playgroundWidth)
	{
	//console.debug("right wall x:" + ball.x + " y:" + ball.y);
		// player B lost.
		hockey.scoreA++;
		$("#scoreA").html(hockey.scoreA);
		if (hockey.scoreA == 5)
		{
			//alert("Leafs wins the game!");
			play_pause();
			$("#winner").html("Leafs Win!<br/>" + hockey.scoreA + " - " + hockey.scoreB);
			$("#winner").css("color","blue");
			$("#saves").html("<h3>Saves</h3>Leafs: " + savesLeafs + "<br/>Habs: " + savesHabs + "<br/>");
			$("#saves").css("color","blue");
			hockey.scoreA = 0;
			hockey.scoreB = 0;
			$("#scoreA").html(0);
			$("#scoreB").html(0);
			savesHabs = 0;
			savesLeafs = 0
		}
		//Reset saves
		//saves = 0;
		//$("#saves").text(saves);
		// reset the ball;
		ball.x = 250;
		ball.y = 100;
		$("#ball").css({
		"left": ball.x,
		"top" : ball.y
		});
		ball.speed = 5;
		ball.directionX = -1;
		$("#puckSpeed").html(ball.speed);
	}
	// check left edge
	else if (ball.x + ball.speed*ball.directionX < 0) //changed to else because if above is true it doesnt need this check.
	{	
		//console.debug("left wall x:" + ball.x + " y:" + ball.y);
		// player A lost.
		hockey.scoreB++;
		$("#scoreB").html(hockey.scoreB);
		if (hockey.scoreB == 5)
		{
			//alert("Habs wins the game!");
			play_pause();
			$("#winner").html("Habs Win!<br/>" + hockey.scoreB + " - " + hockey.scoreA);
			$("#winner").css("color","red");
			$("#saves").html("<h3>Saves</h3>Leafs: " + savesLeafs + "<br/>Habs: " + savesHabs + "<br/>");
			$("#saves").css("color","red");
			hockey.scoreA = 0;
			hockey.scoreB = 0;
			$("#scoreA").html(0);
			$("#scoreB").html(0);
			savesHabs = 0;
			savesLeafs = 0
		}
		//Reset saves
		//saves = 0;
		//$("#saves").text(saves);
		// reset the ball;
		ball.x = 150;
		ball.y = 100;
		$("#ball").css({
		"left": ball.x,
		"top" : ball.y
		});
		ball.speed = 5;
		ball.directionX = 1;
		$("#puckSpeed").html(ball.speed);
		
	}
	
	
	ball.x += ball.speed * ball.directionX;
	ball.y += ball.speed * ball.directionY;

	// check left paddle
	var paddleRightEdge = parseInt($("#paddleA").css("left"))+parseInt($("#paddleA").css("width"));
	var paddleLeftEdge = parseInt($("#paddleA").css("left"))
	var paddleAYBottom = parseInt($("#paddleA").css("top"))+parseInt($("#paddleA").css("height"));
	var paddleAYTop = parseInt($("#paddleA").css("top"));
	if (ball.x + ball.speed*ball.directionX <= paddleRightEdge && 
		ball.x + ball.speed*ball.directionX > paddleLeftEdge)
	{
		if (ball.y + ball.speed*ball.directionY <= paddleAYBottom &&
			ball.y + parseInt($("#ball").height()) + ball.speed*ball.directionY >= paddleAYTop)
		{
			//increase save count
			savesLeafs++;
			//$("#saves").text(savesLeafs);
			// Ball bounces off left paddle and goes right
			ball.directionX = 1;
			pucksound.currentTime = 0;
			pucksound.play();	
			if (ball.speed < 15){
				ball.speed ++;
				$("#puckSpeed").html(ball.speed);
				//console.log("left paddle x:" + ball.x + " y:" + ball.y);
			}
		}
	}
	// check right paddle
	var paddleBX = parseInt($("#paddleB").css("left"));
	var paddleRightEdge = parseInt($("#paddleB").css("left")) + ballwidth;
	var paddleBYBottom = parseInt($("#paddleB").css("top"))+parseInt($("#paddleB").css("height"));
	var paddleBYTop = parseInt($("#paddleB").css("top"));
	if (ball.x + ballwidth + ball.speed*ball.directionX >= paddleBX &&
		ball.x + ballwidth + ball.speed*ball.directionX < paddleRightEdge )
	{
		if (ball.y + ball.speed*ball.directionY <= paddleBYBottom &&
			ball.y + parseInt($("#ball").height()) + ball.speed*ball.directionY >= paddleBYTop)
		{
			//increase save count
			savesHabs++;
			//$("#saves").text(saves);
			// Ball bounces off right paddle and goes left
			ball.directionX = -1;
			pucksound.currentTime = 0;
			pucksound.play();	
			if (ball.speed < 15){
				ball.speed ++;
				$("#puckSpeed").html(ball.speed);
			}
		}
	}

	// actually move the ball with speed and direction on screen
	$("#ball").css({
	"left" : ball.x,
	"top" : ball.y
	});
}
function pausegame(){
//alert("game is paused!");
}