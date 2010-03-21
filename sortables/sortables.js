/**
 * NS Sortables
 * 
 */
ns.Sortables = new Class(
{
	Implements: [Options, Events],

	/**
	 * Опции
	 *
	 * @var {Hash}
	 */
	options:
	{
		/**
		 * Элементы для Mootools::Sortables
		 *
		 * @var {string}
		 */
		'element' : null
	},

	/**
	 * Sortables
	 *
	 * @var {Sortables}
	 */
	_sortables: null,

	/**
	 * Признак блокировки
	 *
	 * @var {bool}
	 */
	_locked: false,

	/**
	 * Элемент сортировки
	 *
	 * @var {Element}
	 */
	_element: null,

	/**
	 * Инициализация
	 *
	 * @param {Hash}
	 */
	initialize: function(options)
	{
		this.setOptions(options);

		// Добавление оформления
		this._element = $$(this.options.element)[0];
		this._element.addClass('ns-sortables');

		// Настройка Mootools::Sortables
		this._sortables = new Sortables(this.options.element);
		this._sortables.addEvent('complete', function(element){
			var id = this._filterId(element);
			var ord = this._sortables.serialize(0, this._filterId.bind(this)).indexOf(id);
			this._refresh();
			this.fireEvent('complete', [id, ord, this]);
		}.bind(this));
	},

	/**
	 * Блокировка от сортировки
	 *
	 */
	lock: function()
	{
		this._locked = true;
		this._sortables.detach();
		this._element.addClass('disabled');
	},

	/**
	 * Разблокировка
	 *
	 */
	unlock: function()
	{
		this._locked = false;
		this._sortables.attach();
		this._element.removeClass('disabled');
	},

	/**
	 * Фильтрация идентификатора строки
	 *
	 * @param  {Element}
	 * @return string
	 */
	_filterId: function(element)
	{
		return element.getAttribute('data-id');
	},

	/**
	 * Обновление
	 *
	 */
	_refresh: function()
	{
		if (this._element.tagName.toLowerCase() == 'tbody')
		{
			this._element.getElements('tr').each(function(item, index){
				item.removeClass('even');
				item.removeClass('odd');
				item.addClass(index % 2 == 0 ? 'even' : 'odd');
			});
		}
	}
});
