/**
 * Element ghost
 * 
 */

var NS = NS || {};

NS.Ghost = new Class({

	Implements: [Options, Chain],

	/**
	 * Options
	 * @var {Hash}
	 */
	options:
	{
	},

	/**
	 * Element clone
	 * @var {Element}
	 */
	_clone: null,

	/**
	 * Effect
	 * @var {Fx}
	 */
	_fx: null,

	/**
	 * Default dimensions
	 * @var {Object}
	 */
	_d: {},

	/**
	 * Constructor
	 * @param {Element}
	 * @param {Hash} options
	 */
	initialize: function(element, options)
	{
		this.setOptions(options);

		var position = element.getPosition();

		this._clone = element.clone().setStyles({
			position: 'absolute',
			left: position.x + 'px',
			top: position.y + 'px',
			opacity: 0,
			margin: 0
		}).inject($$('body')[0]);

		this._d = $merge(this._clone.getDimensions(), this._clone.getPosition());

		this._fx = new Fx.Morph(this._clone);
	},

	/**
	 * Fly effect
	 * @param {Object} options in format {x: <x>, y: <y>, width: <width>, height: <height>, opacity: <opacity>}
	 * @return Fx
	 */
	fly: function(options)
	{
		options = $merge(this._d, {opacity:1}, options);

		return this._fx.start({
			left: [this._d.x, options.x],
			top: [this._d.y, options.y],
			width: [this._d.width, options.width],
			height: [this._d.height, options.height],
			opacity: [1, options.opacity]
		});
	}
});