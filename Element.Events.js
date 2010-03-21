Element.Events.set('outsideClick', {
	onAdd: function(arg) {
		$(document.body).addEvent('click', function(e){
			this.fireEvent('outsideClick', e);
		}.bind(this));
		this.addEvent('click', function(e){
			e.stopPropagation();
		})
	}
});