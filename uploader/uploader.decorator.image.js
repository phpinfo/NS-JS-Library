/**
 * NS Uploader image decorator
 * 
 */
ns.Uploader.Decorator.Image = new Class(
{
	Extends: ns.Uploader.Decorator,

	/**
	 * Контейнер
	 * @var {Element}
	 */
	_container: null,

	/**
	 * Индикатор загрузки
	 * @var {Element}
	 */
	_loader: null,

	/**
	 * Эффект
	 * @var {Fx.Slide}
	 */
	_fx: null,

	/**
	 * Выполнение декоратора
	 * @param {ns.Uploader}
	 */
	decorate: function(uploader)
	{
		// Контейнер
		this._container = this.getContainer().inject(uploader._element, 'top');

		// Индикатор загрузки
		this._loader = new Element('div', {
			'class': 'loader'
		}).inject(this._container).fade('hide');

		// Эффект
		this._fx = new Fx.Slide(this._container, { 'duration': 500 });
		if (uploader.options.value)
			this._container.setStyle('background-image', 'url("' + uploader.options.dir + uploader.options.value.replace('%s', 'a') + '")');
		else
			this._fx.hide();
	},

	/**
	 * Обработчик события начала загрузки файла
	 * @param {ns.Uploader}
	 */
	fileStartHandler: function(uploader)
	{
		this._container.setStyle('background-image', 'none');
		this._loader.fade('in');
	},

	/**
	 * Обработчик события окончания загрузки файла
	 * @param {ns.Uploader}
	 * @param {ns.Uploader.File}
	 */
	fileCompleteHandler: function(uploader, file)
	{
		// Данные от сервера
		var data = JSON.decode(file.response.text, true);
		if (data !== null && data.error == '' && data.value != '')
		{
			// Установка изображения
			var img = new Image();
			img.src = uploader.options.dir + data.value.replace('%s', 'a');
			img.onload = function(){
				this._fx.slideIn();
				this._loader.fade('out');
				this._container.setStyle.delay(500, this._container, ['background-image', 'url("' + img.src + '")']);
			}.bind(this);
		}
	},

	/**
	 * Обработчик события удаления файла
	 * @param {ns.Uploader}
	 */
	fileRemoveHandler: function(uploader)
	{
		this._container.setStyle('background-image', 'none');
	}
});