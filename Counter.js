/**
 * Counter
 * 
 */

var NS = NS || {};
NS.Counter = new Class({
	Implements: Events,

	/**
	 * Destination timestamp in ms
	 * @var {Number}
	 */
	_d: 0,

	/**
	 * Timer
	 * @var {Number}
	 */
	_timer: null,

	/**
	 * Constructor
	 * @param {Number|String|Date}
	 */
	initialize: function(time)
	{
		switch ($type(time))
		{
			case 'date':
				time = time.getTime();
				break;
			case 'string':
				time = Date.parse(time).getTime() || 0;
				break;
			default:
				time = ~~time;
		}
		this._d = time;
	},

	/**
	 * Start
	 *
	 */
	start: function()
	{
		this._timer = this._tick.periodical(50, this);
	},

	/**
	 * Stop
	 *
	 */
	stop: function()
	{
		$clear(this._timer);
	},

	/**
	 * Handle tick
	 *
	 */
	_tick: function()
	{
		var diff = this._d - new Date().getTime();

		var _days = Math.floor(diff/86400000),
			_daysMs = _days*86400000,
			_hours = Math.floor((diff-_daysMs)/3600000),
			_hoursMs = _hours*3600000,
			_minutes = Math.floor((diff-_daysMs-_hoursMs)/60000),
			_minutesMs = _minutes*60000,
			_seconds = Math.floor((diff-_daysMs-_hoursMs-_minutesMs)/1000),
			_mseconds = diff-_daysMs-_hoursMs-_minutesMs-_seconds*1000+Math.round(Math.random()*5);

		this.fireEvent('tick', {
			days: _days,
			hours: _hours,
			minutes: _minutes,
			seconds: _seconds,
			mseconds: _mseconds
		});
	}
});