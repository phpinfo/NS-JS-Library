/**
 * Sprite animation
 *
 */
ns.SpriteAnimation = new Class
({
	Implements: [Options, Events],
	options: {
		'spriteDimensions' : [32, 32],

		'rangeX'           : 0,
		'rangeY'           : [0, 4],

		'element'          : null,

		'speed'            : 1,

		'returnToStart'    : true
	},
	initialize: function(options){
		this.setOptions(options);
	},

	/**
	 * Counters
	 *
	 * @var {float}
	 */
	counterX: 0,
	counterY: 0,

	/**
	 * Animated element
	 *
	 * @var {Element}
	 */
	element: null,

	/**
	 * Finish flag
	 *
	 * @var {bool}
	 */
	_finished: true,

	/**
	 * Start function
	 *
	 */
	start: function()
	{
		this.counterX = this.options.rangeX.length ? this.options.rangeX[0] : 0;
		this.counterY = this.options.rangeY.length ? this.options.rangeY[0] : 0;

		this._finished = false;
	},

	/**
	 * Cycle function
	 *
	 */
	cycle: function()
	{
		if (this._finished) return;

		var f = true;

		// Counters X
		if (this.options.rangeX.length)
		{
			if (this.counterX < this.options.rangeX[1])
			{
				this.counterX += this.options.speed;
				f = false;
			}
			else
			{
				if (this.options.returnToStart)
					this.counterX = this.options.rangeX[0];
				f = f & true;
			}
		}

		// Counters Y
		if (this.options.rangeY.length)
		{
			if (this.options.rangeY[1] > this.options.rangeY[0])
			{
				if (this.counterY < this.options.rangeY[1])
				{
					this.counterY += this.options.speed;
					f = false;
				}
				else
				{
					if (this.options.returnToStart)
						this.counterY = this.options.rangeY[0];
					f = f & true;
				}
			}
			else
			{
				if (this.counterY > this.options.rangeY[1])
				{
					this.counterY -= this.options.speed;
					f = false;
				}
				else
				{
					if (this.options.returnToStart)
						this.counterY = this.options.rangeY[0];
					f = f & true;
				}
			}
		}

		if (f && !this._finished)
			this.fireEvent('finish');

		this._finished = f;
	},

	/**
	 * Redraw function
	 *
	 */
	redraw: function()
	{
		// Setting element style
		var posX = -Math.round(this.counterX) * this.options.spriteDimensions[0];
		var posY = -Math.round(this.counterY) * this.options.spriteDimensions[1];
		
		if (this.element === null)
			this.element = $(this.options.element);

		this.element.style.backgroundPosition = posX + 'px ' + posY + 'px';
	}
});