(function() {
	
	var socket = io();
	var redBlock = document.getElementById("red-block");
	var greenBlock = document.getElementById("green-block");

	redBlock.addEventListener("click", () => {
		var redClick = redBlock.classList.toggle("red-block-on");
		socket.emit('red', redClick + "_red");
	});

	greenBlock.addEventListener("click", () => {
		var greenClick = greenBlock.classList.toggle("green-block-on");
		socket.emit('green', greenClick + "_green");
	});
	
	var sendTextButton = document.getElementById("send-text");
	
	sendTextButton.addEventListener("click", () => {
		var sendText = document.getElementById("input-text").value;
		socket.emit('input-text', sendText);
	});
})();
