/**
 * Галерея изображений
 * 
 */

var NS = NS || {};
NS.Gallery = new Class({
	/**
	 * Конструктор
	 * @param {Element|String}
	 * @param {Array|String}
	 */
	initialize: function(image, previews)
	{
		// Элемент
		if ($type(image) == 'string')
			image = document.id(image);

		// Изображения-превью
		if ($type(previews) == 'string')
			previews = $$(previews);

		// Эффект
		var fx = new Fx.Tween(image, { duration: 200 });

		// События
		image.addEvent('load', function(){
			fx.start('opacity', 1);
		});
		previews.addEvent('click', function(event){
			event.stop();
			var href = this.get('href');
			if (image.get('src') == href) return;
			fx.start('opacity', 0).chain(function(){
				image.set('src', href);
			});
		});
	}
});