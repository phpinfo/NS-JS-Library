/**
 * FlipFlop elements toggler
 * 
 */

var NS = NS || {};

NS.FlipFlop = new Class({

	Implements: [Options, Events],

	/**
	 * Опции
	 * @var {Hash}
	 */
	options:
	{
		/**
		 * Активный элемент
		 * @var {Element}
		 */
		elAction: null,

		/**
		 * Скрываемый элемент
		 * @var {Element}
		 */
		elTarget: null,

		/**
		 * Длительность эффекта
		 * @var {Number}
		 */
		duration: 500,

		/**
		 * Начальное состояние
		 * @var {Bool}
		 */
		defaultState: true,

		/**
		 * Имя куки
		 * @var {String}
		 */
		cookieName: 'ns-flipflop'
	},

	/**
	 * Эффект
	 * @var Fx
	 */
	_fx: null,

	/**
	 * Конструктор
	 * @param {Hash} options
	 */
	initialize: function(options)
	{
		this.setOptions(options);

		// Эффект
		this._fx = new Fx.Slide(this.options.elTarget, {duration: this.options.duration});

		// Загрузка состояния
		this._loadState(this.options.defaultState, this.options.cookieName);

		// События
		this.options.elAction.addEvent('click', function(event){
			event.stop();
			this._fx.toggle().chain(function(){
				this._saveState(this._fx.open);
			}.bind(this));
		}.bind(this));
	},

	/**
	 * Сохранение в куки
	 * @param {Bool}
	 */
	_saveState: function(state)
	{
		var id = this.options.elTarget.get('id');
		if (id)
		{
			var cookie = $H(JSON.decode(Cookie.read(this.options.cookieName)) || {});
			cookie.set(id, ~~state);
			Cookie.write(this.options.cookieName, JSON.encode(cookie.getClean()), {
				domain: location.host,
				path: '/'
			});
		}
	},

	/**
	 * Загрузка состояния
	 * @param {Bool}
	 * @param {String}
	 */
	_loadState: function(defaultState, cookieName)
	{
		var id = this.options.elTarget.get('id');
		if (id)
		{
			var state = $H(JSON.decode(Cookie.read(cookieName)) || {}).get(id);
			state = $chk(state) ? !!state : defaultState;
			this._fx[state ? 'show' : 'hide']();
		}
	}
});