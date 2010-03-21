/**
 * Timer
 *
 */
ns.Timer = new Class
({
	Implements: [Options, Events],
	options: {
		'delay': 50
	},

	/**
	 * Таймер
	 *
	 */
	_timer: null,

	/**
	 * Семафор
	 *
	 */
	_semaphore: 0,

	/**
	 * Инициализация
	 * 
	 */
	initialize: function(options)
	{
		this.setOptions(options);
	},

	/**
	 * Старт таймера
	 *
	 */
	start: function()
	{
		this._semaphore++;
		if (this._semaphore == 1)
		{
			this.fireEvent('start');
			this._cycle();
		}
	},

	/**
	 * Остановка таймера
	 *
	 */
	stop: function()
	{
		if (this._semaphore == 1)
		{
			$clear(this._timer);
			this.fireEvent('stop');
		}
		this._semaphore--;

		if (this._semaphore < 0)
			this._semaphore = 0;
	},

	/**
	 * Очередной цикл таймера
	 *
	 */
	_cycle: function()
	{
		this.fireEvent('cycle');
		if (this._semaphore > 0)
			this._timer = this._cycle.delay(this.options.delay, this);
	}
});