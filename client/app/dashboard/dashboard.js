angular.module('astonishingOwls.search', [])


.controller('searchCurrency', 
['$scope', '$location', 'Search','keysGrabber','formatDate','SharedVariables',
function($scope, $location, Search, keysGrabber, formatDate, SharedVariables){

  $scope.availableOptions = {}
  $scope.listOfCurrency = {};
  $scope.historyRate = {};
  $scope.selectedCurrency = '';
  $scope.dates = {}; //will capture dates incl today, 1wk ago, 1mo ago, 1yr ago
  $scope.passedToDB = [];
  $scope.downloadedData = [];

  $scope.getSelectedCurrency = function(){

    $scope.dates.today = formatDate(new Date(new Date().setDate(new Date().getDate())));
    $scope.dates.sevenDaysAgo = formatDate(new Date(new Date().setDate(new Date().getDate() - 7)));
    $scope.dates.thirtyDaysAgo = formatDate(new Date(new Date().setDate(new Date().getDate() - 30)));
    $scope.dates.yearAgo = formatDate(new Date(new Date().setDate(new Date().getDate() - 365)));
    sevenDaysAgo = $scope.dates.sevenDaysAgo;
    thirtyDaysAgo = $scope.dates.thirtyDaysAgo;
    yearAgo = $scope.dates.yearAgo;

    Search.getall().then(function(res){
      var inputCurrency = keysGrabber($scope.selectedCurrency, $scope.listOfCurrency)
      $scope.historyRate.todayRate = res.rates[inputCurrency];
      $scope.passedToDB.push({ 
        time: "today", 
        cxy: inputCurrency, 
        date: $scope.dates.today, 
        value: $scope.historyRate.todayRate 
      });
    })

    Search.getHistorical(sevenDaysAgo).then(function(res){
      var inputCurrency = keysGrabber($scope.selectedCurrency, $scope.listOfCurrency)
      $scope.historyRate.sevenDaysAgo = res.data.rates[inputCurrency];
      $scope.passedToDB.push({ 
        time: "last week", 
        cxy: inputCurrency, 
        date: $scope.dates.sevenDaysAgo, 
        value: $scope.historyRate.sevenDaysAgo 
      });
    })

    Search.getHistorical(thirtyDaysAgo).then(function(res){
      var inputCurrency = keysGrabber($scope.selectedCurrency, $scope.listOfCurrency)
      $scope.historyRate.thirtyDaysAgo = res.data.rates[inputCurrency];
      $scope.passedToDB.push({ 
        time: "last month", 
        cxy: inputCurrency, 
        date: $scope.dates.thirtyDaysAgo, 
        value: $scope.historyRate.thirtyDaysAgo 
      });
    })

    Search.getHistorical(yearAgo).then(function(res){
      var inputCurrency = keysGrabber($scope.selectedCurrency, $scope.listOfCurrency)
      $scope.historyRate.yearAgo = res.data.rates[inputCurrency];
      $scope.passedToDB.push({ 
        time: "last year", 
        cxy: inputCurrency, 
        date: $scope.dates.yearAgo, 
        value: $scope.historyRate.yearAgo 
      });
    })

  } //end of .getSelectedCurrency function


  $scope.postToDB = function(){
    Search.postDB($scope.passedToDB);
    $scope.passedToDB = [];
    Search.getDB()
    .then( (resp) => {
      $scope.downloadedData = resp.data.savedSearch;
      SharedVariables.setDownloadedData($scope.downloadedData);

    });
  }; //end of .postToDB function



  //we don't use this yet.... this will be for historical trend analysis
  $scope.submitHistoricDate = function(){
    var getHistoricalInput = $scope.getHistoricalDate;
    Search.getHistorical(getHistoricalInput)
    .then(function(res){
    })
  }

  //we don't use this yet.... this will be for historical trend analysis
  $scope.getTimeSeries = function(){
    var userInput = {};
    userInput.startDates = $scope.timeSeriesStart
    userInput.endDates = $scope.timeSeriesEnd
    userInput.symbols = $scope.timeSeriesSymbol

    Search.getTimeSeries(userInput)
    .then(function(res){
    })
  }


  //Initializin getall function when page is loaded.
  Search.getall().then(function(res){
    // console.log(res.rates, ' GETALL Initialize')
    $scope.availableOptions.rates = res.rates;
  })


  //Initializing to get all list of currencies
  Search.getListOfCurrencies().then(function(res){
    // console.log(res , ' getListOfCurrencies')
    $scope.listOfCurrency = res
  })

}])




