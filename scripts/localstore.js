// Create a new local store object... 
// check to see if it's supported first with init()

LocalStore = function(){
	return {

		// Checks to see if local storage is turned on
		supportsLocalStorage: function(){
			try {
		    return 'localStorage' in window && window['localStorage'] !== null;
		  } catch(e){
		    return false;
		  }
		},
		
		// initialize this object by creating a default list if one does not exist
		init: function(){
			if(this.supportsLocalStorage() && localStorage.myMoviesList == undefined){
				list = {};
				list.movieArr = [];
				localStorage.setItem('myMoviesList', JSON.stringify(list));
			}	
		},
		
		// add a new movie to the locally stored list
		addMovieToLocal: function(movie){
			var movieList = JSON.parse(localStorage.myMoviesList);
			var movieArr = movieList.movieArr;
			movieArr.push(movie);
			localStorage.setItem('myMoviesList', JSON.stringify(movieList));
		},
		
		getLocalList: function(){
			return JSON.parse(localStorage.myMoviesList);
		}

	}
}