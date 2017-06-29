var app = angular.module('myApp', ["ng-fusioncharts"]);
        app.controller('myCtrl', function($scope, $http) {
            // Init data
            $scope.dataType = loadDefault("dataType", "country");
            $scope.languageData = loadDefault("languageData", "en");
            $scope.hideIndicatorChoose = true;
			$scope.hideIncomeChoose = true;
			$scope.hideCountryChoose = false;
			$scope.hidedChart = true;
			$scope.hideButton = true;
			$scope.hideButtonShow = true;
            $scope.fromYear = parseInt(loadDefault("fromYear", 2010));
            $scope.toYear = parseInt(loadDefault("toYear", 2015));
			$scope.countryID = "pl";
			$scope.chartType = "column2d";
			$scope.incomeLevel = "LMC";
			$scope.indicatorData = "SP.POP.TOTL";
            
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
			
            
            $scope.querySwitch();
            
			
            // Load data from world bank
            $scope.loadBankData = function() {
                $http({
                    method: "GET",
                    url: resolveBasicURL($scope.dataType, $scope.languageData, $scope.fromYear, $scope.toYear, $scope.incomeLevel, $scope.indicatorData),
                    headers: 'Access-Control-Allow-Origin'
                }).then(function mySucces(response) {
					// Table countries
                    if ($scope.dataType == "country") {
                        tableAttr($scope.dataType);
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
                        tableAttr($scope.dataType);
						var data = response.data[1];
						var count = data.length;
						while(count > 0){ 
							if (hasNumber(data[count-1].country.id))
								data.splice(count-1,1);  
							count --; 
						}
						
						var number = $scope.toYear - $scope.fromYear;
						data.splice(0, (24 * number) + 24);
						
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
                        tableAttr($scope.dataType);
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
						var fusioncharts = new FusionCharts({
							id: "mychart",
							type: $scope.chartType,
							renderAt: 'chart-container',
							width: '600',
							height: '300',
							dataFormat: 'json',
							dataSource: createDataSource(data)
						});
						fusioncharts.render();
					});
				 }, function myError(response) {
                    $scope.myWelcome = response.statusText;
                });
				$scope.hidedChart = false;
				$scope.hideButton = false;
				$scope.hideButtonShow = true;
			}


			$scope.hideChart = function() { 
				$scope.hidedChart = true;
				$scope.hideButton = true;
				$scope.hideButtonShow = false;
			}
			
			$scope.showChart = function() {
				$scope.hidedChart = false;
				$scope.hideButton = false;
				$scope.hideButtonShow = true;
			}
	
            $scope.saveDefaults = function() {
                saveDefault("dataType", $scope.dataType);
                saveDefault("languageData", $scope.languageData);
                saveDefault("fromYear", $scope.fromYear);
                saveDefault("toYear", $scope.toYear);
            }

        });
		
		
		
        function tableAttr(type) {
            var elem = document.getElementById("tableDiv");
            elem.innerHTML = '';
            var table = document.createElement("TABLE");
            table.setAttribute("id", "table");
            table.setAttribute("class", "table-hover");
            table.setAttribute("data-search", "true");
			table.setAttribute("data-show-export", "true");
            table.setAttribute("data-show-toggle", "true");
            table.setAttribute("data-show-columns", "true");
            table.setAttribute("data-detail-view", "true");
            table.setAttribute("data-detail-formatter", "detailFormatter");
            table.setAttribute("data-pagination", "true");
            table.setAttribute("data-page-list", "[10, 25, 50, 100, ALL]");
			table.setAttribute("data-height", "550");
            elem.appendChild(table);

        }
		
		function createDataSource(response){
			var dataSource, chart, data;
			// Creating dataSourceChart
			chart = "\"chart\": { \n \"caption\":" + "\"" + response[0].indicator.value + "(" + response[0].country.value + ")\",\n \"captionFontBold\": \"0\", \n \"captionFontSize\": \"20\", \n \"xAxisName\": \"Year\", \n \"xAxisNameFontSize\": \"15\", \n \"xAxisNameFontBold\": \"0\", \n \"yAxisName\": \"Value's\", \n \"yAxisNameFontSize\": \"15\", \n \"yAxisNameFontBold\": \"0\", \n \"paletteColors\": \"#539FB6\", \n \"plotFillAlpha\": \"80\", \n \"usePlotGradientColor\": \"0\", \n \"numberPrefix\": \"$\", \n \"bgcolor\": \"#22252A\", \n \"bgalpha\": \"95\", \n \"canvasbgalpha\": \"0\", \n \"basefontcolor\": \"#F7F3E7\", \n \"showAlternateHGridColor\": \"0\", \n \"divlinealpha\": \"50\", \n \"divlinedashed\": \"0\", \n \"toolTipBgColor\": \"#000\", \n \"toolTipPadding\": \"10\", \n \"toolTipBorderRadius\": \"5\", \n \"toolTipBorderThickness\": \"2\", \n \"toolTipBgAlpha\": \"62\", \n \"toolTipBorderColor\": \"#BBB\", \n \"rotateyaxisname\": \"1\", \n \"canvasbordercolor\": \"#ffffff\", \n \"canvasborderthickness\": \".3\", \n \"canvasborderalpha\": \"100\", \n \"showValues\": \"0\", \n \"plotSpacePercent\": \"12\"}, ";
			// Creating dataSourceData
			data = "\"data\":[";
			for (var i = response.length -1; i > 0; i--){
				data += "{\"label\": \"" + response[i].date + "\", \"value\": \"" + response[i].value + "\"},"
			}
			data = data.substring(0, data.length - 1);
			data += "] }";
			dataSource = "{" + chart + data;
			console.log(dataSource);
			return dataSource;
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
					if (countryID != null)
						suffix = 'countries/' + countryID + '/indicators/' + indicatorData;
					else
						suffix = 'countries/indicators/' + indicatorData;
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

        function loadDefault(element, defaultValue) {
            value = localStorage.getItem(element);
            if (value == '' || value == undefined) {
                return defaultValue;
            }

            return value;
        }

        function saveDefault(element, valueToSave) {
            console.log("Saving element:" + element + " value:" + valueToSave);
            localStorage.setItem(element, valueToSave);
        }
