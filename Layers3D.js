/**
 * Layers 3D
 * 
 */

var NS = NS || {};
NS.Layers3D = new Class({

	Implements: [Options],

	/**
	 * Опции
	 * @var {Hash}
	 */
	options:
	{
		'layers': [],
		'cz': 10
	},

	/**
	 * Слои
	 * @var {Array}
	 */
	_layers: [],

	/**
	 * Конструктор
	 * @param {Hash} options
	 */
	initialize: function(options)
	{
		this.setOptions(options);

		// Слои
		this.options.layers.each(function(layer){
			this._layers.push(new NS.Layers3D.Layer(layer));
		}.bind(this));
	},

	/**
	 * Установка смещения
	 * @param {Number}
	 */
	setOffset: function(value)
	{
		this._layers.each(function(layer){
			layer.setOffset(value, this.options.cz);
		}.bind(this));
	}
});