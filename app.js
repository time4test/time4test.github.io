(function () {
'use strict';

angular.module('LunchCheck', [])
.controller('LunchCheckController', LunchCheckController);
LunchCheckController.$inject = ['$scope'];
	    
function LunchCheckController($scope) {
  $scope.message = "Enter your lunch items !";
  $scope.lunch_menu = "";
  
  $scope.checkLunch = function () {
    var totalNameValue = calculateLunch($scope.lunch_menu);
    $scope.message = totalNameValue;
  };


  function calculateLunch(string) {
    if (string == "")
      return "Please enter data first !";
    var splitString = string.split(/[\s,]+/);
    if (splitString.length <= 3)
      return "Enjoy !";
    else
      return "Too Much !";
}
}

})();

