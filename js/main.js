var app = angular.module('myApp', ["ng-fusioncharts"]);
        app.controller('myCtrl', function($scope, $http) {
            // Init data
            $scope.dataType = "country";
            $scope.languageData = "en";
            $scope.hideIndicatorChoose = true;
			$scope.hideIncomeChoose = true;
			$scope.hideCountryChoose = false;
            $scope.fromYear = 2010;
            $scope.toYear = 2015;
			$scope.countryID = "pl";
			$scope.incomeLevel = "LMC";
			$scope.indicatorData = "SP.POP.TOTL";
			
			
            // Load data from world bank
            $scope.loadBankData = function() {
                $http({
                    method: "GET",
                    url: resolveBasicURL($scope.dataType, $scope.languageData, $scope.fromYear, $scope.toYear, $scope.incomeLevel, $scope.indicatorData),
                    headers: 'Access-Control-Allow-Origin'
                }).then(function mySucces(response) {
					// Table countries
                    if ($scope.dataType == "country") {
                        tableAttr();
						var data = response.data[1];
						removeRegions(data.length, data);
                        $('#table').bootstrapTable({
                            data: data,
								columns: [{
									field: 'id',
									title: 'Country ID',
									sortable: true
								}, {
									field: 'name',
									title: 'Name',
									sortable: true
								}, {
									field: 'iso2Code',
									title: 'countryCode',
									sortable: true
								}, {
									field: 'region.value',
									title: 'Region',
									sortable: true
								}, {
									field: 'capitalCity',
									title: 'Capital',
									sortable: true
								}]
                        });
						// Table of comparison(using population indicator)
                    }  else if ($scope.dataType == "indicator") {
                        tableAttr();
						var data = response.data[1];
						var count = data.length;
						while(count > 0){ 
							if (hasNumber(data[count-1].country.id))
								data.splice(count-1,1);  
							count --; 
						}
						
                        $('#table').bootstrapTable({
                            data: data,
                            columns: [{
                                field: 'country.id',
                                title: 'Country ID',
								sortable: true
                            }, {
                                field: 'country.value',
                                title: 'Name',
								sortable: true
                            }, {
                                field: 'value',
                                title: 'Value'
                            }, {
                                field: 'date',
                                title: 'Date'
                            }]
                        });
						// Table of countries by their incomelevel
                    } else if ($scope.dataType == "income") {
                        tableAttr();
						var data = response.data[1];
						removeRegions(data.length, data);
                        $('#table').bootstrapTable({
                            data: data,
                            columns: [{
									field: 'id',
									title: 'Country ID',
									sortable: true
								}, {
									field: 'name',
									title: 'Name',
									sortable: true
								}, {
									field: 'iso2Code',
									title: 'countryCode',
									sortable: true
								}, {
									field: 'region.value',
									title: 'Region',
									sortable: true
								}, {
									field: 'incomeLevel.value',
									title: 'Income Level',
									sortable: true
								}]
                        });
                    }
                }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                });
            }
			
			//Load data for charts
			$scope.loadChartData = function() {	
				$http({
                    method: "GET",
                    url: resolveBasicURL($scope.dataType, $scope.languageData, $scope.fromYear, $scope.toYear, $scope.incomeLevel, $scope.indicatorData, $scope.countryID),
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

            // Hide or show inputs
            $scope.querySwitch = function() {
				if ($scope.dataType == 'country') {
                    $scope.hideCountryChoose = false;
                } else {
                    $scope.hideCountryChoose = true;
                }
				
                if ($scope.dataType == 'indicator') {
                    $scope.hideIndicatorChoose = false;
                } else {
                    $scope.hideIndicatorChoose = true;
                }
				
				if ($scope.dataType == 'income') {
                    $scope.hideIncomeChoose = false;
                } else {
                    $scope.hideIncomeChoose = true;
                }
            }


        });

        function tableAttr() {
            var elem = document.getElementById("tableDiv");
            elem.innerHTML = '';
            var table = document.createElement("TABLE");
            table.setAttribute("id", "table");
            table.setAttribute("class", "flatTable");
            table.setAttribute("data-search", "true");
            table.setAttribute("data-show-toggle", "true");
            table.setAttribute("data-show-columns", "true");
            table.setAttribute("data-detail-view", "true");
            table.setAttribute("data-detail-formatter", "detailFormatter");
            table.setAttribute("data-pagination", "true");
            table.setAttribute("data-page-list", "[10, 25, 50, 100, ALL]");
			table.setAttribute("data-height", "550");
            elem.appendChild(table);

        }
		
		function removeRegions(count, data){
			while(count > 0){ 
				if (hasNumber(data[count-1].iso2Code) || data[count-1].region.value == "Aggregates")
					data.splice(count-1,1);  
				count --; 
			}
		}
		
		function hasNumber(t) {
			return /\d/.test(t);
		}

        function detailFormatter(index, row) {
            var html = [];
            $.each(row, function(key, value) {
                html.push('<p><b>' + key + ':</b> ' + value + '</p>');
            });
            return html.join('');
        }

        function resolveBasicURL(type, languageData, fromYear, toYear, incomeLevel, indicatorData, countryID) {
            console.log(fromYear);
            var url = 'http://api.worldbank.org/';
            var suffix = '';
            var languageSuffix = languageData + '/';
            var json_suffix = '?format=json';
			var per_page = '&per_page=15048';
            switch (type) {
                case 'country':
                    suffix = 'countries';
                    break;
                case 'income':
                    suffix = 'countries';
                    break;
                case 'indicator':
                    suffix = 'countries/' + countryID + '/indicators/' + indicatorData;
                    break;
            }
            var finalUrl = url + languageSuffix + suffix + json_suffix + per_page;
			if (type == "income" && incomeLevel != undefined){
				finalUrl += '&incomeLevel=' + incomeLevel;
			}
            if (type == 'indicator' && fromYear != undefined && toYear != undefined) {
                finalUrl += '&date=' + parseInt(fromYear) + ':' + parseInt(toYear);
            }

            console.log(finalUrl);
            return finalUrl;
        }
