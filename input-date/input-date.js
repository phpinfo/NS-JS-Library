/**
 * Input date
 * 
 */

/**

requires: More/Element.Measure, More/Date (parse, isValid)

 */

if (typeof(NS) == 'undefined') NS = {};
NS.InputDate = {
	/**
	 * Calendar
	 * @var {NS.Calendar}
	 */
	_calendar: null,

	/**
	 * Opener
	 * @var {Element}
	 */
	_opener: null,

	/**
	 * Calendar creation
	 * @param {Hash|null} options
	 * @return {Element}
	 */
	getCalendar: function(options){
		if (NS.InputDate._calendar === null)
		{
			NS.InputDate._calendar = new NS.Calendar(options)
				.addEvent('select', function(e){
					NS.InputDate._opener.set('value', e.target.date.format('%x'));
					NS.InputDate._opener.fireEvent('change');
					e.target.container.fade('hide');
				});

			NS.InputDate._calendar.container
				.fade('hide')
				.inject($(document.body))
				.addEvent('outsideClick', function(e){
					if (e.target != NS.InputDate._opener)
						this.fade('hide');
				});
		}
		return NS.InputDate._calendar;
	},
	
	/**
	 * Retrieves Date object from input's value
	 * @param {Element}
	 * @return {Date}
	 */
	getDate: function(element)
	{
		var date = Date.parse(element.get('value'));
		return date && date.isValid() ? date : new Date();
	}
}

/**
 * Implementing element method
 * @param {Hash} options
 */
Element.implement('setTypeDate', function(options)
{
	// Checking browser support
	if (new Element('input', { 'type': 'date' }).get('type') == 'date') return;
	if (this.getAttribute('type') != 'date') return;

	// Classes
	this.addClass('ns-input-date');

	// Creating calendar
	var calendar = NS.InputDate.getCalendar(options).setDate(NS.InputDate.getDate(this));

	// Input element dimensions
	var dimensions = this.getDimensions();

	// Focus event handler
	this.addEvent('focus', function(){
		// Date
		calendar.setDate(NS.InputDate.getDate(this));

		// Moving element
		var c = this.getCoordinates();
		calendar.container
			.setStyle('left', c.left + 'px')
			.setStyle('top', c.top + dimensions.height + 'px')
			.fade('show');
		
		// Opener
		NS.InputDate._opener = this;
		
		// Scroll
		//var scroll = $(window).getScroll();
		//$(window).scrollTo(scroll.x, scroll.y + calendar.container.getHeight());
	});
});

/**
 * Implementing elements method
 * @param {Hash} options
 */
Elements.implement('setTypeDate', function(options)
{
	for (var i = 0; i < this.length; i++)
		this[i].setTypeDate(options);
});
