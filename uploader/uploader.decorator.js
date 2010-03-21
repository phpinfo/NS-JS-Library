/**
 * NS Uploader decorator
 * 
 */
ns.Uploader.Decorator = new Class(
{
	/**
	 * Тип декоратора
	 * @var {String}
	 */
	_type: null,
	
	/**
	 * Возможность мультизагрузки
	 * @var {bool}
	 */
	_multiple: null,

	/**
	 * Инициализация
	 *
	 * @param {String} type
	 * @param {bool}   multiple
	 */
	initialize: function(type, multiple)
	{
		this._type = type;
		this._multiple = multiple;
	},

	/**
	 * Выполнение декоратора
	 * @param {ns.Uploader}
	 */
	decorate: function(uploader){},

	/**
	 * Обработчик события начала загрузки файла
	 * @param {ns.Uploader}
	 */
	fileStartHandler: function(uploader){},

	/**
	 * Обработчик события окончания загрузки файла
	 * @param {ns.Uploader.File}
	 */
	fileCompleteHandler: function(file){},

	/**
	 * Обработчик события удаления файла
	 * @param {ns.Uploader}
	 */
	fileRemoveHandler: function(uploader){},

	/**
	 * Получение контейнера
	 * @return {Element}
	 */
	getContainer: function()
	{
		return new Element('div', {
			'class': 'decorator ' + 'type-' + this._type.toLowerCase() + ' type-' + (this._multiple ? 'multiple' : 'single')
		});
	}
});

/**
 * Фабрика декораций
 *
 * @param  {String} type
 * @param  {bool}   multiple
 * @return {ns.Uploader.Decorator}
 */
ns.Uploader.Decorator.factory = function(type, multiple)
{
	eval('var c = ns.Uploader.Decorator.' + type + (multiple ? 'Multiple' : ''));
	if (typeof(c) != 'undefined')
		return new c(type, multiple);
	return null;
}