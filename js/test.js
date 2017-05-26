var app = angular.module('FirstChartApp', ["ng-fusioncharts"]);

app.controller('ChartController', function($scope, $http) {
			$scope.loadBankData = function() {	
				$http({
                    method: "GET",
                    url: "http://api.worldbank.org/en/countries/ua/indicators/EN.ATM.CO2E.KT?format=json&per_page=15048&date=2010:2015",
                    headers: 'Access-Control-Allow-Origin'
                }).then(function mySucces(response) {
					var data = response.data[1];
					console.log(data);
					
					FusionCharts.ready(function(){
						var text = "";
						for (var i = 0; i < data.length; i++){
							text += "{\"label\": \"" + data[i].date + "\", \"value\": \"" + data[i].value + "\"},"
						}
						text = text.substring(0, text.length - 1);
						console.log(text);
						var fusioncharts = new FusionCharts({
							id: "mychart-1",
							type: 'column3d',
							renderAt: 'chart-container',
							width: '600',
							height: '300',
							dataFormat: 'json',
							dataSource: {
								"chart": {
									"caption": data[0].indicator.value + "(" + data[0].country.value + ")",
									"captionFontBold": "0",
									"captionFontSize": "20",
									"xAxisName": "Year",
									"xAxisNameFontSize": "15",
									"xAxisNameFontBold": "0",
									"paletteColors": "#539FB6",
									"plotFillAlpha": "80",
									"usePlotGradientColor": "0",
									"numberPrefix": "$",
									"bgcolor": "#22252A",
									"bgalpha": "95",
									"canvasbgalpha": "0",
									"basefontcolor": "#F7F3E7",
									"showAlternateHGridColor": "0",
									"divlinealpha": "50",
									"divlinedashed": "0",
									"toolTipBgColor": "#000",
									"toolTipPadding": "10",
									"toolTipBorderRadius": "5",
									"toolTipBorderThickness": "2",
									"toolTipBgAlpha": "62",
									"toolTipBorderColor": "#BBB",
									"rotateyaxisname": "1",
									"canvasbordercolor": "#ffffff",
									"canvasborderthickness": ".3",
									"canvasborderalpha": "100",
									"showValues": "0",
									"plotSpacePercent": "12" 
								},
								"data":[{"label": "2015", "value": "null"},{"label": "2014", "value": "null"},{"label": "2013", "value": "271101.31"},{"label": "2012", "value": "295772.886"},{"label": "2011", "value": "286444.038"},{"label": "2010", "value": "304643.359"}]
							}
						});
						fusioncharts.render();
					});
				 }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                });
				
			}

  });
  
  function hasNumber(t) {
			return /\d/.test(t);
		}