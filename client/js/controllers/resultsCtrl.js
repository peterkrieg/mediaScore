angular.module('myApp')
.controller('resultsCtrl', function($scope, prepareReport, instaService, $sce){

	$scope.loadingMedia = true;
	$scope.loadingEverythingElse = true;
	
// delete the stuff after || when done with dev
// var token = tokenService.getToken() || '1359984932.c4fe6f4.32721a77599f4b11b20c1f2ffcbedab2';

prepareReport.getToken()
.then(function(response){
	var token = response.data.token;
	var user = response.data.profile._json.data;
	// console.log(user);

	var userEdited = prepareReport.startReport(user);
	// console.log('edited user is', userEdited);

	var numMedia = userEdited.numMedia;
	var numFollows = userEdited.numFollows;
	var numFollowers = userEdited.numFollowers;

	// binding to scope, the entire edited user
	$scope.user = userEdited;


	
	//______________Media Messages for loading_______________
	var mediaMessages = {
		fast: 'You have '+numMedia+' pieces of media.  This should only take a few moments',
		medium: 'You have '+numMedia+' pieces of media.  This shouldn\'t take too long',
		slow: 'Wow!  You have '+numMedia+' pieces of media.  We\'re taking care of this as fast as we can, but this might take a minute or two'
	};
	var otherLoadingMessages = {
		fast: 'You have '+numFollowers+' followers and follow '+numFollows+'users.  This should only take a few moments',
		medium: 'You have '+numFollowers+' followers and follow '+numFollows+'users.  This shouldn\'t take too long',
		slow: 'Wow!  You have '+numFollowers+' followers and follow '+numFollows+'users.  We\'re taking care of this as fast as we can, but this might take a minute or two'
	};

	if(numMedia<100){
		$scope.loadingMediaMessage = mediaMessages.fast;
	}
	else if(numMedia>100 && numMedia<300){
		$scope.loadingMediaMessage = mediaMessages.medium;
	}
	else if(numMedia>300){
		$scope.loadingMediaMessage = mediaMessages.slow;
	}
	if(numFollowers <=200 && numFollows<=200){
		$scope.otherLoadingMessage = otherLoadingMessages.fast;
	}
	else if(numFollowers>=1000 || numFollows>= 1000){
		$scope.otherLoadingMessage = otherLoadingMessages.slow;
	}
	else if(numFollowers<1000 || numFollows<1000){
		$scope.otherLoadingMessage = otherLoadingMessages.medium;
	}
	//______________End of loading messages______________


	getMedia(token, userEdited);

})





//_______Gets media, for first tab of results ______________
function getMedia(token, user){
	instaService.getMedia(token, user)
	.then(function(report){
		console.log('REPORT RECEIVED OF JUST MEDIA IS \n\n', report);

		fixUrls(report.media);

		// sorts media by popularity, when first loaded, then directive for controls takes over
		$scope.media = report.media
		.sort(function(a,b){return ((b.comments.count*2+b.likes.count)-(a.comments.count*2+a.likes.count));});
		$scope.loadingMedia = false;

		getOtherData(token, report);
	})
};

// fixing video URLs, weird angular thing..
function fixUrls(media){
	for(var i=0; i<media.length; i++){
		var currentVid = media[i];
		if(currentVid.type==="video"){
			currentVid.safeurl = $sce.trustAsResourceUrl(currentVid.videos.standard_resolution.url);
		}
	}
};

function getOtherData(token, report){
	instaService.getOtherData(token, report)
	.then(function(report){
		console.log('FINAL REPORT RECEIVED IS \n\n', report);

		// report now received, can set up view now
		finishReportView(report);
	})
}


//___________________________________________________



// variable definitions for functions
var calledTimes = {
	uniqueFollows: 0,
	uniqueFollowers: 0,
	userLikersArr: 0,
	yourLikesUsersArr: 0
};

$scope.noMore = {
	uniqueFollows: false,
	uniqueFollowers: false,
	userLikersArr: false,
	yourLikesUsersArr: false
};

$scope.uniqueFollows = [];
$scope.uniqueFollowers = [];
$scope.userLikersArr = [];
$scope.yourLikesUsersArr = [];


$scope.loadMore = function(category){
	// console.log('scope inside of load more is \n\n', $scope);
	// console.log('category is \t\t', category);
	// console.log($scope[category]);
	// console.log($scope.report.relationships[category]);

	// var count = calledTimes[category];
	calledTimes[category]++
	var count = calledTimes[category];
	for(var i=0; i<12*count; i++){
		var itemToAdd = $scope.report.relationships[category].pop();
		if(itemToAdd){
			$scope[category].push(itemToAdd);
		}
		else{
			$scope.noMore[category] = true;
			return;
		}
	}
}  // end of load more function



function finishReportView(report){
	// console.log(report);
	$scope.report = report;

	// loads initial for 4 categories
	$scope.loadMore("uniqueFollows");
	$scope.loadMore("uniqueFollowers");
	$scope.loadMore("userLikersArr");
	$scope.loadMore("yourLikesUsersArr");

	$scope.loadingEverythingElse = false;


} // end of finishReportView Function












});  // controller, nothing should go below this

