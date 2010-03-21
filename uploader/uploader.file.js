/**
 * NS Uploader file
 * 
 */
ns.Uploader.File = new Class(
{
	Extends: Swiff.Uploader.File,

	render: function()
	{
		if (this.invalid)
		{
			if (this.validationError)
			{
				var msg = MooTools.lang.get('FancyUpload', 'validationErrors')[this.validationError] || this.validationError;
				this.validationErrorMessage = msg.substitute({
					name: this.name,
					size: Swiff.Uploader.formatUnit(this.size, 'b'),
					fileSizeMin: Swiff.Uploader.formatUnit(this.base.options.fileSizeMin || 0, 'b'),
					fileSizeMax: Swiff.Uploader.formatUnit(this.base.options.fileSizeMax || 0, 'b'),
					fileListMax: this.base.options.fileListMax || 0,
					fileListSizeMax: Swiff.Uploader.formatUnit(this.base.options.fileListSizeMax || 0, 'b')
				});
			}
			this.remove();
			return null;
		}

		// Назначение событий
		this.addEvents({
			'open': this.onOpen,
			'remove': this.onRemove,
			'requeue': this.onRequeue,
			'progress': this.onProgress,
			'stop': this.onStop,
			'complete': this.onComplete,
			'error': this.onError
		});

		// Элементы интерфейса
		this.ui = {};

		// Контейнер файла
		this.ui.element = new Element('li');

		// Блок с названием файла
		this.ui.title = new Element('div', {
			'class': 'filename ' + this.extension,
			'text' : this.name
		});

		// Кнопка отмены
		this.ui.cancel = new Element('div', {
			'class': 'cancel'
		}).addEvent('click', function() {
			this.remove();
			return false;
		}.bind(this));

		// Прогрессбар
		this.ui.progress = new Element('div', {
			'class': 'status'
		});

		// Добавление элементов в список
		this.ui.element.adopt(
			this.ui.title,
			this.ui.cancel,
			this.ui.progress
		).inject(this.base.list).highlight();

		this.base.reposition();

		return this.parent();
	},

	onOpen: function() {
		this.ui.title.addClass('disabled');
		this.ui.progress.set(0);
	},

	onRemove: function() {
		this.ui = this.ui.element.destroy();
	},

	onProgress: function() {
		this.ui.progress.setStyle('width', this.progress.percentLoaded + '%');
	},

	onStop: function() {
		this.remove();
	},

	onComplete: function()
	{
		this.ui.title.removeClass('disabled');
		this.ui.progress.fade('out');

		if (this.response.error) {
			var msg = MooTools.lang.get('FancyUpload', 'errors')[this.response.error] || '{error} #{code}';
			this.errorMessage = msg.substitute($extend({name: this.name}, this.response));

			this.base.fireEvent('fileError', [this, this.response, this.errorMessage]);
			this.fireEvent('error', [this, this.response, this.errorMessage]);
			return;
		}

		var response = this.response.text || '';
		this.base.fireEvent('fileSuccess', [this, response]);
	},

	onError: function() {
		this.ui.element.addClass('file-failed');
	}


});

//Avoiding MooTools.lang dependency
(function() {

	var phrases = {
		'fileName': '{name}',
		'cancel': 'Cancel',
		'cancelTitle': 'Click to cancel and remove this entry.',
		'validationErrors': {
			'duplicate': 'File <em>{name}</em> is already added, duplicates are not allowed.',
			'sizeLimitMin': 'File <em>{name}</em> (<em>{size}</em>) is too small, the minimal file size is {fileSizeMin}.',
			'sizeLimitMax': 'File <em>{name}</em> (<em>{size}</em>) is too big, the maximal file size is <em>{fileSizeMax}</em>.',
			'fileListMax': 'File <em>{name}</em> could not be added, amount of <em>{fileListMax} files</em> exceeded.',
			'fileListSizeMax': 'File <em>{name}</em> (<em>{size}</em>) is too big, overall filesize of <em>{fileListSizeMax}</em> exceeded.'
		},
		'errors': {
			'httpStatus': 'Server returned HTTP-Status #{code}',
			'securityError': 'Security error occured ({text})',
			'ioError': 'Error caused a send or load operation to fail ({text})'
		},
		'linuxWarning': 'Warning: Due to a misbehaviour of Adobe Flash Player on Linux,\nthe browser will probably freeze during the upload process.\nDo you want to start the upload anyway?'
	};

	if (MooTools.lang) {
		MooTools.lang.set('en-US', 'FancyUpload', phrases);
	} else {
		MooTools.lang = {
			get: function(from, key) {
				return phrases[key];
			}
		};
	}

})();