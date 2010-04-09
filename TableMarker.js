/**
 * Улучшение эргономики таблиц
 * 
 */

var NS = NS || {};
NS.TableMarker = new Class({
	/**
	 * Конструктор
	 * @param {Array|String}
	 */
	initialize: function(tables)
	{
		// Элемент
		if ($type(tables) == 'string')
			tables = $$(tables);

		// События
		var events = {
			'mouseenter': function() { this.addClass('marked'); },
			'mouseleave': function() { this.removeClass('marked'); }
		};

		tables.each(function(table){
			table.addEvents(events);
			table.getElements('tr').addEvents(events);
		});
	}
});