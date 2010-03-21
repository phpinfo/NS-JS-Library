/**
 * NS Expandable
 * 
 */
ns.Expandable = new Class({
	Implements: [Options],

	options:
	{
		'header': null,
		'block': null,

		// Анимация маркера заголовка
		'useHeaderGifAnimation': false,
		// Предзагрузка изображений
		'usePreLoader': false
	},

	/**
	 * Эффект
	 *
	 */
	fx: null,

	/**
	 * Предзагрузка изображений
	 *
	 */
	_preLoadedImages: [],

	/**
	 * Инициализация
	 * 
	 */
	initialize: function(options)
	{
		this.setOptions(options);

		// Элементы
		this.options.header = $(this.options.header);
		this.options.block = $(this.options.block);	
		if (!this.options.header || !this.options.block) return;

		// Настройка анимации
		this.fx = new Fx.Slide(this.options.block, { 'duration': 'short' }).hide();

		// Событие щелчка на заголовке
		this.options.header.addEvent('click', function()
		{
			if (this.fx.open)
				this.collapse();
			else
				this.expand();
		}.bind(this));

		// Предзагрузка изображений
		if (this.options.usePreLoader)
		{
			this._preLoad();
		}
	},

	/**
	 * Раскрытие блока
	 *
	 */
	expand: function()
	{
		// Изменение классов заголовка
		this.options.header.addClass('expanded' + (this.options.useHeaderGifAnimation ? '-ani' : ''));
		this.options.header.removeClass('collapsed');
		this.options.header.removeClass('collapsed-ani');

		// Анимация блока
		this.fx.slideIn();
	},

	/**
	 * Скрытие блока
	 * 
	 */
	collapse: function()
	{
		// Изменение классов заголовка
		this.options.header.addClass('collapsed' + (this.options.useHeaderGifAnimation ? '-ani' : ''));
		this.options.header.removeClass('expanded');
		this.options.header.removeClass('expanded-ani');

		// Анимация блока
		this.fx.slideOut();
	},

	/**
	 * Предзагрузка изображений
	 *
	 */
	_preLoad: function()
	{
		this._preLoadedImages = [];

		this._preLoadedImages[0] = new Image();
		this._preLoadedImages[0].src = 'expanded.png';

		this._preLoadedImages[1] = new Image();
		this._preLoadedImages[1].src = 'collapsed.png';

		if (this.options.useHeaderGifAnimation)
		{
			this._preLoadedImages[2] = new Image();
			this._preLoadedImages[2].src = 'expanded-ani.gif';

			this._preLoadedImages[3] = new Image();
			this._preLoadedImages[3].src = 'collapsed-ani.gif';
		}
	}
});
