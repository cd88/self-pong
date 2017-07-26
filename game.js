var canvas;
var canvasContext;
var gameHeight;
var gameWidth;
var fps = 1000/33;
var frame = 0
var paddleMargin = 20;

var ballX = 100;
var ballY = 300;
var ballRadius = 5;
var ballHeight = ballRadius * 2;
var ballWidth = ballRadius * 2;
var ballSpeedX = -2;
var ballSpeedY = -2;
var ballSlope;

var paddleHeight = 100;
var paddleWidth = 12;

var paddleTop = 250;
var prevPaddleY = 250;
var paddleVelocity = 0;
var paddle1SurfaceX = paddleMargin + paddleWidth;
var paddleBottom = paddleTop + paddleHeight;
var paddle2SurfaceX;

var gameViewportPosY;
var minPaddleY;
var maxPaddleY;
var paddleTimer;

var hitCount = 0;




window.onload = function() {
	canvas = document.getElementById("game-canvas");
	canvasContext = canvas.getContext('2d');
	gameHeight = canvas.height;
	gameWidth = canvas.width;

	paddle2SurfaceX = gameWidth - (paddleMargin + paddleWidth);

	gameViewportPosY = canvas.getBoundingClientRect().top;
	minPaddleY = gameViewportPosY + paddleHeight/2;
	maxPaddleY = gameViewportPosY + gameHeight - paddleHeight/2;

    document.onmousemove = handleMouseMove;

	setInterval(function()
		{
			drawEverything();
			moveBall();
		}, fps);
}

