(function ($) {

	const queryLimit = 10;
	var apikey = "7vmuq9bufc464x8jnag23ggw";
	var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
	var moviesSearchUrl = baseUrl + '/movies.json?apikey=' + apikey + "&page_limit=" + queryLimit;
 	var movieJSONUrl = baseUrl + '/movies/';
 	
 	window.localStore = new LocalStore();
 	localStore.init();
 	var isLocalStorage = localStore.supportsLocalStorage();
	
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
			this.bind("add", addMovieToLocal);
			// If this browser supports local storage
			// See if there are already movies stored
			if(isLocalStorage){
				storedMovies = localStore.getLocalList();
				for (var i = 0; i < storedMovies.movieArr.length; i++) {
					thisMovie = storedMovies.movieArr[i];
					var movieModel = new Movie({ 
						title: thisMovie.title, 
						id: thisMovie.id,
						thumbnail: thisMovie.thumbnail,
						link: thisMovie.link,
						synopsis: thisMovie.synopsis,
						year: thisMovie.year,
						rating: thisMovie.rating
					});
					this.add(movieModel)
				}
			}
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
		    success: addMovieToList
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

	function addMovieToList(movie){
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

  function addMovieToLocal(movie){
  	// if local storage, add to list
  	if(appview && appview.movies.get(movie.id) != undefined && isLocalStorage){
  		localStore.addMovieToLocal(movie);	
  	}
  }

	function doSearch(query){
		$.ajax({
	    url: moviesSearchUrl + '&q=' + encodeURI(query),
	    dataType: "jsonp",
	    success: searchCallback
	  });
	}

	// Animate 'logo' on document ready
	$('header h1').animate({
	    left: '10px',
	    opacity: 1
	  }, 300, 'linear', function() {
	      //$(this).after('<div>Animation complete.</div>');
	});

})(jQuery);