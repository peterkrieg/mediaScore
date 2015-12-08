angular.module('myApp')
.directive('hashtagBarChart', function(){
	return {
		link: function(scope, elem, attrs){
			console.log(scope.report.analytics);

			$(function(){
				var chartOptions = {
					chart: {
						type: 'column',
						style: {
							fontFamily: "'Playfair Display', serif",
							color: 'red'
						}
					},
					credits: {
						enabled: false
					},
					title: {
						text: null,
					},
					subtitle: {
						text: null
					},

					//____________ x-axis____________
					xAxis: {
						categories: scope.report.analytics.currentTags,
						crosshair: true,
						labels: {
							style: {
								fontSize: '15px'
							}
						}
					},

					// ___________y-axis____________
					yAxis: {
						// style: {
						// 	fontSize: '20px'
						// },
						labels: {
							style: {
								fontSize: '15px'
							}
						},
						min: 0,
						title: {
							text: 'Count',
							style: {
								fontSize: '30px',
								// color: 'green'
							}
						}
					},

					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},

					series: [{
						name: 'Number of hashtag uses',
						data: scope.report.analytics.currentTagsCounts
					}]




				};//end of chart options definition

				// uses chartOptions to make chart, to be able
				// to destroy it, because of error with update
				//
				$(elem).highcharts(chartOptions);

				var chart = $(elem).highcharts();

				var tagsGroupsNames = scope.report.analytics.tagsGroupsNames;
				var tagsGroupsCounts = scope.report.analytics.tagsGroupsCounts;

				var $leftButton = $(elem).parent().find('i.cycle-left');
				var $rightButton = $(elem).parent().find('i.cycle-right');

				///////////////////////////////////////////////////
				//  Events of clicking left or right button, 
				//  Cycling through hashtags
				///////////////////////////////////////////////////

				// right button click
				$rightButton.on('click', function(e){
					e.preventDefault();

					// increases index, to move to next list of data
					scope.index++;

					var currentTags = tagsGroupsNames[scope.index];
					var currentCounts = tagsGroupsCounts[scope.index];

					// updating on scope, maybe not necessary
					scope.report.analytics.currentTags = currentTags;
					scope.report.analytics.currentTagsCounts = currentCounts;
					
					// // update data of chart
					chart.destroy();
					chartOptions.xAxis.categories = currentTags;
					chartOptions.series[0].data = currentCounts;
					chart = new Highcharts.Chart(chartOptions);

					// if you move right, then you know for sure there
					// at least must be one data set to left
					scope.noMoreLeft = false;
					scope.$apply();

					if(!tagsGroupsCounts[scope.index+1]){
						scope.noMoreRight = true;
						scope.$apply();
					}

				})// end of right button function

				$leftButton.on('click', function(e){
					e.preventDefault();

					scope.index--;

					var currentTags = tagsGroupsNames[scope.index];
					var currentCounts = tagsGroupsCounts[scope.index];

					// updating on scope, maybe not necessary
					scope.report.analytics.currentTags = currentTags;
					scope.report.analytics.currentTagsCounts = currentCounts;

					// // update data of chart
					chart.destroy();
					chartOptions.xAxis.categories = currentTags;
					chartOptions.series[0].data = currentCounts;
					chart = new Highcharts.Chart(chartOptions);


					scope.noMoreRight = false;
					scope.$apply();

					if(!tagsGroupsCounts[scope.index-1]){
						scope.noMoreLeft = true;
						scope.$apply();
					}

				})// end of left button function



				




























			});// end of jquery ready function, nothing below this 
		} // link
	} // return
}) // whole directive


