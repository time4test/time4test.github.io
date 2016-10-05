(function() {
  'use strict'
  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .controller('FoundItemsDirectiveController', FoundItemsDirectiveController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective)
  .directive('itemLoaderIndicator', ItemLoaderIndicatorDirective)
  .constant('ApiPath', "https://davids-restaurant.herokuapp.com");

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {

    var menu = this;
    menu.title = "Narrowed Down Menu";
    menu.found = undefined;

    menu.search = function() {
      if (menu.searchTerm) {
        MenuSearchService.getMatchedMenuItems(menu.searchTerm)
        .then(function(foundItems) {
          menu.found = foundItems;
        });
      }
      else {
        menu.found = [];
      }
    }

    menu.onRemove = function(itemIndex) {
      if (menu.found) {
        menu.found.splice(itemIndex, 1);
      }
    };

  }

  MenuSearchService.$inject = ['$http', '$q', 'ApiPath'];
  function MenuSearchService($http, $q, ApiPath) {
    var request, response, busy = false;

    this.getMatchedMenuItems = function(searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      busy = true;

      return getServerResponse()
      .then(function(response) {
        var foundItems = [];
        var allItems = response.data.menu_items;
        allItems.forEach(function(item) {
          if (isMatching(item.description, searchTerm)) {
            foundItems.push(item);
          }
        });
        busy = false;
        return foundItems;
      });

      function getServerResponse() {
        var promise;
        if (response) {
          promise = $q.when(response);
        }
        else if (request) {
          promise = request;
        }
        else {
          request = $http.get(ApiPath + "/menu_items.json")
          .then(function(resp) {
            response = resp;
            return response;
          });
          promise = request;
        }
        return promise;
      }

      function isMatching(description, searchTerm) {
        return description.toLowerCase().indexOf(searchTerm) >= 0;
      }

    };

    this.isBusy = function() {
      return busy;
    };

  }

  function FoundItemsDirective() {
    var ddo = {
      restrict: "E",
      scope: {
        title: "@title",
        items: "<",
        onRemove: "&"
      },
      templateUrl: 'foundItems.html',
      controller: 'FoundItemsDirectiveController as menu',
      bindToController: true
    };
    return ddo;
  }

  function FoundItemsDirectiveController() {
    var menu = this;
  }

  function ItemLoaderIndicatorDirective() {
    var ddo = {
      restrict: "E",
      templateUrl: "loader/itemsloaderindicator.template.html",
      controller: ItemLoaderIndicatorDirectiveController,
      controllerAs: "indicator",
      bindToController: true
    };
    return ddo;
  }

  ItemLoaderIndicatorDirectiveController.$inject = ['MenuSearchService'];
  function ItemLoaderIndicatorDirectiveController(MenuSearchService) {
    var indicator = this;

    indicator.isBusy = function() {
      return MenuSearchService.isBusy();
    };

  };

})();
