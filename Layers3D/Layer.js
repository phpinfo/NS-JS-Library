/**
 * Layers 3D Layer
 * 
 */

var NS = NS || {};

NS.Layers3D.Layer = new Class({
	Implements: [Options],

	/**
	 * Опции
	 * @var {Hash}
	 */
	options:
	{
		'element': null,
		'property': 'left',
		'unit': '%',
		'z': 0
	},

	/**
	 * Элемент
	 * @var {Element}
	 */
	_el: null,

	/**
	 * Начальное смещение
	 * @var {Number}
	 */
	_ox: 0,

	/**
	 * Конструктор
	 * @param {Hash} options
	 */
	initialize: function(options)
	{
		this.setOptions(options);

		// Элемент
		this._el = $type(this.options.element == 'string') ? document.id(this.options.element) : this.options.element;

		// Начальное смещение
		var p = this._el.getStyle(this.options.property) || '';
		if (this.options.property == 'background-position') p = p.split(' ')[0];
		this._ox = ~~p.replace(this.options.unit, '');
	},

	/**
	 * Установка смещения
	 * @param {Number}
	 * @param {Number}
	 */
	setOffset: function(cx, cz)
	{
		var d = this.options.z >= 0 ? this.options.z : 0;
		var x = cx * this.options.z / (cz - d) + this._ox + this.options.unit;

		if (this.options.property == 'background-position')
			x += ' ' + $(this._el).getStyle('background-position').split(' ')[1];

		this._el.setStyle(this.options.property, x);
	}
});