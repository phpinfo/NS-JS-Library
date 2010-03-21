/**
 * NS Uploader
 * 
 */
ns.Uploader = new Class(
{
	Implements: [Options, Events],

	/**
	 * Опции
	 * @var {Hash}
	 */
	options:
	{
		/**
		 * Имя загрузчика
		 * @var {String}
		 */
		'name': null,

		/**
		 * Значение
		 * @var {String}
		 */
		'value': null,

		/**
		 * URL обработчика
		 * @var {String}
		 */
		'url': null,

		/**
		 * Путь к файлам (например, изображениям)
		 * @var {String}
		 */
		'dir': null,

		/**
		 * Элемент для загрузчика
		 * @var {String}
		 */
		'element': null,

		/*
		 * Тип загрузчика
		 * @var {String}
		 */
		'type': 'file',

		/**
		 * Возможность мультизагрузки
		 * @var {bool}
		 */
		'multiple': true,

		/**
		 * Маска файлов
		 * @var {Hash}
		 */
		'typeFilter': null,

		/**
		 * Текст ссылки открытия/добавления файлов
		 * @var {String}
		 */
		'browseText': 'Browse file(s)',
		
		/**
		 * CSS-класс ссылки добавления файла
		 * @var {String}
		 */
		'browseClass': 'browse'
	},

	/**
	 * Имя загрузчика
	 * @var {String}
	 */
	_name: null,

	/**
	 * Элемент для загрузчика
	 * @var {Element}
	 */
	_element: null,

	/**
	 * Список внутри загрузчика
	 * @var {Element}
	 */
	_list: null,

	/**
	 * Кнопка вызова диалога открытия файлов
	 * @var {Element}
	 */
	_browse: null,

	/**
	 * Поле со значением
	 * @var {Element}
	 */
	_value: null,

	/**
	 * Загрузчик Fancy Uploader
	 * @var {FancyUpload3.Attach}
	 */
	_fu: null,

	/**
	 * Декоратор
	 * @var {ns.Uploader.Decorator}
	 */
	_decorator: null,

	/**
	 * Инициализация
	 * @param {Hash}
	 */
	initialize: function(options)
	{
		this.setOptions(options);

		// Имя
		this._name = this.options.name;
		if (this._name === null)
			throw("ns.Uploader: Name wasn't set");

		// Инициализация элементов
		this._initElements();

		// Загрузчик Fancy Uploader
		this._initFU();

		// Декоратор
		this._decorator = ns.Uploader.Decorator.factory(this.options.type, this.options.multiple);
		if (this._decorator !== null)
		{
			this._decorator.decorate(this);

			// События Fancy Uploader
			this._fu.addEvent('fileStart', function(){
				this._decorator.fileStartHandler(this);
			}.bind(this));

			this._fu.addEvent('fileComplete', function(file){
				this._decorator.fileCompleteHandler(this, file);
			}.bind(this));

			this._fu.addEvent('fileRemove', function(){
				this._decorator.fileRemoveHandler(this);
			}.bind(this));
		}
	},

	/**
	 * Инициализация элементов
	 */
	_initElements: function()
	{
		// Элемент-контейнер
		this._element = $(this.options.element);
		if (this._element === null)
			throw('ns.Uploader: Overall element "#' + this.options.element + "\" doesn't exist or wasn't set");
		this._element.addClass('ns-uploader');

		// Список
		this._list = this._element.getElement('ul');
		if (this._list === null)
		{
			// Если элемент списка отсутствует, он создается динамически
			this._list = new Element('ul');
			this._list.inject(this._element, 'top');
		}

		// Кнопка добавления файлов
		this._browse = $(this.options.browseElement) || this._element.getElement('a.browse');
		if (this._browse === null)
		{
			// Если кнопка открытия отсутствует, она создается динамически
			this._browse = new Element('a', {
				'href': '#',
				'class': this.options.browseClass,
				'text': this.options.browseText
			})
			.inject(this._element)
			.addEvent('click', function(){
				return false;
			}.bind(this));
		}

		// Поле со значением
		this._value = $(this._name);
		if (this._value === null)
		{
			this._value = new Element('input', {
				'name': this._name,
				'type': 'hidden'
			}).inject(this._element);
		}
		this._value.value = this.options.value;
	},

	/**
	 * Настройка Fancy Uploader
	 */
	_initFU: function()
	{
		this._fu = new FancyUpload3.Attach(this._list, this._browse, {
			'path'      : '/js/ns/uploader/Swiff.Uploader.swf',
			'fileClass' : ns.Uploader.File,

			'multiple'  : this.options.multiple,
			'typeFilter': this.options.typeFilter,

			'url'       : this.options.url,
			
			'queued'    : 1
		});

		if (!this.options.multiple)
		{
			this._fu.addEvent('browse', function(){
				this._fu.remove();
			}.bind(this));
		}

		this._fu.addEvent('fileComplete', function(file)
		{
			// Обработка ошибок
			var data = JSON.decode(file.response.text, true);
			if (data && data.value)
				this._value.value = (this._value.value && this.options.multiple ? this._value.value + ';' : '') + data.value;
			else
				alert(data && data.error ? data.error : 'Произошла ошибка');
		}.bind(this));

		this._fu.addEvent('fileRemove', function(){
			this._value.value = '';
		}.bind(this));
	}
});
