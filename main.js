// declaring global variable
var cheeseApp = {};
cheeseApp.count = 13;

//1. getting recipes from yummly with required specifications
cheeseApp.getRecipe = function(searchRequest, mealRequest) {
	$.ajax({
		url: 'http://api.yummly.com/v1/api/recipes?',
		type: "GET",
		dataType: "json",
		data : {
			q : searchRequest,
			allowedCourse: mealRequest,
			allowedIngredient: "cheese",
			_app_key: "a31a3182ea0621976b0d67b0f55b077f",
			_app_id: "07613e45",
			format: "json",
			requirePictures: "true",
			maxResult: "12",
		},
		success: function(recipe) {
			cheeseApp.deleteDuplicates(recipe.matches);
		}
	});
};

// getting recipe when button click again for more recipes
cheeseApp.getRecipeAgain = function(searchRequest, mealRequest) {
	$.ajax({
		url: 'http://api.yummly.com/v1/api/recipes?',
		type: "GET",
		dataType: "json",
		data : {
			q : searchRequest,
			allowedCourse: mealRequest,
			allowedIngredient: "cheese",
			_app_key: "a31a3182ea0621976b0d67b0f55b077f",
			_app_id: "07613e45",
			format: "json",
			requirePictures: "true",
			maxResult: "12",
			start: cheeseApp.count
		},
		success: function(recipe) {
			cheeseApp.count += 12;
			cheeseApp.deleteDuplicates(recipe.matches);
		}
	});
};

//delete duplicates 
cheeseApp.deleteDuplicates = function (recipeMatches) {
	var filteredMatches = _.uniq(recipeMatches, function(x){
		return x.recipeName;
	});
	cheeseApp.displayRecipe(filteredMatches);
}

//2. display recipes that have been returned 
cheeseApp.displayRecipe = function (recipeItem) {

// clear recipes that are already on the page
	$('#recipes').empty();	
	$.each(recipeItem, function(index,item) {   
		var $recipeContainer = $('<div>');
      	$recipeContainer.addClass('recipeContainer animated fadeIn');
      	var $title= $("<h3>");
      	$title.text(item.recipeName);
      	var $displaySource = $("<h4>");
      	$displaySource.text(item.sourceDisplayName);
      	var $recipeLink = $("<a>");
      	var $recipeID = item.id;
      	var $recipeHref = "http://www.yummly.com/recipe/" + $recipeID;

      	$recipeLink.attr("href", $recipeHref);
      	var $recipeResize = item.imageUrlsBySize[90].replace("=s90-c","");
      	var $ingredients = $("<p>");
      	var $imageContainer = $('<div>').addClass('imageContainer').css({backgroundImage: 'url('+ $recipeResize +')'});
      	$ingredients.text(item.ingredients);
      	$recipeContainer.append($imageContainer,$title,$displaySource);
      	$recipeLink.html($recipeContainer)
      	$("#recipes").append($recipeLink);
	}); //closes each loop
	$("#recipeForm").removeClass('hide');
	$(".arrow").removeClass('hide');
	$("a").attr("target", "_blank");
	
} //closes app.displayRecipe

cheeseApp.searchRecipes = function(){
	$('form#selectCheeseForm').on('submit', function(e){
		e.preventDefault();
		var searchRequest = $('.selectCheese').val();
		var mealRequest = $('.selectMeal').val();
		cheeseApp.getRecipe(searchRequest,mealRequest);
	});
};


// what happens when search again button is clicked
cheeseApp.searchAgain = function(){
	$('#recipeForm').on('submit', function(e){
		e.preventDefault();
		var searchRequest = $('.selectCheese').val();
		var mealRequest = $('.selectMeal').val();
		cheeseApp.getRecipeAgain(searchRequest,mealRequest);
	});
};




// this starts everything going on the page
cheeseApp.init = function() {
	cheeseApp.searchRecipes();
	cheeseApp.searchAgain();
};

// calls init function
$(document).ready(function(){
  cheeseApp.init();
});




