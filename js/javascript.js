
//clock class
// mode: 1 - normal, 2 - military, 3 - no seconds
var Clock = function(container) {
	this.container = container;
	this.hour = this.container.find('.hour');
	this.minute = this.container.find('.minute');
	this.second = this.container.find('.second');
	this.mili = this.container.find('.mili');
	this.ampm = this.container.find('.ampm');

	this.container.addClass('one'); //set the mode to 1

	this.interval; //interval for timer
	this.diff = false; //time difference for timer

	//helper function to add a zero.
	function keepZero(num) {
		if (num < 10)
			return "0" + num;
		else
			return num;
	}

	this.refresh = function() {
		var date = new Date();
		if (!this.container.hasClass('two')) {
			if (date.getHours() > 12) {
				this.hour.html(date.getHours() - 12);
				this.ampm.html("pm");
			} else {
				if (date.getHours() == 0)
					this.hour.html(12);
				else
					this.hour.html(date.getHours());
				this.ampm.html("am");
			}
		}else{
			this.hour.html(date.getHours());
			this.ampm.html("");
		}

		this.minute.html(keepZero(date.getMinutes()));
		if (!this.container.hasClass('three')) 
			this.second.html(keepZero(date.getSeconds()));
		else
			this.second.html("");

		return true;
	};
	this.start = function() {
		var curr = new Date();
		if (this.diff)
			curr = this.diff.getTime() - curr.getTime();
		else
			curr = curr.getTime();
		dis = this;
		
		this.interval = setInterval(function() {
			var now = new Date();
			this.diff = new Date(Math.abs(now.getTime() - curr));
			console.log(this.diff);

			//truncate last digit of miliseconds.
			var mili = this.diff.getMilliseconds();
			mili = Math.trunc(mili/10);

			dis.mili.html(keepZero(mili));
			dis.second.html(keepZero(this.diff.getSeconds()));
			dis.minute.html(keepZero(this.diff.getMinutes()));
			dis.hour.html(this.diff.getHours() - 18);

		}, 10);
		return true;
	};
	this.stop = function() {
		clearInterval(this.interval);
		return true;
	};
}

$(function() {
	var clock = new Clock($('#clock'));
	var timer = new Clock($('#timer'));

	//set default mode to clock
	$('.mode').hide();
	$('#clock').show();


	//tick tock
	var tick = setInterval(function() {
		clock.refresh();
	}, 100);

	//set brightness by time of day
	var tod = (new Date()).getHours();
	if (tod > 8 && tod < 20)
		$('body').addClass('light');

	//switch brightness
	$('#brightness').click(function() {
		if ($('body').hasClass('light'))
			$('body').removeClass('light')
		else
			$('body').addClass('light');
	})

	//clock function
	$('#clock').click(function() {
		$this = $(this);
		if ($this.hasClass('one')) {
			$this.removeClass('one');
			$this.addClass('two');
		} else if ($this.hasClass('two')) {
			$this.removeClass('two');
			$this.addClass('three');
		} else if ($this.hasClass('three')) {
			$this.removeClass('three');
			$this.addClass('one');
		}
	});

	//timer function
	$('#timer').click(function() {
		if ($('#timer').hasClass('active')) {
			$('#timer').removeClass('active')
			timer.stop();
		} else if (timer.start())
			$('#timer').addClass('active');
	});

	//toggle menu
	$('#togglemenu').click(function() {
		if ($('#menu').hasClass('active'))
			$('#menu').removeClass('active').stop().slideUp(200);
		else
			$('#menu').addClass('active').stop().slideDown(200);
	});

	//menu options selected
	$('#menu ul li.btn').click(function() {
		if ($(this).hasClass('selected'))
			return;
		$('#menu ul li.btn').removeClass('selected');
		$(this).addClass('selected');
		if ($(this).hasClass('clock')) {
			$('.mode').stop().fadeOut(200);
			$('#clock').stop().delay(200).fadeIn(200);
		}else if ($(this).hasClass('timer')) {
			$('.mode').stop().fadeOut(200);
			$('#timer').stop().delay(200).fadeIn(200);
		}
	});

	//toggle font size 
	$('#menu button.size').click(function() {
		var s = $(this).find('span.selected');
		var c = $('section.container');
		$(this).find('span').removeClass('selected');
		if (c.hasClass('big')) {
			c.removeClass('big').addClass('medium');
			$(this).find('span.medium').addClass('selected');
		} else if (c.hasClass('medium')) {
			c.removeClass('medium').addClass('small');
			$(this).find('span.small').addClass('selected');
		} else if (c.hasClass('small')) {
			c.removeClass('small').addClass('big');
			$(this).find('span.big').addClass('selected');
		}
	});

	$('body').keypress(function(e) {
		//alert(e.keyCode);
		if (e.which == 98)
			$('#brightness').click();
		if (e.which == 109)
			$('#togglemenu').click();
	});

});