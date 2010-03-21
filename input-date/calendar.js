/**
 * NS Calendar
 * 
 */
if (typeof(NS) == 'undefined') NS = {};
NS.Calendar = new Class(
{
	Implements: [Options, Events],
	
	/**
	 * Options
	 * @var {Hash}
	 */
	options: {
		/**
		 * Container CSS class
		 * @var {String}
		 */
		'containerClass': 'ns-calendar',
		
		/**
		 * Date
		 * @var {Date}
		 */
		'date': null,
		
		/**
		 * First day of week ('monday' or 'sunday')
		 * @var {String|null}
		 */
		'firstDay': null
	},
	
	/**
	 * Container
	 * @var {Element}
	 */
	container: null,
	
	/**
	 * Current date
	 * @var {Date}
	 */
	date: null,
	
	/**
	 * Months container
	 * @var {Element}
	 */
	_months: null,
	
	/**
	 * Years container
	 * @var {Element}
	 */
	_years: null,
	
	/**
	 * Days container
	 * @var {Element}
	 */
	_days: null,
	
	/**
	 * Constructor
	 * @param {Hash}
	 */
	initialize: function(options)
	{
		this.setOptions(options);

		// Current date
		this.date = this.options.date || new Date();

		// First day
		this.options.firstDay =
			(this.options.firstDay ||
			$H({ 'ru-RU-unicode': 'monday', 'ru-RU-alternate': 'monday' }).get(MooTools.lang.getCurrentLanguage()) ||
			'sunday').toLowerCase();

		// Elements
		this.container = new Element('div', {
			'class': this.options.containerClass
		}).adopt(
			this._months = this._getMonths(),
			this._years = this._getYears(),
			this._getWeekdays(),
			this._days = this._getDays()
		);
	},
	
	/**
	 * Set date
	 * @param {Date}
	 * @return {NS.Calendar}
	 */
	setDate: function(date)
	{
		this.date = date;

		this._months.selectedIndex = this.date.getMonth();
		this._years = this._getYears(this.date.getFullYear()).replaces(this._years);
		this._days = this._getDays().replaces(this._days);		

		return this;
	},
	
	/**
	 * Generates months select
	 * @param {int|null} selected
	 * @return {Element}
	 */
	_getMonths: function(selected)
	{
		// Selected month
		selected = selected || this.date.getMonth();

		// Months element
		var months = new Element('select', {
			'class': 'ns-calendar-months',
			'events': {
				'change': function(e) {
					this.date.setMonth(e.target.options[e.target.selectedIndex].value);
					this._days = this._getDays().replaces(this._days);
				}.bind(this)
			}
		});
		
		// Options
		var option;
		for (var m = 0; m < 12; m++)
		{
			option = new Option();
			option.text = MooTools.lang.get('Date', 'months')[m];
			option.value = m;

			if (m == selected) option.selected = 'selected';

			try
			{
				months.add(option, null);
			}
			catch(e)
			{
				months.add(option);
			}
		}

		return months;
	},
	
	/**
	 * Generates years select
	 * @param {int|null} selected
	 * @return {Element}
	 */
	_getYears: function(selected)
	{
		// Selected month
		selected = selected || this.date.getFullYear();

		// Years element
		var years = new Element('select', {
			'class': 'ns-calendar-years',
			'events': {
				'change': function(e) {
					this.date.setFullYear(e.target.options[e.target.selectedIndex].value);
					this._days = this._getDays().replaces(this._days);
				}.bind(this)
			}
		});
		
		// Options
		var option;
		for (var m = selected - 5; m <= selected + 5; m++)
		{
			option = new Option();
			option.text = m;
			option.value = m;

			try
			{
				years.add(option, null);
			}
			catch(e)
			{
				years.add(option);
			}
		}
		years.selectedIndex = 5;

		return years;
	},
	
	/**
	 * Generates weekdays line
	 * @return {Element}
	 */
	_getWeekdays: function()
	{
		// Days of week (first letters)
		var days = $A(MooTools.lang.get('Date', 'days').map(function(day){ return day.substring(0, 1); }));
		var weekend = [0, 6];
		if (this.options.firstDay == 'monday')
		{
			days.push(days.shift());
			weekend = [5, 6];
		}

		var weekdays = new Element('ul', {
			'class': 'ns-calendar-weekdays'
		});

		// Items to adopt
		var items = [];
		
		// Elements
		for (var i = 0; i < 7; i++)
		{
			items.push(new Element('li', {
				'class': 'ns-calendar-weekday' + (weekend.contains(i) ? ' ns-calendar-weekday-holiday' : ''),
				'text': days[i]
			}));
		}

		return weekdays.adopt(items);
	},
	
	/**
	 * Generates days grid
	 * @return {Element}
	 */
	_getDays: function()
	{
		var days = new Element('ul', {
			'class': 'ns-calendar-days'
		});

		// First day of current month
		var cDate = new Date(this.date);
		cDate.setDate(1);

		// Items to adopt
		var items = [];

		// Placeholders before
		var placeholders = cDate.getDay() - (this.options.firstDay == 'monday' ? 1 : 0);
		if (placeholders < 0) placeholders = 6;
		for (var i = 0; i < placeholders; i++)
		{
			items.push(new Element('li', {
				'class': 'ns-calendar-day-placeholder'
			}));
		}

		// Days
		while (cDate.getMonth() == this.date.getMonth())
		{
			var day = cDate.getDate();
			items.push(new Element('li', {
				'class': 'ns-calendar-day'
					+ ([0, 6].contains(cDate.getDay()) ? ' ns-calendar-day-holiday' : '')
					+ (this.date.getDate() == day ? ' ns-calendar-day-selected' : ''),
				'text': day,
				'events': {
					'mouseover': function() { this.addClass('ns-calendar-day-hover'); },
					'mouseout': function() { this.removeClass('ns-calendar-day-hover'); },
					'click': function(e){
						this.date.setDate(e.target.innerHTML);
						this.fireEvent('select', { 'target': this });
					}.bind(this)
				}
			}));
			cDate.setDate(day + 1);
		}

		// Inserting items
		days.adopt(items);

		return days;
	}
});