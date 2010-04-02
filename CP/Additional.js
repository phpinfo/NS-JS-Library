/**
 * Additional form fields
 * 
 */

var NS = NS || {};
NS.CP = NS.CP || {};

NS.CP.Additional = new Class({
	/**
	 * Конструктор
	 *
	 * @param {Element|String}
	 * @param {String}
	 */
	initialize: function(element, className)
	{
		if ($type(element) == 'string')
			element = document.id(element);

		var elements = [];
		$$('.'+className).each(function(el){
			var dd = el.getParent('dd').setStyle('display', 'none');
			var dt = dd.getPrevious('dt').setStyle('display', 'none');
			elements.push(dd);
			elements.push(dt);
		});

		element.addEvent('click', function(event){
			event.stop();
			elements.each(function(el){
				el.setStyle('display', el.getStyle('display') == 'none' ? 'block' : 'none');
			});
			var m = element.hasClass('open') ? 'removeClass' : 'addClass';
			element[m]('open');
		});
	}
});