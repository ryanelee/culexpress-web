var ContactPage = function () {

    return {
        
    	//Basic Map
        initMap: function () {
			var map;
			$(document).ready(function(){
			  map = new GMaps({
				div: '#map',
				scrollwheel: false,				
				lat: 45.3993305,
				lng: -122.7511467
			  });
			  
			  var marker = map.addMarker({
				lat: 45.3993305,
				lng: -122.7511467,
	            title: '中美速递(culexpress.com)'
		       });
			});
        },

        //Panorama Map
        initPanorama: function () {
		    var panorama;
		    $(document).ready(function(){
		      panorama = GMaps.createPanorama({
		        el: '#panorama',
		        lat: 45.3993305,
				lng: -122.7511467
		      });
		    });
		}        

    };
}();