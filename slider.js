/**
 * Slider class
 *
 */
var NS = NS || {};
NS.Slider = new Class({
	Implements: [Options, Events, NS.Semaphore],

	options:
	{
		// Container (movable element, slider)
		'elContainer'         : null,
		
		// Control buttons
		'elPrev'              : null,
		'elNext'              : null,
		'buttonDisabledClass' : 'disabled',
		
		// Auto size
		'autoSizeElements'    : true,
		
		// Frames
		'frameSize'           : null,
		'framesCount'         : null,
		'framesVisible'       : 3,
		'framesSelector'      : '*',
		
		// Unit
		'unit'                : 'px',
		
		// Slide direction: 0 - horizontal, 1 - vertical
		'direction'           : 0,
		
		// Force slide if first or last visible frame is selected
		'autoSlide'           : true,
		
		// Frames selection
		'selectable'          : true,
		'selectedClass'       : 'selected',
		
		// Enables mouse wheel events
		'mouseWheelEnabled'   : true,
		
		// Slide effect duration in msec
		'fxDuration'          : 150
	},
	
	/**
	 * Initialization
	 *
	 * @param {Hash} options
	 */
	initialize: function(options)
	{
		this.setOptions(options);
		
		// Elements
		this.options.elContainer = $(this.options.elContainer);
		this.options.elNext = $(this.options.elNext);
		this.options.elPrev = $(this.options.elPrev);

		// Direction: only 0 or 1
		this.options.direction = Number(this.options.direction == 1);

		// Fx
		this._fx = new Fx.Tween(this.options.elContainer, {
			'property': ['left', 'top'][this.options.direction],
			'duration': this.options.fxDuration,
			'unit': this.options.unit,
			'onStart': this.disable.bind(this),
			'onComplete': this.enable.bind(this)
		});

		// Frames size
		if (this.options.frameSize === null)
		{
			// TODO: automatic <this.options.frameSize> definition if <this.options.unit> is 'px'

			// Automatic <this.options.frameSize> definition if <this.options.unit> is '%'
			if (this.options.unit == '%')
			{
				this.options.frameSize = [null, null];
				this.options.frameSize[this.options.direction] = 100 / this.options.framesVisible;
				this.options.frameSize[1 - this.options.direction] = 0;
			}
		}

		// Reinit
		this.reinit();

		// Event handlers
		this._setEventHandlers();

		// Select first element
		//this.select(0);
	},
	
	/**
	 * Reinitialization
	 * You can call it if frames elements changed
	 */
	reinit: function()
	{
		// Caching frame elements
		this._frames = this.options.elContainer.getElements(this.options.framesSelector);

		// Frames count
		// TODO: this.options.framesCount => this._framesCount
		//this.options.framesCount = this.options.framesCount || this._frames.length;
		this.options.framesCount = this._frames.length;

		// Automatic elements sizes calculation
		if (this.options.autoSizeElements)
		{
			if (this.options.unit == '%')
			{
				var style = ['width', 'height'][this.options.direction];

				// Container
				this.options.elContainer.setStyle(style, this.options.framesCount * 100 / this.options.framesVisible + '%');

				// Frames
				this._frames.setStyle(style, 100 / this.options.framesCount + '%');
			}
		}

		// Scroll to 0
		this.scrollTo(0);
	},


	/**
	 * Current position
	 * It means frames [<position>] to [<position> + <framesCount> - 1] are visible
	 * @var {int}
	 */
	position: 0,
	
	/**
	 * Fx
	 * @var {Fx}
	 */
	_fx: null,
	
	/**
	 * Frames
	 * @var {Array}
	 */
	_frames: [],
	
	/**
	 * Scrolls <container>
	 * @param {int} count
	 */
	scroll: function(count)
	{
		this.scrollTo(Number(this.position) + count);
	},
	
	/**
	 * Scrolls to position
	 * @param {int} position
	 */
	scrollTo: function(position)
	{
		// Checking enabled
		if (this.isEnabled())
		{
			// Before start and after end events
			if (position != this.position)
			{
				if (this._isFirst() && position < this.position)
					this.fireEvent('scrollBeforeStart', { 'target': this });

				if (this._isLast() && position > this.position)
					this.fireEvent('scrollAfterEnd', { 'target': this });
			}

			// Position can't be larger than <framesCount> - <framesVisible>
			if (position > this.options.framesCount - this.options.framesVisible)
				position = this.options.framesCount - this.options.framesVisible;

			// Position can't be negative
			if (position < 0) position = 0;

			if (position != this.position)
			{
				// Frame size
				var frameSize = this.options.frameSize[this.options.direction];

				// Animation
				this._fx.start(-this.position * frameSize, -position * frameSize);

				// Firing event
				this.fireEvent('scroll', {
					'target': this,
					'from': this.position,
					'to': position
				});
				
				// Changing position
				this.position = position;
			}

			// Checking buttons availability
			this._checkButtons();

			// Frames first/last classes
			this._frames.each(function(frame, index){
				frame.removeClass('first').removeClass('last');
				if (this._isFirstOfVisible(index)) frame.addClass('first');
				if (this._isLastOfVisible(index)) frame.addClass('last');
			}.bind(this));
		}
	},
	
	/**
	 * Selects element
	 * @param {int} index
	 */
	select: function(index)
	{
		return;

		//if (this._busy) return;

		// Selected element
		var element;

		// Fire deselect events
		this.container.getChildren().each(function(el, i){
			el.fireEvent('deselect', {
				'element'        : el,
				'index'          : i,
				'firstOfVisible' : this._isFirstOfVisible(i),
				'lastOfVisible'  : this._isLastOfVisible(i),
				'data'           : JSON.decode(el.getAttribute('data-element') || null)
			});
			if (index == i) element = el;
		}.bind(this));

		// Select event object
		var event = {
			'element'        : element,
			'index'          : index,
			'firstOfVisible' : this._isFirstOfVisible(index),
			'lastOfVisible'  : this._isLastOfVisible(index),
			'data'           : JSON.decode(element.getAttribute('data-element'))
		};

		// Fire select event
		element.fireEvent('select', event);

		// Slider select event
		this.fireEvent('select', event);

		// Scrolling to element
		if (!this._isVisible(index))
			this.scrollTo(index);
	},

	/**
	 * Events handlers
	 */
	_setEventHandlers: function()
	{
		// Buttons clicks
		this.options.elPrev.addEvent('click', function(e){
			e.stop();
			this.scroll(-1);
		}.bind(this));
		this.options.elNext.addEvent('click', function(e){
			e.stop();
			this.scroll(1);
		}.bind(this));

		// Frames select
		if (this.options.selectable)
		{
			this._frames.each(function(frame, index){
				frame.addEvent('click', function(e){
					e.stop();
					this.select(index);
				}.bind(this));
			}.bind(this));
		}

		// Mouse wheel event
		if (this.options.mouseWheelEnabled)
		{
			this.options.elContainer.addEvent('mousewheel', function(e){
				e.stop();
				this.scroll(-e.wheel);
			}.bind(this));
		}
	},
	
	/**
	 * Is fist slide
	 * @return {bool}
	 */
	_isFirst: function()
	{
		return this.position == 0;
	},
	
	/**
	 * Is last slide
	 * @return {bool}
	 */
	_isLast: function()
	{
		var p = this.options.framesCount - this.options.framesVisible;
		return p < 0 || this.position == p;
	},
	
	/**
	 * Button availability check
	 */
	_checkButtons: function()
	{
		var c = this.options.buttonDisabledClass;
		if (c !== null)
		{
			var m = ['addClass', 'removeClass'];
			this.options.elPrev[m[Number(!this._isFirst())]](c);
			this.options.elNext[m[Number(!this._isLast())]](c);
		}
	},
	
	/**
	 * Checks if frame[index] is first of visible frames
	 * @param  {int} index
	 * @return {bool}
	 */
	_isFirstOfVisible: function(index)
	{
		return index == this.position;
	},
	
	/**
	 * Checks if frame[index] is last of visible frames
	 * @param  {int} index
	 * @return {bool}
	 */
	_isLastOfVisible: function(index)
	{
		return index == this.position + this.options.framesVisible - 1;
	},
	
	/**
	 * Checks if frame[index] is visible
	 * @param  {int} index
	 * @return {bool}
	 */
	_isVisible: function(index)
	{
		return index >= this.position && index < this.position + this.options.framesVisible;
	}
});