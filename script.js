window.onload = function() /*fonction va etre lancée lorsque la fenetre va s'afficher */
{
	/*On sort les variables pour qu'elles soient accessibles par les deux fonctions */
	var canvasWidth = 900;
	var canvasHeight = 600;
	var blockSize = 30;
	var ctx;
	var delay=100; /*exprimé en milliseconde donc la c'est egal à une seconde */
	var snakee;
	var applee;
	var widthInBlocks = canvasWidth/blockSize;
	var heightInBlocks = canvasHeight/blockSize;
	var score; /*variable score*/
	var timeout;


	init(); /*permet d'executer la fonction init*/

/*Déclaration de la fonction init*/
	function init()
	{
		/*Création du canvas/ cadre du jeu*/
	var canvas = document.createElement('canvas'); /*Permet de dessiner dans le HTML */
	canvas.width= canvasWidth;
	canvas.height= canvasHeight;
	canvas.style.border="30px solid gray"; /*bordure du jeu*/
	canvas.style.margin = "50px auto"; /*centrer l'element*/
	canvas.style.display = "block"; /*obligatoire pour pouvoir deplacer un element*/
	document.body.appendChild(canvas); /*permet d'accrocher avec le doc html/body */
	canvas.style.backgroundColor = "#ddd"; /*Change la couleur d'arriere plan du jeu*/

	/*Pour dessiner dans le rectangle*/
	ctx = canvas.getContext('2d'); /*choisir le mode, 2D en l'occurence ici */
	snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");/*serpent du début*/
	applee= new Apple([10,10]);
	score = 0; /*debuter la partie avec le score de zero*/
	refreshCanvas();
	}

/*Déclaration de la fonction refreshCanvas*/
	function refreshCanvas() /*Va permettre de rafraichir notre canvas*/
	{
		snakee.advance(); /*important d'appeler les fonctions au fur et a mesure*/
		if(snakee.checkCollision()) /*raison d'avoir perdu*/
		{
			gameOver();/*Execution de la fonction gameOver*/
		}
		else
		{
			if(snakee.isEatingApple(applee))
			{
				score++; /*ajouter 1 au score lorsqu'on mange une pomme*/
				snakee.ateApple = true; /*Oui le serpent a mange une pomme*/
				do     /*verifier si la pomme est sur la mele position que notre serpent*/
				{
					applee.setNewPosition();
				}
				while(applee.isOnSnake(snakee)) /*si oui ça va renvoyer une nouvelle position a la pomme*/
			}
		
			ctx.clearRect(0,0, canvasWidth, canvasHeight); /*Enlever ce qu'on a dessiné auparavant, on veut qu'il soit juste dans sa nouvelle position */
			/*ctx.fillStyle = "#ff0000"; /*choisir la couleur/ l'enlever une fois le snakee.draw ajouté car on dessine un serpent et non un rectangle maintenant*/
			/*ctx.fillRect*//* (xCoord/*x*/ /*,yCoord/*y*/ /*,100 ,50);/*dessiner le rectangle x= distance 	horizontale du bord et y= distance verticale
			100= largeur du rectangle(px) et 50= hauteur (px) /l'enlever une fois le snakee.draw ajouté car on 	dessine un serpent et non un rectangle maintenant*/
			drawScore(); /*execution code de la fonction dessin score*/ /*mettre draw score en premier pour que lserpent passe sur le score et non en dessous*/
			snakee.draw(); /*execution code de la fonction dessin serpent*/
			applee.draw();/*execution code de la fonction dessin pomme*/			
			timeout = setTimeout(refreshCanvas,delay); /*setTimeout permet de dire: execute moi une certaine fonction a chaque fois qu'un certain delai est passé (celui qu'on a defini au debut; delay)*/
		}
		
	}

	function gameOver() /*creation fonction Gameover*/
	{
		ctx.save(); /*permet de garder le contexte du canvas (couleur.....)*/
		ctx.font = "bold 70px sans-serif";
		ctx.fillStyle = "black";
		ctx.textAlign= "center";
		ctx.textBaseline = "middle";
		ctx.strokeStyle = "white"; /*petit contour du texte*/
		ctx.lineWidth = 5; /*epaisseur du contour */
		var centreX = canvasWidth / 2;
		var centreY = canvasHeight / 2;
		ctx.strokeText("Game Over", centreX, centreY - 180); /*permet afficher le contour*/
		ctx.fillText("Game Over", centreX, centreY - 180); /*Permet d'écrire du texte*/
		ctx.font = "bold 30px sans-serif";/*modifier police du appuyer sur espace..*/
		ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
		ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
		ctx.restore();
	}

	function restart() /*creation fonction restart pour demarrer une autre partie*/
	{
		snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");/*serpent du début*/
		applee= new Apple([10,10]);
		score = 0; /*debuter a zero quand on recommence une partie*/
		clearTimeout(timeout); /*permet de remettre a zero les parametres du setTimeout des qu'on redemarre une partie, pour la vitesse du serpent*/
		refreshCanvas();
	}

	function drawScore() /*Dcelaration fonction affichage score*/
	{
		ctx.save(); /*permet de garder le contexte du canvas (couleur.....)*/
		ctx.font = "bold 200px sans-serif"; /*changer police score et en gras*/
		ctx.fillStyle = "gray"; /*changer couleur du score*/
		ctx.textAlign= "center"; /*centrer le texte*/
		ctx.textBaseline = "middle"; /*Affichage du texte au milieu de la page*/
		var centreX = canvasWidth / 2; /*centrer en largeur dans le jeu*/
		var centreY = canvasHeight / 2; /*centrer en hauteur dans le jeu */
		ctx.fillText(score.toString(), centreX, centreY); /*Permet d'écrire du texte et de choisir la position*/
		ctx.restore();
	}

	function drawBlock(ctx, position)
	{
		var x= position[0]*blockSize;
		var y= position[1]*blockSize;
		ctx.fillRect(x,y, blockSize, blockSize);
	}


	/*Creation du serpent*/
	function Snake(body, direction) /*prototype du serpent*/
	{
		this.body = body;
		this.direction = direction;	
		this.ateApple = false;	
		this.draw = function()/*permettra de dessiner le corps de notre serpent */
		{
			ctx.save(); /*sauvegarde le contenu*/
			ctx.fillStyle = "#ff0000";
			for(var i=0; i< this.body.length; i++)
			{
				drawBlock(ctx, this.body[i]);
			}
			ctx.restore();/*permet de dessiner sur le ctx et de le remettre comme il était avant */
		};
		this.advance= function() /*Le faire avancer*/
		{
			var nextPosition = this.body[0].slice();
			switch(this.direction)
			{
				case "left":
					nextPosition[0] -= 1;
					break;
				case "right":
					nextPosition[0] += 1;
					break;
				case "down":
					nextPosition[1] += 1;
					break;
				case "up":
					nextPosition[1] -=1;
					break;
				default:
					throw("Invalid Direction"); /*throw, Permet de mettre un message d'erreur*/
			}
			this.body.unshift(nextPosition); /*ajoute la derniere position ajoutée */
			if(!this.ateApple) /*!=no ; si le snake ne mange pas de pomme ca ne supprime pas le dernier element*/
				this.body.pop(); /*permet de supprimer le dernier element d'un array/ la tete avance et du coup supprime la queue*/
			else
				this.ateApple = false;
		};

		this.setDirection = function(newDirection)
		{/*etablir direction en fonction du sens du serpent*/
			var allowedDirections;
			switch(this.direction)
			{/*si serpent avance a gauche ou a droite je ne peux diriger qu'en haut ou en bas*/
				case "left":
				case "right":
					allowedDirections= ["up", "down"];
					break;
			/*si serpent avance en haut ou en bas je ne peux diriger qu'a droite ou a gauche*/
				case "down":
				case "up":
					allowedDirections= ["right", "left"];
					break;
				default:
					throw("Invalid Direction"); /*throw, Permet de mettre un message d'erreur*/
			}
			/*Si l'index de ma nouvelle direction est >-1 alors elle est permise*/
			if(allowedDirections.indexOf(newDirection) >-1)
			{
				this.direction = newDirection;
			}
		};
		this.checkCollision = function()
		{
			var wallCollision = false;
			var snakeCollision = false;
			var head = this.body[0]; /*la tete*/
			var rest = this.body.slice(1);/* tout sauf la tete */
			var snakeX= head[0];
			var snakeY= head[1];
			var minX = 0;
			var minY = 0;
			var maxX = widthInBlocks - 1;
			var maxY = heightInBlocks - 1;
			var isNotBetweenHorizontalWalls = snakeX < minX || snakeX >maxX;
			var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

			if(isNotBetweenHorizontalWalls||isNotBetweenVerticalWalls)
			{
				wallCollision = true;
			}
			for(var i = 0; i<rest.length; i++)
			{ /*collision du corps*/
				if(snakeX === rest[i][0] && snakeY === rest[i][1])
				{
					snakeCollision = true;
				}
			}

			return wallCollision || snakeCollision;
		};
	

	this.isEatingApple = function(appleToEat)
	{
		var head = this.body[0];
		if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])/*la tete est egal a l'emplacement de la pomme*/
			return true;
		else
			return false;
		
	};

	}
	

	/*Creation de la pomme */
	function Apple(position)
	{
		this.position = position;
		this.draw = function()
		{
			ctx.save();
			ctx.fillStyle = "#33cc33";
			ctx.beginPath();
			var radius= blockSize/2; /*taille du rayon pour dessiner la pomme */
			var x = this.position[0]*blockSize + radius;
			var y = this.position [1]*blockSize + radius;
			ctx.arc(x,y, radius, 0, Math.PI*2, true); /*fonction qui dessine le cercle*/
			ctx.fill(); /*remplit la pomme*/
			ctx.restore();
		};

		this.setNewPosition = function ()
		{ /*creation new pomme en aleatoire, math round pour un nombre entier; random: aleatoire entre 0et1*/
			var newX = Math.round(Math.random() * (widthInBlocks -1));
			var newY = Math.round(Math.random() * (heightInBlocks -1));
			this.position = [newX, newY];
		};
		/*methode pour Verifier si la position de la pomme est sur le serpent*/
		this.isOnSnake = function(snakeToCheck)
		{
			var isOnSnake = false;

			for(var i=0; i<snakeToCheck.body.length; i++)
			{
				if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
				{
				isOnSnake = true;
				}	
			}
			return isOnSnake;
			
		};
	}

	document.onkeydown = function handleKeyDown(e)/*lorsque l'utilisateur appuie sur une touche de son clavier */
	{ /*le "e" est l'evenement/ chaque touche à un code donné par l'evenement */
		var key = e.keyCode; /*code de la touche qui a été appuyée*/
		var newDirection; /*creer la nouvelle direction avec la touche appuyée*/
		switch(key)/*fixer la nouvelle direction en fonction de la touche utilisée par l'utilisateur*/ 
		{
			case 37: /*correspond fleche de gauche*/
				newDirection = "left";
				break;
			case 38: /*fleche qui va en haut*/
				newDirection = "up";
				break;
			case 39: /*fleche qui va a droite*/
				newDirection = "right";
				break;
			case 40:/*felche qui va en bas*/
				newDirection = "down";
				break;
			case 32: /*touche Espace*/
				restart();
				return /*return arrete l'execution de la fonction*/
			default:
				return;
		}
		snakee.setDirection(newDirection);
	};
}
