/**
 * Color selector
 * 
 */

var NS = NS || {};

NS.ColorSelect = new Class({

	Implements: [Options, Events],

	/**
	 * Опции
	 * @var {Hash}
	 */
	options:
	{
		/**
		 * Элементы палитры
		 * @var {Elements}
		 */
		colors: [],

		/**
		 * Элемент Input
		 * @var {Element}
		 */
		input: null,

		/**
		 * Активный класс
		 * @var {String}
		 */
		activeClassName: 'active'
	},

	/**
	 * Конструктор
	 * @param {Hash} options
	 */
	initialize: function(options)
	{
		this.setOptions(options);

		this.options.colors.each(function(el){
			el.addEvent('click', function(event){
				event.stop();
				this.options.colors.each(function(c){ c.removeClass(this.options.activeClassName); }.bind(this));
				el.addClass(this.options.activeClassName);
				this.options.input.set('value', el.getStyle('background-color'));
			}.bind(this));
		}.bind(this));

		this.options.input.set('value', this.options.colors[0].getStyle('background-color'));
	}
});