/**
 * Semaphore class
 *
 */
var NS = NS || {};
NS.Semaphore = new Class({

	/**
	 * Semaphore value
	 * @var {int}
	 */
	_s: 0,
	
	/**
	 * Setting enabled status
	 * @param {Bool}
	 */
	setEnabled: function(state)
	{
		// Default is true
		state = state === undefined || state === null || state;

		// True decrements semaphore
		this._s += 1 - 2 * Number(state);

		// Prevent negative value
		if (this._s < 0) this._s = 0;
	},

	/**
	 * Enable check
	 * @return {Bool}
	 */
	isEnabled: function()
	{
		return this._s == 0;
	},
	
	/**
	 * Enable
	 */
	enable: function()
	{
		this.setEnabled(true);
	},
	
	/**
	 * Disable
	 */
	disable: function()
	{
		this.setEnabled(false);
	}
});