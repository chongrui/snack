//controllers are packed into a module
angular.module('deepBlue.controllers', [])

.controller('DashCtrl', function($scope, UserGridService) {

  var snacks = UserGridService.generateNewCollection("snacks");

  // Create a new entity and add it to the collection
  var options = {
    name:'extra-dog67',
    fur:'shedding'
  }

  // Just pass the options to the addEntity method
  // to the collection and it is saved automatically
  snacks.addEntity(options, function(err, snack, data) {
    if (err) {
      console.log("Fuck, usergrid stops working again?")
    } else {
      snacks.fetch(
        function(err, data) {
          if (err) {
            alert("Couldn't get the list of snacks.");
          } else {
            while(snacks.hasNextEntity()) {
              var snack = snacks.getNextEntity();
              console.log(snack.get("name")); // Output the title of the book
            }
          }
        }
      );
    }
  });
})

//top view controller
.controller('AppCtrl', function($scope, $rootScope, $state) {

  // #SIMPLIFIED-IMPLEMENTATION:
  // Simplified handling and logout function.
  // A real app would delegate a service for organizing session data
  // and auth stuff in a better way.
  $rootScope.user = {};

  $scope.logout = function(){
    $rootScope.user = {};
    $state.go('app.start')
  };

})

// This controller is bound to the "app.account" view
.controller('AccountCtrl', function($scope, $rootScope) {

  //readonly property is used to control editability of account form
  $scope.readonly = true;

  // #SIMPLIFIED-IMPLEMENTATION:
  // We act on a copy of the root user
  $scope.accountUser = angular.copy($rootScope.user);
  var userCopy = {};

  $scope.startEdit = function(){
    $scope.readonly = false;
    userCopy = angular.copy($scope.user);
  };

  $scope.cancelEdit = function(){
    $scope.readonly = true;
    $scope.user = userCopy;
  };

  // #SIMPLIFIED-IMPLEMENTATION:
  // this function should call a service to update and save
  // the data of current user.
  // In this case we'll just set form to readonly and copy data back to $rootScope.
  $scope.saveEdit = function(){
    $scope.readonly = true;
    $rootScope.user = $scope.accountUser;
  };

})


.controller('LoginCtrl', function ($scope, $state, $rootScope) {

  // #SIMPLIFIED-IMPLEMENTATION:
  // This login function is just an example.
  // A real one should call a service that checks the auth against some
  // web service

  $scope.login = function(){
    //in this case we just set the user in $rootScope
    $rootScope.user = {
      email : "mary@ubiqtspaces.com",
      name : "Mary Ubiquitous",
      address : "Rue de Galvignac",
      city : "RonnieLand",
      zip  : "00007",
      avatar : 'sampledata/images/avatar.jpg'
    };
    //finally, we route our app to the 'app.shop' view
    $state.go('app.shop');
  };

})


