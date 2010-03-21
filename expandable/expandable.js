/**
 * NS Expandable
 * 
 */
ns.Expandable = new Class(
{
	Implements: [Options],

	/**
	 * Опции
	 *
	 * @var {Hash}
	 */
	options:
	{
		// Элементы
		'header'    : null,
		'block'     : null,

		// Имя куки
		'cookieName': 'ns-expandable'
	},

	/**
	 * Эффект
	 *
	 * @var {Fx.Slide}
	 */
	_fx: null,

	/**
	 * Спрайтовая анимация
	 *
	 * @var {ns.spriteAnimation}
	 */
	_animation: null,

	/**
	 * Инициализация
	 *
	 * @param {Hash}
	 */
	initialize: function(options)
	{
		this.setOptions(options);

		// Элементы
		this.options.header = $(this.options.header);
		this.options.block = $(this.options.block);	
		if (!this.options.header || !this.options.block) return;

		// Настройка анимации
		this._fx = new Fx.Slide(this.options.block, { 'duration': 200 });

		// Загрузка состояния
		this._loadState();

		// Событие щелчка на заголовке
		this.options.header.addEvent('click', function()
		{
			if (this._fx.open)
				this.collapse();
			else
				this.expand();
		}.bind(this));

		// Таймер (статический, в реализацию таймера входит механизм семафоров)
		if (typeof(ns.Expandable._timer) == 'undefined')
			ns.Expandable._timer = new ns.Timer();

		// Анимация
		this._animation = new ns.SpriteAnimation({
			'element': this.options.header,
			'spriteDimensions': [25, 25],
			'returnToStart': false,
			'speed': 2
		});
		ns.Expandable._timer.addEvent('cycle', function(){
			this._animation.cycle();
			this._animation.redraw();
		}.bind(this));

		this._animation.addEvent('finish', function(){
			ns.Expandable._timer.stop();
		}.bind(this));

		// Сохранение состояния при покидании страницы
		$(window).addEvent('beforeunload', this._saveState.bind(this));
	},

	/**
	 * Раскрытие блока
	 *
	 */
	expand: function()
	{
		// Изменение классов заголовка
		this._animation.options.rangeY = [0, 10];
		this._animation.start();
		ns.Expandable._timer.start();

		// Анимация блока
		this._fx.slideIn();
	},

	/**
	 * Скрытие блока
	 * 
	 */
	collapse: function()
	{
		// Изменение классов заголовка
		this._animation.options.rangeY = [10, 0];
		this._animation.start();
		ns.Expandable._timer.start();

		// Анимация блока
		this._fx.slideOut();
	},

	/**
	 * Сохранение состояния
	 *
	 */
	_saveState: function()
	{
		var state = this._getState();
		var node = this._getCookieNode();

		if (this._fx.open)
			state[node] = '';
		else
			state.erase(node);

		// Сохранение
		Cookie.write(this.options.cookieName, JSON.encode(state));
	},

	/**
	 * Загрузка состояния
	 *
	 */
	_loadState: function()
	{
		if (this._getState().has(this._getCookieNode()))
		{
			this._fx.show();
			this.options.header.removeClass('collapsed');
			this.options.header.addClass('expanded');
		}
		else
		{
			this._fx.hide();
			this.options.header.addClass('collapsed');
			this.options.header.removeClass('expanded');
		}
	},

	/**
	 * Получение состояния
	 *
	 * @return {Hash}
	 */
	_getState: function()
	{
		var res = Cookie.read(this.options.cookieName);
		return $H(res ? JSON.decode(res) : {});
	},

	/**
	 * Получение имени ветви записи в куках для текущей страницы
	 *
	 * @return {string}
	 */
	_getCookieNode: function()
	{
		return location.href.replace(new RegExp("http:|:|www\\.|\\?|\\/|=|\\.", 'g'), '') + '_' + this.options.header.id;
	}
});
