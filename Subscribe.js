/**
 * Подписка на новости
 *
 */
var NS = NS || {};
NS.Subscribe = new Class({

	Implements: [Options],

	/**
	 * Опции
	 * @var {Hash}
	 */
	options:
	{	
		/**
		 * Форма
		 * @var {Element}
		 */
		'elForm': null,
		
		/**
		 * Поле ввода Email
		 * @var {Element}
		 */
		'elInput': null,
		
		/**
		 * Индикатор загрузки
		 * @var {Element}
		 */
		'elLoader': null,
		
		/**
		 * Сообщение
		 * @var {Element}
		 */
		'elMessage': null,

		/**
		 * Ошибка
		 * @var {Element}
		 */
		'elError': null,
		
		/**
		 * URL для запроса
		 * @var {String}
		 */
		'url': null
	},

	/**
	 * Конструктор
	 * @param {Hash} options
	 */
	initialize: function(options)
	{
		this.setOptions(options);
		
		this.options.elForm.addEvent('submit', function(e) {
			e.stop();
			if (this.options.elInput.value)
			{
				this.options.elForm.addClass('hidden');
				this.options.elLoader.removeClass('hidden');
				
				new Request.JSON({
					'url': this.options.url,
					'noCache': true,
					'onComplete': this._completeHandler.bind(this)
				}).post({'email': this.options.elInput.value});
			}
		}.bind(this));
	},
	
	/**
	 * Обработчик ответа сервера
	 * @param {Hash}
	 */
	_completeHandler: function(response)
	{
		var e = response ? (response.error ? response.error : '') : 'Произошла ошибка';

		if (e)
			this.options.elError.set('text', e).removeClass('hidden');
		else
			this.options.elMessage.set('text', 'Поздравляем, вы подписаны на новости!').removeClass('hidden');

		this.options.elLoader.addClass('hidden');

		(function(){
			this.options.elMessage.addClass('hidden');
			this.options.elError.addClass('hidden');
			this.options.elForm.removeClass('hidden');
			this.options.elInput.focus();
		}).bind(this).delay(2500);
	}
});