// Feeds controller.
.controller('FeedsCtrl', function($scope, BackendService) {

  // #SIMPLIFIED-IMPLEMENTATION:
  // In this example feeds are loaded from a json file.
  // (using "getFeeds" method in BackendService, see services.js)
  // In your application you can use the same approach or load
  // feeds from a web service.

  $scope.doRefresh = function(){
      BackendService.getFeeds()
      .success(function(newItems) {
        $scope.feeds = newItems;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  // Triggering the first refresh
  $scope.doRefresh();

})

// Shop controller.
.controller('ShopCtrl', function($scope, $ionicActionSheet, BackendService, CartService) {

  // In this example feeds are loaded from a json file.
  // (using "getProducts" method in BackendService, see services.js)
  // In your application you can use the same approach or load
  // products from a web service.

  //using the CartService to load cart from localStorage
  $scope.cart = CartService.loadCart();

  $scope.doRefresh = function(){
      BackendService.getProducts()
      .success(function(newItems) {
        $scope.products = newItems;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning (not needed in this view)
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  // private method to add a product to cart
  var addProductToCart = function(product){
    $scope.cart.products.push(product);
    CartService.saveCart($scope.cart);
  };

  // method to add a product to cart via $ionicActionSheet
  $scope.addProduct = function(product){
    $ionicActionSheet.show({
       buttons: [
         { text: '<b>Add to cart</b>' }
       ],
       titleText: 'Buy ' + product.title,
       cancelText: 'Cancel',
       cancel: function() {
          // add cancel code if needed ..
       },
       buttonClicked: function(index) {
         if(index == 0){
           addProductToCart(product);
           return true;
         }
         return true;
       }
     });
  };

  //trigger initial refresh of products
  $scope.doRefresh();

})

// controller for "app.cart" view
.controller('CartCtrl', function($scope, CartService, $ionicListDelegate) {

  // using the CartService to load cart from localStorage
  $scope.cart = CartService.loadCart();

  // we assign getTotal method of CartService to $scope to have it available
  // in our template
  $scope.getTotal = CartService.getTotal;

  // removes product from cart (making in persistent)
  $scope.dropProduct = function($index){
    $scope.cart.products.splice($index, 1);
    CartService.saveCart($scope.cart);
    // as this method is triggered in an <ion-option-button>
    // we close the list after that (not strictly needed)
    $ionicListDelegate.closeOptionButtons();

  }
})

.controller('CheckoutCtrl', function($scope, CartService, $state) {

  //using the CartService to load cart from localStorage
  $scope.cart = CartService.loadCart();
  $scope.getTotal = CartService.getTotal;

  $scope.getTotal = CartService.getTotal;

  // #NOT-IMPLEMENTED: This method is just calling alert()
  // you should implement this method to connect an ecommerce
  // after that the cart is reset and user is redirected to shop
  $scope.checkout = function(){
    alert("this implementation is up to you!");
    $scope.cart = CartService.resetCart();
    $state.go('app.shop')
  }

})

.controller('ShoppingListCtrl', function($scope)  {

  var groupName = "temp placeholder";

  var user_preferences = getUserData(groupName);

  var requestedSnacks = getRequestedSnacks(user_preferences);

  //filter requested snacks based on values passed in
  requestedSnacks = filterFunction(requestedSnacks);

  //generate score value of each snack based on user preferences
  var snackScore = generateScore(user_preferences, requestedSnacks);

  //var snackScore = {'a': 10,'b': -1, 'c': 3, 'd':6};

  //order list of requested snacks based on score
  requestedSnacks.sort(function(x,y)  {
    return snackScore[y] - snackScore[x];
  });

  $scope.shopping_items = requestedSnacks;

  //Functions to be moved to services soon
  function generateScore(users, snack_list)  {
    var snackScore = {};
    for (var user in users)  {
      //add value based on liked item
      var snacks = users[user].likedItems;
      for (var i in snacks)  {
        snack = snacks[i];
        if (snack in snackScore)  {
          snackScore[snack]+=1;
        } else  {
          snackScore[snack]=1;
        }
      }
      //delete value based on unliked item
      snacks = users[user].dislikedItems;
      for (var i in snacks)  {
        snack = snacks[i];
        if (snack in snackScore)  {
          snackScore[snack]-=1;
        } else  {
          snackScore[snack]=-1;
        }
      }
    }
    for (i in snack_list)  {
      var snack = snack_list[i];
      if (!snackScore.hasOwnProperty(snack))  {
        snackScore[snack] = 0;
      }
    }
    return snackScore;
  };

  function filterFunction(list)  {
    return list;
  };

  function getRequestedSnacks(user_preferences)  {
    var requestedSnacks = [];
    for (var user in user_preferences) {
      requestedItems = user_preferences[user].requestedItems;
      for (var item in requestedItems) {
        //build list of requested snacks
        item = requestedItems[item];
        if (requestedSnacks.indexOf(item) === -1) {
          requestedSnacks.push(item);
        }
      }
    }
    return requestedSnacks;
  };

  function getUserData(groupName)  {
    //fake data that I will remove
    var user_preferences = [{
      id: 0,
      name: 'Ben Sparrow',
      requestedItems: ['a','b'],
      likedItems: ['c'],
      dislikedItems: ['d']
    }, {
      id: 1,
      name: 'Ben Sparrow',
      requestedItems: ['c'],
      likedItems: [],
      dislikedItems: ['b']
    }, {
      id: 2,
      name: 'Ben Sparrow',
      requestedItems: ['d'],
      likedItems: [],
      dislikedItems: ['b']
    }, {
      id: 3,
      name: 'Ben Sparrow',
      requestedItems: ['a'],
      likedItems: ['c'],
      dislikedItems: ['b']
    }, {
      id: 4,
      name: 'Ben Sparrow',
      requestedItems: ['a'],
      likedItems: ['c'],
      dislikedItems: ['b']
    }];

    return user_preferences;
  }
});