function handleMouseMove(event) {

	var dot, eventDoc, doc, body, pageX, pageY;

	event = event || window.event; // IE-ism

	// IfpageX/Y aren't available and clientX/Y
	// are, calculate pageX/Y - logic taken from jQuery
		// Calculate pageX/Y ifmissing and clientX/Y available
	if(event.pageX == null && event.clientX != null) {
	eventDoc = (event.target && event.target.ownerDocument) || document;
	doc = eventDoc.documentElement;
	body = eventDoc.body;

	event.pageX = event.clientX +
		(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
		(doc && doc.clientLeft || body && body.clientLeft || 0);
	event.pageY = event.clientY +
		(doc && doc.scrollTop  || body && body.scrollTop  || 0) -
		(doc && doc.clientTop  || body && body.clientTop  || 0);
	}

// create white dots to show where the cursor has been
	// dot = document.createElement('div');
	// dot.className = "dot";
	// dot.style.left = event.pageX + "px";
	// dot.style.top = event.pageY + "px";
	// document.body.appendChild(dot);

	// console.log( event.pageY, event.pageX)

	moveUserPaddle(event.pageY);
	window.clearTimeout(paddleTimer);
	paddleTimer = window.setTimeout(function() {paddleVelocity = 0; console.log(paddleVelocity)}, fps);

}

function calculatePaddleVelocity(posY) {
	if(prevPaddleY && posY != prevPaddleY && posY > minPaddleY && posY < maxPaddleY) {
		paddleVelocity = posY > prevPaddleY ? Math.pow((posY - prevPaddleY), .4) : Math.pow((prevPaddleY - posY), .4) * -1 || 0;
		// console.log("paddleVelocity: " + paddleVelocity + " diff: " + (posY - prevPaddleY));
	}
	// else console.log(paddleVelocity, prevPaddleY, posY);
	prevPaddleY = posY;
}

function moveUserPaddle(posY) {
	//paddle reached the top
	if(posY < minPaddleY) {
		paddleTop = 0;
	}

	//paddle reached the bottom
	else if(posY > maxPaddleY) {
		paddleTop = gameHeight - paddleHeight;
	}
	else paddleTop = posY - paddleHeight/2;
	paddleBottom = paddleTop + paddleHeight;
	
	calculatePaddleVelocity(posY);
}

function moveBall() {
	frame++;
	if(ballX >= gameWidth - ballRadius || ballX <= ballRadius) ballSpeedX = -ballSpeedX;
	if(ballY >= gameHeight - ballRadius || ballY <= ballRadius) ballSpeedY = -ballSpeedY;

	if(ballSpeedX < 0) {
		ballLeft = ballX - ballRadius;
		if(ballLeft <= paddle1SurfaceX - ballSpeedX/2 && ballLeft >= paddle1SurfaceX + ballSpeedX/2) {
			if(ballY + (ballRadius * (Math.sqrt(2)))/2 > paddleTop && ballY - (ballRadius * (Math.sqrt(2)))/2 <= paddleBottom) {
				hitCount ++;
				ballSlope = ballSpeedY/ballSpeedX;

				ballVelocity = Math.pow((Math.pow(ballSpeedX, 2) + Math.pow(ballSpeedY, 2)) , .5);
				console.log("ballVelocity: " + ballVelocity + "\npaddleVelocity: " + paddleVelocity + "\nballSpeedX: " + ballSpeedX + "\nballSpeedY: " + ballSpeedY);
				ballSpeedY += paddleVelocity;

				ballSpeedX = Math.pow((Math.pow(ballVelocity, 2) - Math.pow(ballSpeedY, 2)) , .5) || 1;
				// ballSpeedX -= Math.pow((Math.pow(ballSpeedX, 2) / Math.pow(paddleVelocity, 2)) , .5);
				// Math.abs(Math)
				if (hitCount % 3 === 0) ballSpeedX = ballSpeedX + 1

				console.log("ball hit paddle")
			}
			else console.log("ball MISSED" + "\nballY: " + ballY + "\npaddleTop: " + paddleTop + "\nball bottom-left corner: " + (ballY + (ballRadius * (Math.sqrt(2)))/2) + "\npaddleBottom: " + paddleBottom + "\nball top-left corner: " + (ballY - (ballRadius * (Math.sqrt(2)))/2));
		}
	}

	if(ballSpeedX > 0) {
		ballRight = ballX + ballRadius;
		if(ballRight >= paddle2SurfaceX - ballSpeedX/2 && ballRight <= paddle2SurfaceX + ballSpeedX/2) {

				console.log("11111");
			if(ballY + (ballRadius * (Math.sqrt(2)))/2 > paddleTop && ballY - (ballRadius * (Math.sqrt(2)))/2 <= paddleBottom) {
				hitCount ++;
				ballSlope = ballSpeedY/ballSpeedX;

				ballVelocity = Math.pow((Math.pow(ballSpeedX, 2) + Math.pow(ballSpeedY, 2)) , .5);
				console.log("ballVelocity: " + ballVelocity + "\npaddleVelocity: " + paddleVelocity + "\nballSpeedX: " + ballSpeedX + "\nballSpeedY: " + ballSpeedY);
				ballSpeedY += paddleVelocity;

				ballSpeedX = -1 * ( Math.pow((Math.pow(ballVelocity, 2) - Math.pow(ballSpeedY, 2)) , .5) ) || -1;
				// ballSpeedX -= Math.pow((Math.pow(ballSpeedX, 2) / Math.pow(paddleVelocity, 2)) , .5);
				// Math.abs(Math)
				if (hitCount % 3 === 0) ballSpeedX = ballSpeedX - 1;

				console.log("ball hit paddle")
			}
			else console.log("ballY: " + ballY + "\npaddleTop: " + paddleTop + "\nball bottom-right corner: " + (ballY + (ballRadius * (Math.sqrt(2)))/2) + "\npaddleBottom: " + paddleBottom + "\nball top-right corner: " + (ballY - (ballRadius * (Math.sqrt(2)))/2));
		}
	}


	ballX += ballSpeedX;
	ballY += ballSpeedY;


	if(frame % 30 == 0) console.log ("ballX: " + ballX, "ballY: " + ballY + "\nballSpeedX: " + ballSpeedX + "\nballSpeedY: " + ballSpeedY);
	
}

function drawEverything() {


	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	canvasContext.fillStyle = "white";
	canvasContext.fillRect(paddleMargin, paddleTop, paddleWidth, paddleHeight);

	canvasContext.fillStyle = "white";
	canvasContext.fillRect(gameWidth - paddleMargin - paddleWidth, paddleTop, paddleWidth, paddleHeight);
	
	canvasContext.beginPath();
	canvasContext.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
	canvasContext.fillStyle = "red";
	canvasContext.fill();
	canvasContext.closePath();



}