/**
 * NS GMaps button
 * 
 */
NS = NS || {};
NS.GMaps = NS.GMaps || {};
NS.GMaps.Button = new Class(
{
	Implements: [Options, Events],

	/**
	 * Опции
	 *
	 * @var {Hash}
	 */
	options:
	{
		// Текст
		'text': 'Button text',

		'toggle': false,
		'toggleText': null
	},
	
	/**
	 * Элемент
	 *
	 * @var {Element}
	 */
	element: null,
	
	/**
	 * Toggle state
	 *
	 * @var {Boolean}
	 */
	toggleState: false,

	/**
	 * Инициализация
	 *
	 * @param {Hash}
	 */
	initialize: function(options)
	{
		this.setOptions(options);

		this.element = new Element('div', {
			'html': this.options.text,
			'class': 'ns-button',
			'styles': {
				'margin': '5px'
			},
			'events': {
				'click': function(){
					this.fireEvent('click')
					this.toggle();
				}.bind(this)
			}
		});
	},
	
	/**
	 * Установить текст
	 *
	 * @param {String}
	 */
	setText: function(text)
	{
		this.element.innerHTML = text;
	},
	
	toggle: function()
	{
		if (this.options.toggle)
		{
			this.toggleState = !this.toggleState;

			if (this.options.toggleText !== null)
				this.setText(this.toggleState ? this.options.toggleText : this.options.text);

			this.fireEvent('toggle');
		}
	}
});
