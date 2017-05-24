var app = angular.module('myApp', []);
        app.controller('myCtrl', function($scope, $http) {
            // Init data
            $scope.dataType = "country";
            $scope.languageData = "en";
            $scope.hideYearInputs = true;
			$scope.hideIncomeChoose = true;
			$scope.hideCountryChoose = false;
            $scope.fromYear = 2010;
            $scope.toYear = 2015;
			$scope.incomeLevel = "LMC";
			
			
            // Load data from world bank
            $scope.loadBankData = function() {
                $http({
                    method: "GET",
                    url: resolveBasicURL($scope.dataType, $scope.languageData, $scope.fromYear, $scope.toYear, $scope.incomeLevel),
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
                        $('#table').bootstrapTable({
                            data: response.data[1],
                            columns: [{
                                field: 'id',
                                title: 'Indicator ID'
                            }, {
                                field: 'name',
                                title: 'Name'
                            }, {
                                field: 'source.value',
                                title: 'Source'
                            }, {
                                field: 'sourceOrganization',
                                title: 'Organization of a source'
                            }, {
                                field: 'topics(1)',
                                title: 'Topics'
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

            // Hide or show inputs
            $scope.querySwitch = function() {
				if ($scope.dataType == 'country') {
                    $scope.hideCountryChoose = false;
                } else {
                    $scope.hideCountryChoose = true;
                }
				
                if ($scope.dataType == 'indicator') {
                    $scope.hideYearInputs = false;
                } else {
                    $scope.hideYearInputs = true;
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
            elem = document.getElementById("tableDiv");
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
				if (data[count-1].capitalCity.length == 0)
					data.splice(count-1,1);  
				count --; 
			}
		}

        function detailFormatter(index, row) {
            var html = [];
            $.each(row, function(key, value) {
                html.push('<p><b>' + key + ':</b> ' + value + '</p>');
            });
            return html.join('');
        }

        function resolveBasicURL(type, languageData, fromYear, toYear, incomeLevel) {
            console.log(fromYear);

            var url = 'http://api.worldbank.org/';
            var suffix = '';
            var languageSuffix = languageData + '/';
            var json_suffix = '?format=json';
			var per_page = '&per_page=304';
            switch (type) {
                case 'country':
                    suffix = 'countries';
                    break;
                case 'income':
                    suffix = "countries"
                    break;
                case 'indicator':
                    suffix = "indicator"
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
