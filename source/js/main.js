/*
	Magic 8-Ball - Animated

	We are going to use some CSS3 animations to make the 8-ball animate when we
	click the generate prediction button.
*/


var magicEightBall = {
	phrases: [
		"It is certain",
		"Without a doubt",
		"Yes definitely",
		"You may rely on it",
		"Most likely",
		"Outlook good",
		"Signs point to yes",
		"Reply hazy try again",
		"Ask again later",
		"Better not tell you now",
		"Concentrate and ask again",
		"Don't count on it",
		"My sources say no",
		"Outlook not so good",
		"Very doubtful"
	],
	generatePrediction: function () {
		// Don't forget to use this when you want to access a property on the
		// object!
		var randomIndex = Math.floor(Math.random() * this.phrases.length);
		var phrase = this.phrases[randomIndex];
		return phrase;
	}
};


var eightballFigure = document.getElementById("eightball-figure");
var eightballCaption = eightballFigure.lastElementChild;
var button = document.getElementById("eightball-button");


button.onclick = updatePredication;

// Reset the animations when they are done
eightballFigure.addEventListener("animationend", endAnimation, false);
eightballCaption.addEventListener("animationend", endAnimation, false);


function updatePredication() {
	// Generate and update the page with a prediction
	predictionText = magicEightBall.generatePrediction();
	eightballCaption.textContent = predictionText;

	// Trigger an 8-ball animation 	
	eightballFigure.classList.add("animated"); 	
	eightballFigure.classList.add("shake");

	// Trigger an animation for the caption
	eightballCaption.classList.add("animated"); 	
	eightballCaption.classList.add("fadeIn");
	// Customize the animation so that it looks better with the 8 ball shaking
	// animation
	eightballCaption.style.animationDelay = "0.5s";
	eightballCaption.style.animationDuration = "0.5s";

	// Disable the button so that it can't be pressed while an animation is 
	// playing
	button.disabled = true;
	button.style.opacity = 0.25;
}


function endAnimation(event) {

	// A better approach - removing specific animations from the class list
	var element = event.currentTarget;
	element.classList.remove("animated");
	element.classList.remove("shake");
	element.classList.remove("fadeIn");

	// Re-enable the button now that animation is finished
	button.disabled = false;
	button.style.opacity = 1.0;
}