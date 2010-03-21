/**
 * Date.Russian correction, alternate locale
 * 
 */

/**

requires: More/Date (parse, isValid) , More/Date.Russian, More/Lang

 */

(function(){
	// Retrieving current locale
	var currentLang = MooTools.lang.getCurrentLanguage();

	// Retrieving russian locale data
	MooTools.lang.setLanguage('ru-RU-unicode');
	var ru = MooTools.lang.get('Date');

	// Changing locale
	ru.shortDate = '%d.%m.%Y';

	// Storing as alternate locale
	MooTools.lang.set('ru-RU-alternate', 'Date', ru);
	
	// Restoring default locale
	MooTools.lang.setLanguage(currentLang);
})();
