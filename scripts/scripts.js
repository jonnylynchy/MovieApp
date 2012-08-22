(function ($) {

	const queryLimit = 10;
	var apikey = "7vmuq9bufc464x8jnag23ggw";
	var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
	var moviesSearchUrl = baseUrl + '/movies.json?apikey=' + apikey + "&page_limit=" + queryLimit;

	// Model
	Movie = Backbone.Model.extend({
		name: null,
		id: null
	});

	// Collection
	Movies = Backbone.Collection.extend({
		initialize: function (models, options) {
			this.bind("add", options.view.addMovieLi);
		}
	});
	
	window.AppView = Backbone.View.extend({
		el: $("body"),
		initialize: function () {
			this.movies = new Movies( null, { view: this });
		},
		events: {
			"click #addMovie":  "showModal",
			"click .addToMovies" : "addToMovies"
		},
		showModal: function () {
			$('#newMovie').reveal();
		},
		showPrompt: function () {
			var movieName = prompt("What is the name of your movie?");
			var movieModel = new Movie({ name: movieName });
			this.movies.add( movieModel );  
		},
		addMovieLi: function (model) {
			$("#moviesList").append("<li>" + model.get('name') + "</li>");
		},
		addMovie: function (jqObj) {
			var input = jqObj.parent().find('input');
			var modal = jqObj.parent();
			var movieModel = new Movie({name: input.val()});
			appview.movies.add(movieModel);
			input.val('');
		},
		addToMovies: function (model) {
			console.log(model);
		},
		movieList: function () {
			return this.movies;
		}
	});

	// Init app
	var appview = new AppView;

	// New Movie Modal
	$('#newMovie').find('button').click(function(){
		//appview.addMovie($(this));
		var query = $(this).parent().find('input').val();
		doSearch(query);
	});

	// Add enter to input
	$('#newMovie').find('input').keyup(function(e){
		if($('#searchList').css('display') == 'none'){
			$('#searchList').show();
		}
		$('#searchList').empty();
		var query = $(this).parent().find('input').val();
		doSearch(query);
	});

	function searchCallback(data) {
 		var movies = data.movies;
 		if(data.movies) {
 			$.each(movies, function(index, movie) {
 				var template = $("#movieTemplate").html();
    		$('#searchList').append(_.template(template,{movie:movie}));
    		$('#searchList .movieContainer').fadeIn();
		 	});
 		} else {
 			$('#searchList').hide();
 		}
	}

	function doSearch(query){
		$.ajax({
	    url: moviesSearchUrl + '&q=' + encodeURI(query),
	    dataType: "jsonp",
	    success: searchCallback
	  });
	}


})(jQuery);