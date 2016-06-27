
	class Genius {

		constructor() {

			this.buttons = 	[ 'green'
							, 'red'
							, 'yellow'
							, 'blue' ];

			this.order = [];

			this.timer;

			this.sounds = { buttons: [] };

			this.canPressButton = false;

			this.lock = false;

			this.time_limit = 2000;

			this.number_of_rounds = 0;

			this.order.push(this.pickRandomButton());

			this.pressButton = this.pressButton.bind(this);
			this.addEventListeners = this.addEventListeners.bind(this);
			this.playButton = this.playButton.bind(this);
			this.gameOver = this.gameOver.bind(this);
			this.startRound = this.startRound.bind(this);
			this.roundEnded = this.roundEnded.bind(this);
			this.playerWon = this.playerWon.bind(this);

			this.addEventListeners();
			this.loadSounds();

			//start playing the first item of the order
			this.playButton(0);
		}

		pickRandomButton() {
			return Math.floor(Math.random() * this.buttons.length);
		}

		pressButton(event) {

			if ( this.lock || ! this.canPressButton || ! event.target )
				return;

			clearTimeout(this.timer);

			this.lock = true;

			var pressed_bt = event.target.id;

			var bt = this.buttons.indexOf(pressed_bt);

			this.sounds.buttons[bt].play()
			this.lightOn(bt);

			setTimeout(() => {
			this.lightOff(bt);

			if ( pressed_bt != this.buttons[this.order[this.player_order]] ) {
				this.gameOver();
				return;
			}

			this.player_order++;

			if ( this.player_order == this.order.length ) {
				this.lock = false;
				this.roundEnded();
				return;
			}

			this.timer = setTimeout(this.gameOver, this.time_limit);

			this.lock = false;
			}, 500);
		}

		addEventListeners() {
			for(var i in this.buttons) {
				document.querySelector(`#${this.buttons[i]}`)
					.addEventListener('click', this.pressButton);
			}
		}

		roundEnded() {

			this.canPressButton = false;

			this.player_order = 0;

			this.number_of_rounds++;

			if ( this.number_of_rounds == 20 ) {
				this.playerWon();
				return;
			}

			this.order.push(this.pickRandomButton());

			//start playing the first item of the order
			this.playButton(0);
		}

		playButton(i) {

			// the order has ended
			if ( typeof this.order[i] == 'undefined' ) {
				this.startRound();
				return;
			}

			setTimeout(() => {

				var bt = this.order[i];

				this.sounds.buttons[bt].play()
				this.lightOn(bt);

				setTimeout(() => {
					this.lightOff(bt)
					this.playButton(i + 1);
				}, 500);

			}, 500);
		}

		loadSounds() {
			for(var i in this.buttons) {
				this.sounds.buttons[i] = new Audio(`audios/Blip_Select${i}.wav`);
			}

			this.sounds.game_over = new Audio('audios/Game_Over.wav');
			this.sounds.won = new Audio('audios/Won.wav');
		}

		lightOn(i) {
			var el = document.querySelector(`#${this.buttons[i]}`);
			var classes = el.className.split(' ');

			classes.push('bt_light');

			el.className = classes.join(' ');
		}

		lightOff(i) {
			var el = document.querySelector(`#${this.buttons[i]}`);
			var classes = el.className.split(' ');

			classes.splice(classes.indexOf('bt_light'), 1);

			el.className = classes.join(' ');
		}

		gameOver() {
			this.canPressButton = false;

			this.sounds.game_over.play();

			alert('GAME OVER!');
		}

		playerWon() {
			this.canPressButton = false;

			this.sounds.won.play();

			alert('YOU WIN!');
		}

		startRound() {
			this.canPressButton = true;
			this.player_order = 0;
			this.timer = setTimeout(this.gameOver, this.time_limit);
		}

	}

	var game;

	document.querySelector('#start')
		.addEventListener('click', () => game = new Genius());