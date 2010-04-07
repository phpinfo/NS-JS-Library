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
	_destinationTimestamp: 0,

	/**
	 * Current timestamp in ms
	 * @var {Number}
	 */
	_currentTimestamp: 0,

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
		this._destinationTimestamp = time;
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
	 * Handle tick
	 *
	 */
	_tick: function()
	{
		var diff = this._destinationTimestamp - new Date().getTime();

		var _days = Math.floor(diff/86400000),
			_hours = Math.floor((diff-_days*86400000)/3600000),
			_minutes = Math.floor((diff-_days*86400000-_hours*3600000)/60000),
			_seconds = Math.floor((diff-_days*86400000-_hours*3600000-_minutes*60000)/1000),
			_mseconds = diff-_days*86400000-_hours*3600000-_minutes*60000-_seconds*1000;

		//console.log(diff);

		//$clear(this._timer);

		this.fireEvent('tick', {
			days: _days,
			hours: _hours,
			minutes: _minutes,
			seconds: _seconds,
			mseconds: _mseconds
		});
	}
});