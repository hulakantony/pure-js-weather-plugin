
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.myWeather = factory();
  }
})( this, function() {
	'use strict'
	var set = new Set()
	let elem;
	const widgetHtml = 
	`<div class="weather-widget-wrap">
      <div class="weather-date-place-wrap">
        <p class="weather-day"></p>
        <p class="weather-date-wrap">
          <span class="weather-date"></span>
          <span class="weather-month"></span>
          <span class="weather-year"></span>
        </p>
        <p class="weather-place"></p>
        <div class="remember-location-wrap">
        	<label for="save">Remember Location</label>
       		<input type="checkbox" class="save-city" id="save">
      	</div>
      </div>
      <div class="weather-info-wrap">
        <div class="weather-info-img-wrap">
          <img src="" alt="" class="weather-icon">
          <p class="weather-info-descr"></p>
        </div>

        <div class="weather-temp-wind-wrap">
          <a class="metric-switcher weather-button" href="#"></a>
          <a class="get-my-location weather-button" href="#">ML</a>
          <a class="localization-switcher weather-button" href="#"></a>
          <p class="weather-temp"></p>
          <p class="weather-wind"></p>
        </div>          
      </div>
    </div>`;
    const cityInput = '<input type="text" class="get-city" placeholder="Type city name">';
	const pluginName = 'myWeather';
	const KEY = '1d116b536241d6598ce05b34c44408a9';
	var apiURL = 'http://api.openweathermap.org/data/2.5/weather?';
	var store = Object.assign({}, {
		position: {
			city: null,
			lon: null,
			lat: null,
			units: 'c'
		},
		lang: 'en',		
		detectLoc: true,		
	},  getState('tadam'));	
	/*--------------GET DATE FUNCTIONS---------------*/
	function getNameOfDay(today){
		var days  = ['Sunday','Monday','Tuesday','Wednesday', 'Thursday','Friday', 'Saturday'];
		return days[today];
	}
	function getNameOfMonth(todayMonth){
		var months = ['Jan.','Feb.','Mar.','Apr.','May','Jun','July','Aug.','Sept.','Oct.','Nov.','Dec.'];
		return months[todayMonth];
	}
	function getRusNameOfMonth(todayMonth){
		var months = ['Янв.','Фев.','Мар.','Апр.','Май','Июнь','Июль','Авг.','Сен.','Окт.','Ноя.','Дек.'];
		return months[todayMonth];
	}
	function getRusNameOfDay(today){
		var days  = ['Воскресение','Понедельник','Вторник','Среда', 'Четверг','Пятница', 'Суббота'];
		return days[today];
	}
	function formatDate(){
		var now = new Date();
		return {
			day: now.getDay(),
			month: now.getMonth(),
			date: now.getDate(),
			year: now.getFullYear()
		};
	}
	/*--------------EVENTS FUNCTIONS---------------*/

	function changeLang(e){
		e.preventDefault();
		if(this.innerHTML === 'RU'){
			apiURL += `lang=ru&q=${store.position.city}&appid=${KEY}`;
			this.innerHTML = 'EN';
			store.lang = 'ru';
			run();
			apiURL = 'http://api.openweathermap.org/data/2.5/weather?';
		} else {
			apiURL += `lang=en&q=${store.position.city}&appid=${KEY}`;
			this.innerHTML = 'RU';
			store.lang = 'en';
			run();
			apiURL = 'http://api.openweathermap.org/data/2.5/weather?';
		}
	}	
	function getMyLocationHandler(e){
		e.preventDefault();
		getCurrentLocation();
	}
	function changeTemp(e){
	    e.preventDefault();
		var target = e.target;					
		var currentTemp = elem.querySelector('.weather-temp').innerHTML;
		if(currentTemp.indexOf('C') !== -1){
			var temperature = Math.round((parseInt(currentTemp, 10)  * 1.8) + 32) + '°F';
			elem.querySelector('.weather-temp').innerHTML = temperature;
			target.innerHTML = 'C';
		} else {
			var temperature = Math.round((parseInt((currentTemp), 10) - 32) / 1.8)   + '°C';
			elem.querySelector('.weather-temp').innerHTML = temperature;
			target.innerHTML = 'F';
		}
	}
	function changeDetectLoc(e) {
      	store.detectLoc = e.target.checked;
      	saveState();
      	elem.querySelector('.remember-location-wrap').style.display = 'none';
    }
    function keyPressInput(e){
		if (e.which == 13) {								
			var city = elem.querySelector('.get-city').value.split(',')[0];				
			store.position.city = city;
			store.lang = 'en';										
			getNewWeather(city);									
		}
	}	
	function setCity() {	
		var savedPlace =  elem.querySelector('.weather-place').outerHTML;
		elem.querySelector('.weather-place').innerHTML = cityInput;
	    elem.querySelector('.save-city').checked = false;
	    elem.querySelector('.get-city').focus();

		addAutocomplete()
		
		elem.querySelector('.remember-location-wrap').style.display = 'block';	
    	elem.querySelector('.get-city').addEventListener('keypress', keyPressInput)		
	};

	/*--------------LOCAL STORAGE---------------*/

    function saveState() {
        var s = store;
        var newState = s.detectLoc ? {position: s.position} : {detectLoc: false};
        localStorage.setItem('tadam', JSON.stringify(newState));
    }
    function getState(key) {
      	return JSON.parse(localStorage.getItem(key));
    }
    
    /*--------------MAIN LOGIC---------------*/

    function execute(){	    			
		var set = store;
		var def = set.position;										
		if(!def.city){
			getCurrentLocation();	
			return;		
		}
		else{
			if(def.city != null) {		
				apiURL += `&q=${def.city}`;

			} else if(def.lat && def.lng) {			
				apiURL += `&lat=${def.lat}&lon=${def.lng}`;
			} 
				
			apiURL += `&appid=${KEY}`;			
			run();
		}
	}
	function getCurrentLocation(){
		var location = 'http://ip-api.com/json';	
		if(!elem.innerHTML || elem.querySelector('.localization-switcher').innerHTML === 'RU'){
			fetch(location).then(data => {
				return data.json();
			}).then(we => {						
				apiURL += `&lat=${we.lat}&lon=${we.lon}&appid=${KEY}`;
				run();
			})	
			apiURL = 'http://api.openweathermap.org/data/2.5/weather?';	
		} else {
			fetch(location).then(data => {
				return data.json();
			}).then(we => {						
				apiURL += `lang=ru&lat=${we.lat}&lon=${we.lon}&appid=${KEY}`;
				run();					
			})	
			apiURL = 'http://api.openweathermap.org/data/2.5/weather?';	
		}						
	}
	function run(){			
		fetch(apiURL).then((data)=>{				
			return data.json();
		}).then((we)=>{
			renderElements(parseData(we));
		});	
		apiURL = 'http://api.openweathermap.org/data/2.5/weather?';
	}
	function parseData(data){
	    if (data.cod == 404){
	      return null;
	    }	  	      
	    var u = store.position.units;	      
	    var parsedData = {};
	    var KELVIN = 273;	 	      
	    if(u === 'c' || !u){
	    	parsedData.temp = (Math.round(data.main.temp) - KELVIN) + '°C';
	    } else {
	    	parsedData.temp = ((Math.round(data.main.temp) - KELVIN) * 1.8 + 32).toFixed(0) + '°F';
	    }	     	      
	    parsedData.icon = data.weather[0].icon;
	    parsedData.descr = data.weather[0].description;	     
	    parsedData.place = data.name + ', ' + data.sys.country;
	    if(store.lang === 'en'){
	    	parsedData.wind = Math.round(data.wind.speed) + 'mph';
	    } else {
	    	parsedData.wind = Math.round(data.wind.speed * 1.60934) + 'км/ч';
	    }
	    return parsedData;
	}
	
	function renderElements (data){	
	    var self = this;	   
	    	if(!elem.innerHTML)	{ 
	    		elem.innerHTML = widgetHtml; 
	    		elem.querySelector('.localization-switcher').innerHTML = 'RU';
	    		elem.querySelector('.metric-switcher').addEventListener('click', changeTemp);				
				elem.querySelector('.get-my-location').addEventListener('click', getMyLocationHandler);				
				elem.querySelector('.localization-switcher').addEventListener('click', changeLang)
	    	}	

	    	if(elem.querySelector('.localization-switcher').innerHTML === 'EN'){
	    		elem.querySelector('.weather-day').innerHTML = getRusNameOfDay(formatDate().day);
	    		elem.querySelector('.weather-month').innerHTML  = getRusNameOfMonth(formatDate().month);
	    	} else {
	    		elem.querySelector('.weather-day').innerHTML = getNameOfDay(formatDate().day);
	    		elem.querySelector('.weather-month').innerHTML = getNameOfMonth(formatDate().month);

	    	}   
	    	elem.querySelector('.weather-temp').innerHTML = data.temp;	 		 		
	    	elem.querySelector('.weather-info-descr').innerHTML = data.descr;	    	
	    	elem.querySelector('.weather-place').innerHTML = data.place;
	    	elem.querySelector('.weather-date').innerHTML = formatDate().date;
	    	elem.querySelector('.weather-wind').innerHTML = data.wind;	    	
			elem.querySelector('.weather-year').innerHTML = formatDate().year;
			var iconURL = `http://openweathermap.org/img/w/${data.icon}.png`;						
			elem.querySelector('.weather-icon').setAttribute('src', iconURL);
			if(store.position.units === 'c' || !store.position.units){
				elem.querySelector('.metric-switcher').innerHTML = 'F';			
			} else {
				elem.querySelector('.metric-switcher').innerHTML = 'C';
			}
			
			elem.querySelector('.weather-place').addEventListener('click', setCity);	
			elem.querySelector('.save-city').addEventListener('click', changeDetectLoc);
				
			store.position.city = elem.querySelector('.weather-place').innerHTML.split(',')[0];			
	    }
	function getNewWeather(city){	       	
	   	apiURL =  `http://api.openweathermap.org/data/2.5/weather?lang=en&q=${city}&appid=${KEY}`;	   	
	    run();
	}  
	function addAutocomplete(){
      let autocomplete = new google.maps.places.Autocomplete(
          document.querySelector('.get-city'), {
            types: ['(cities)']
          });      
    }
    
	function destroy(){			
		if(elem.querySelector('.get-city')){
			elem.querySelector('.get-city').removeEventListener('keypress', keyPressInput);
		}						
		elem.querySelector('.localization-switcher').removeEventListener('click', changeLang);
		elem.querySelector('.get-my-location').removeEventListener('click', getMyLocationHandler);
		elem.querySelector('.metric-switcher').removeEventListener('click', changeTemp);
		elem.querySelector('.weather-place').removeEventListener('click', setCity);	
		elem.querySelector('.save-city').removeEventListener('click', changeDetectLoc);
		elem.innerHTML = '';
	}
	return {
		init(_element) {
			if (!_element) {
	    		alert('Вы не выбрали элемент в который вставляете виджет');
	    		return;
	   		}

	   		const sym = Symbol.for(_element);
	   		if(Symbol.keyFor(sym)){
	   			elem = _element;
	   		}
			//console.log(elem)			   
			execute();
			setInterval(() => {
	    		run();
			}, 3600000)
			return {
				destroy()  {
					setTimeout(() =>{						
			    		destroy()
					}, 200)
						
				}					
			}
			
		},
		
 };	 
   
});
