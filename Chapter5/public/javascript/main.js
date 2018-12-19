var redBlock = document.getElementById("red-block");
var greenBlock = document.getElementById("green-block");

redBlock.addEventListener("click", () => {
	redBlock.classList.toggle("red-block-on");
});

greenBlock.addEventListener("click", () => {
	greenBlock.classList.toggle("green-block-on");
});

