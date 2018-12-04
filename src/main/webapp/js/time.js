var timeRemain = 3000;
var timer;
function resetTime() {
	timeRemain = 300;
}

function startTimer(id) {
	document.getElementById(id).innerText = timeRemain;
	timer = setInterval(function() {
		timeRemain--;
		if(timeRemain>0){
			document.getElementById(id).innerText = timeRemain;
		}else{
			window.location.href="../index.html";  
		}

	}, 1000);
}

function stopTimer() {
	clearInterval(timer);
}
