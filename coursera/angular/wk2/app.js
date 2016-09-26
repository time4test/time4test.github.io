(function () {
'use strict';

angular.module('ShoppingListCheckOff', [])
.controller('ToBuyShoppingController', ToBuyShoppingController)
.controller('AlreadyBoughtShoppingController', AlreadyBoughtShoppingController)
.service('ShoppingListCheckOffService', ShoppingListCheckOffService);

ToBuyShoppingController.$inject = ['ShoppingListCheckOffService'];
function ToBuyShoppingController(ShoppingListCheckOffService) {
  
  var buy = this;
  buy.itemName = "";
  buy.itemQuantity = "";

  // local copy of list
  var items = ShoppingListCheckOffService.getToBuyItems();

  buy.addItem = function () {
      var item = {
        name: buy.itemName,
        quantity: buy.itemQuantity
      };
      ShoppingListCheckOffService.addItem(item);
      buy.itemName = "";
      buy.itemQuantity = "";
  };

  buy.boughtItem = function(itemIndex){
   ShoppingListCheckOffService.boughtItem(itemIndex, items[itemIndex]);
  }

  buy.getItems = function(){
    return items;
  }

  buy.howMany = function(){
    return ShoppingListCheckOffService.howManyToBuy();
  }

}

AlreadyBoughtShoppingController.$inject = ['ShoppingListCheckOffService'];
function AlreadyBoughtShoppingController(ShoppingListCheckOffService){

  var bought = this;

  //local copy of items
  bought.items = ShoppingListCheckOffService.getBoughtItems();

  bought.howMany = function(){
    return ShoppingListCheckOffService.howManyBought();
  }
}

function ShoppingListCheckOffService() {

  // Initial list of shopping items
  var toBuyItems =  [
          {name : "wines", quantity : 5},
          {name : "chips", quantity :10},
          {name : "beers", quantity : 20},
          {name : "pizzas", quantity : 5},
          {name : "sodas", quantity :  5}
  ];

  var boughtItems = [];

  this.boughtItem = function(itemIndex, item){
    boughtItems.push(item);
    toBuyItems.splice(itemIndex, 1); 
  };

  this.addItem = function(item){
    toBuyItems.push(item); 
  };

  this.getToBuyItems = function(){
    return toBuyItems;
  }

  this.getBoughtItems = function(){
    return boughtItems;
  }

  this.howManyToBuy = function(){
    return toBuyItems.length;
  }
  
  this.howManyBought = function(){
    return boughtItems.length;
  }
}

})();

