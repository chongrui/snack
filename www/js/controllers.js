
// CHECK FEED CONTROLER FOR EXAMPLES!!

//controllers are packed into a module
angular.module('deepBlue.controllers', [])

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

.controller('GroupCtrl', function($scope, $ionicPopup, $timeout)  {

  $scope.showPopup = function() {
    $scope.data = {}

    // Custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type = "text" ng-model = "data.model">',
      title: 'Which User?',
      scope: $scope,
      buttons: [
        { text: 'Cancel' }, {
          text: 'Save',
          type: 'button-positive',
          onTap: function(e) {

            if (!$scope.data.model) {
              //don't allow the user to close unless he enters model...
              e.preventDefault();
            } else {
              return $scope.data.model;
            }
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });
  };
  $scope.groupName = "GROUP1";
  $scope.users = [{
    image: "../img/LogoCropped.png",
    name: "hello",
  },
    {
      image: "../img/LogoCropped.png",
      name: "hello1",
    },
    {
      image: "../img/LogoCropped.png",
      name: "hello2",
    }]
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


.controller('LoginCtrl', function ($scope, $state, $rootScope, UserGridService) {

  // #SIMPLIFIED-IMPLEMENTATION:
  // This login function is just an example.
  // A real one should call a service that checks the auth against some
  // web service

    $scope.user = {
      username: '',
      password: ''
    };

  $scope.login = function(){
    UserGridService.getClient().login($scope.user.username, $scope.user.password, function (err) {
      if (err) {
        // Error - could not log user in
      } else {
        var token = UserGridService.getClient().token;
        UserGridService.getClient().getLoggedInUser(function(err, data, user) {
          if (err) {
            // Error - could not get logged in user
          } else {
            // Success - got logged in user

            // You can then get info from the user entity object:
            var username = user.get('username');
            $rootScope.user = {
              email: user.get('email'),
              name: user.get('name'),
              username: user.get('username')
            };
            $state.go('app.feed');
          }
        });
      }
    });
  };

})


// Feeds controller.
.controller('FeedsCtrl', function($scope, BackendService, UserGridService, $ionicSlideBoxDelegate) {
    UserGridService.getClient().getLoggedInUser(function(err, data, user) {
      if(err) {
        // Error - could not get logged in user
      } else {
        // Success - got logged in user

        // You can then get info from the user entity object:
        var uuid = user.get('uuid');

        var allSnacks = UserGridService.generateNewCollection("snacks");

        allSnacks.qs = {limit:1000};
        allSnacks.fetch(function (err, data) {
          if (err) {
            console.log("Couldn't get the list of snacks.");
          } else {
            var allSnacks = UserGridService.generateNewCollection("snacks");

            allSnacks.qs = {limit:1000};
            allSnacks.fetch(function (err, data) {
              if (err) {
                console.log("Couldn't get the list of snacks.");
              } else {
                allSnacks = data.entities;
                var snacks = UserGridService.generateNewCollection("snackusers");

                snacks.qs = {ql: "select * where userGridId='" + uuid + "'"};
                snacks.fetch(
                  function (err, data) {
                    var feedList = [];
                    if (err) {
                      console.log("Couldn't get the list of snacks.");
                    } else {
                      var recommendedList = _.orderBy(_.filter(_.first(data.entities).snacks, function(item) { return item.dislike === 0 && item.like === 0 && item.requested === 0; }), ['score'], ['desc']);
                      _.each(recommendedList, function(snackStatus) {
                        var matchingSnack = _.find(allSnacks, function(snack) { return snack.uuid === snackStatus.snackId})
                        if(matchingSnack) {
                          feedList.push(matchingSnack);
                        }
                      });

                      $scope.dataModel = {
                        recommendedList: feedList.slice(0, 10)
                      }
                    }
                  });
              }
            });
          }
        });
    }
  });



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

  $scope.updateSlides = function() {
    $ionicSlideBoxDelegate.update();
  }

})

  .controller('MySnacksCtrl', function($scope, UserGridService) {
    UserGridService.getClient().getLoggedInUser(function(err, data, user) {
      if(err) {
        // Error - could not get logged in user
      } else {
        // Success - got logged in user

        // You can then get info from the user entity object:
        var uuid = user.get('uuid');

        var snacks = UserGridService.generateNewCollection("snackusers");

        snacks.qs = {ql: "select * where uuid='" + uuid + "'"};
        snacks.fetch(
          function (err, data) {
            if (err) {
              console.log("Couldn't get the list of snacks.");
            } else {
              var allSnacks = UserGridService.generateNewCollection("snacks");

              allSnacks.qs = {limit:1000};
              allSnacks.fetch(function (err, data) {
                if (err) {
                  console.log("Couldn't get the list of snacks.");
                } else {
                  allSnacks = data.entities;
                  var snacks = UserGridService.generateNewCollection("snackusers");

                  snacks.qs = {ql: "select * where userGridId='" + uuid + "'"};
                  snacks.fetch(
                    function (err, data) {
                      var feedList = [];
                      if (err) {
                        console.log("Couldn't get the list of snacks.");
                      } else {
                        var mySnacksList = _.filter(_.first(data.entities).snacks, function(item) { return item.dislike === 1 || item.like === 1 || item.requested === 1; });
                        _.each(mySnacksList, function(snackStatus) {
                          var matchingSnack = _.find(allSnacks, function(snack) { return snack.uuid === snackStatus.snackId});
                          if(matchingSnack) {
                            matchingSnack.status = {
                              like: snackStatus.like,
                              dislike: snackStatus.dislike,
                              requested: snackStatus.requested
                            };
                            feedList.push(matchingSnack);
                          }
                        });
                        $scope.dataModel = {
                          recommendedList: feedList
                        }
                      }
                    });
                }
              });
            }
          }
        );
      }
    });
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

.controller('ShoppingListCtrl', function($scope, UserGridService, FeedbackService)  {
  $scope.displaySnacksList = [];

  var cloneSnack = function (list, currentSnack, checked) {
    _.forEach(list, function(item) {
      if (item.id == currentSnack.uuid) {
        var tmpSnack = _.cloneDeep(currentSnack);
        tmpSnack.checked = checked;
        tmpSnack.numberOfRequested = item.numberOfRequested;
        $scope.displaySnacksList.push(tmpSnack);
      }
    });
  };

  var groupsHaveCurrentUser = UserGridService.generateNewCollection("snackgroups");
  //TODO should check all the groups' suppliers
  //var userUuid = '6e75d074-49bd-11e6-a968-0242ac120004';
  //groupsHaveCurrentUser.qs = {ql: 'select * where userGridId=\'' + userUuid + '\''};

  var totalRequestedSnacksList = [];
  var totalPurchasedSnacksList = [];

  groupsHaveCurrentUser.fetch(function(err, data) {
    _.forEach(data.entities, function (group) {
      console.log(data.entities);
      if (group.hasOwnProperty('requestedSnacks')) {
        _.forEach(group.requestedSnacks, function (rs) {
          totalRequestedSnacksList.push(rs);
        });
      }
      if (group.hasOwnProperty('purchasedSnacks')) {
        _.forEach(group.purchasedSnacks, function (ps) {
          totalPurchasedSnacksList.push(ps);
        });
      }
    });

    var snacks = UserGridService.generateNewCollection("snacks");
    snacks.qs = {limit:1000};
    snacks.fetch(function (err,data) {
      _.forEach(data.entities, function (s) {
        cloneSnack(totalRequestedSnacksList, s, false);
        cloneSnack(totalPurchasedSnacksList, s, true);
      });

      console.log($scope.displaySnacksList);
    });

  });

  $scope.removeFromRequestedList= function (x) {
    console.log(x.uuid);
    FeedbackService.checkSnack('e68aea3d-49e9-11e6-a968-0242ac120004', x.uuid);
  };


  $scope.groupName = "GROUP1";

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
  $scope.shopping_items = [{
    image: "../img/LogoCropped.png",
    name: "hello",
    score: 3,
    purchased: false
  },
  {
    image: "../img/LogoCropped.png",
    name: "hello1",
    score: 2,
    purchased: true
  },
  {
    image: "../img/LogoCropped.png",
    name: "hello2",
    score: 1,
    purchased: false
  }]

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

