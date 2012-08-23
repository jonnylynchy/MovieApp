(function ($) {

	const queryLimit = 10;
	var apikey = "7vmuq9bufc464x8jnag23ggw";
	var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
	var moviesSearchUrl = baseUrl + '/movies.json?apikey=' + apikey + "&page_limit=" + queryLimit;
 	var movieJSONUrl = baseUrl + '/movies/';

	// Model
	Movie = Backbone.Model.extend({
		title: null,
		id: null,
		thumbnail: null,
		link: null,
		synopsis: null,
		year: null,
		rating: null
	});

	// Collection
	Movies = Backbone.Collection.extend({
		initialize: function (models, options) {
			this.bind("add", options.view.addMovie);
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
		addMovie: function (model) {
			var template = $("#myMovieTemplate").html();
			var movie = {
				title: model.get('title'),
				id: model.get('id'),
				thumbnail: model.get('thumbnail'),
				link: model.get('link'),
				synopsis: model.get('synopsis'),
				year: model.get('year'),
				rating: model.get('rating')
			}
			var element = $(_.template(template,{movie:movie}));
    	$("#moviesList").append(element);
    	element.fadeIn();
		},
		addToMovies: function (e) {
			var id = $(e.currentTarget).parent().data("id");
			var movieJSON = movieJSONUrl + id + '.json?apikey=' + apikey;
			$.ajax({
		    url: movieJSON,
		    dataType: "jsonp",
		    success: function(movie){
		    	var movieModel = new Movie({ 
						title: movie.title, 
						id: movie.id,
						thumbnail: movie.posters.profile,
						link: movie.links.alternate,
						synopsis: movie.synopsis,
						year: movie.year,
						rating: movie.mpaa_rating
					});
					appview.movies.add(movieModel);
		    }
		  });
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
 				var element = $(_.template(template,{movie:movie}));
    		$("#searchList").append(element);
    		element.fadeIn();
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