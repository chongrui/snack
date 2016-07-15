
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
              return $scope.users.push({image: "../img/LogoCropped.png",name:$scope.data.model});
            }
          }
        }
      ]
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

.controller('PreferencesCtrl', function($scope, $state, $rootScope, UserGridService, RecommendationService) {
  $scope.skipPreferences = function () {
    $state.go('app.feed');
  };

  $scope.sweetOrSavorySlider = {
    value: 2,
    options: {
      showTicksValues: false,
      hidePointerLabels: true,
      hideLimitLabels: true,
      getPointerColor: function(value) {
        return '#009688';
      },
      stepsArray: [
        {value: 1},
        {value: 2},
        {value: 3}
      ]
    }
  };

  $scope.chewyOrCrunchySlider = {
    value: 2,
    options: {
      showTicksValues: false,
      hidePointerLabels: true,
      hideLimitLabels: true,
      getPointerColor: function(value) {
        return '#009688';
      },
      stepsArray: [
        {value: 1},
        {value: 2},
        {value: 3}
      ]
    }
  };

  $scope.mildOrSpicySlider = {
    value: 2,
    options: {
      showTicksValues: false,
      hidePointerLabels: true,
      hideLimitLabels: true,
      getPointerColor: function(value) {
        return '#009688';
      },
      stepsArray: [
        {value: 1},
        {value: 2},
        {value: 3}
      ]
    }
  };

  $scope.lowCarbSlider = {
    value: 2,
    options: {
      showTicksValues: false,
      hidePointerLabels: true,
      hideLimitLabels: true,
      getPointerColor: function(value) {
        return '#009688';
      },
      stepsArray: [
        {value: 1},
        {value: 2},
        {value: 3}
      ]
    }
  };

  $scope.vegSlider = {
    value: 2,
    options: {
      showTicksValues: false,
      hidePointerLabels: true,
      hideLimitLabels: true,
      getPointerColor: function(value) {
        return '#009688';
      },
      stepsArray: [
        {value: 1},
        {value: 2},
        {value: 3}
      ]
    }
  };

  $scope.organicSlider = {
    value: 2,
    options: {
      showTicksValues: false,
      hidePointerLabels: true,
      hideLimitLabels: true,
      getPointerColor: function(value) {
        return '#009688';
      },
      stepsArray: [
        {value: 1},
        {value: 2},
        {value: 3}
      ]
    }
  };

  function generatePreferencesList (currentPreferencesList) {
    var newList = [];

    switch ($scope.sweetOrSavorySlider.value) {
      case 1:
        if (_.indexOf(currentPreferencesList, 0) === -1) {
          newList.push(0);
        }
        break;
      case 2:
        if (_.indexOf(currentPreferencesList, 0) === -1) {
          newList.push(0);
        }
        if (_.indexOf(currentPreferencesList, 10) === -1) {
          newList.push(10);
        }
        break;
      case 3:
        if (_.indexOf(currentPreferencesList, 10) === -1) {
          newList.push(10);
        }
        break;
    }

    switch ($scope.chewyOrCrunchySlider.value) {
      case 1:
        if (_.indexOf(currentPreferencesList, 2) === -1) {
          newList.push(2);
        }
        break;
      case 2:
        if (_.indexOf(currentPreferencesList, 2) === -1) {
          newList.push(2);
        }
        if (_.indexOf(currentPreferencesList, 3) === -1) {
          newList.push(3);
        }
        break;
      case 3:
        if (_.indexOf(currentPreferencesList, 3) === -1) {
          newList.push(3);
        }
        break;
    }

    switch ($scope.mildOrSpicySlider.value) {
      case 1:
        if (_.indexOf(currentPreferencesList, 8) === -1) {
          newList.push(8);
        }
        break;
      case 2:
        if (_.indexOf(currentPreferencesList, 8) === -1) {
          newList.push(8);
        }
        if (_.indexOf(currentPreferencesList, 1) === -1) {
          newList.push(1);
        }
        break;
      case 3:
        if (_.indexOf(currentPreferencesList, 1) === -1) {
          newList.push(1);
        }
        break;
    }

    if ($scope.lowCarbSlider.value ===3) {
      if (_.indexOf(currentPreferencesList, 6) === -1) {
        newList.push(6);
      }
    }

    if ($scope.vegSlider.value !==3) {
      if (_.indexOf(currentPreferencesList, 4) === -1) {
        newList.push(4);
      }
    }

    if ($scope.organicSlider.value !==3) {
      if (_.indexOf(currentPreferencesList, 5) === -1) {
        newList.push(5);
      }
    }

    return newList;
  };


  $scope.savePref =  function () {
    console.log("Setting preferences...")
    UserGridService.getClient().getLoggedInUser(function (err, data, user) {
      if (err) {
        // Error - could not get logged in user
      } else {
        // Success - got logged in user

        // You can then get info from the user entity object:
        var uuid = user.get('uuid');

        var snackUsers = UserGridService.generateNewCollection("snackusers");

        snackUsers.qs = {ql: "select * where userGridId='" + uuid + "'"};
        snackUsers.fetch(
          function (err, data) {
            if (err) {
              console.log("Couldn't get the list of snacks.");
            } else {
              var userNeedsToBeUpdated = _.first(data.entities);
              var newPreferencesList = generatePreferencesList(userNeedsToBeUpdated.preferences);
              _.forEach(userNeedsToBeUpdated.preferences, function(item){
                newPreferencesList.push(item);
              });

              var properties = {
                client: UserGridService.getClient(),
                data: {
                  type: 'snackusers',
                  uuid: userNeedsToBeUpdated.uuid,
                  preferences: newPreferencesList
                }
              };

              var entity = new Usergrid.Entity(properties);
              entity.save(function (error, result) {

                if (error) {
                  //error
                } else {
                  //success
                  RecommendationService.generateRecommendationList();
                }
              });
            }
          });
      }
    });
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
.controller('FeedsCtrl', function($scope, BackendService, UserGridService, $ionicSlideBoxDelegate, FeedbackService, RecommendationService) {
    //RecommendationService.generateRecommendationList();
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
                        var matchingSnack = _.find(allSnacks, function(snack) { return snack.uuid === snackStatus.snackId});
                        if(matchingSnack) {
                          feedList.push(matchingSnack);
                        }
                      });
                      feedList = feedList.slice(0, 30);
                      $scope.activeSlide = 0;
                      var snackOfTheWeekStatus = _.find(_.first(data.entities).snacks, function(item) { return item.snackId === allSnacks[104].uuid; });

                      if(snackOfTheWeekStatus.like) {
                        $('#featuredLike').css('color', 'hotpink');
                      }
                      if(snackOfTheWeekStatus.dislike) {
                        $('#featuredDislike').css('color', '#00796B');
                      }
                      $scope.dataModel = {
                        snackOfTheWeek: allSnacks[104],
                        requestSnack: function() {
                          FeedbackService.updateRequest(allSnacks[49].uuid, 0)
                        },
                        requestSnackFeed: function() {
                          FeedbackService.updateRequest(feedList[$ionicSlideBoxDelegate.currentIndex()].uuid, 0);
                        },
                        recommendedList: feedList,
                        like: function($event, snack, likeId, dislikeId) {
                          $('#'+dislikeId).css('color', 'gray');
                          $('#'+likeId).css('color', 'hotpink');
                          FeedbackService.updateLike(snack.uuid);
                        },
                        dislike: function($event, snack, likeId, dislikeId) {
                          $('#'+likeId).css('color', 'gray');
                          $('#'+dislikeId).css('color', '#00796B');
                          FeedbackService.updateDislike(snack.uuid);
                        }
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

  .controller('MySnacksCtrl', function($scope, UserGridService, FeedbackService) {
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
                        var likeTable = [];
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
                            if(snackStatus.like) {
                              likeTable.push(0);
                            }
                            else if(snackStatus.dislike) {
                              likeTable.push(1);
                            }
                            else {
                              likeTable.push(2);
                            }
                          }
                        });
                        $scope.dataModel = {
                          snackStatusList: mySnacksList,
                          mySnackList: feedList,
                          likeTable: likeTable,
                          like: function(snack, likeId, dislikeId, index) {
                            likeTable[index] = 0;
                            $('#'+dislikeId).css('color', 'gray');
                            $('#'+likeId).css('color', 'hotpink');
                            FeedbackService.updateLike(snack.uuid);
                          },
                          dislike: function(snack, likeId, dislikeId, index) {
                            likeTable[index] = 1;
                            $('#'+likeId).css('color', 'gray');
                            $('#'+dislikeId).css('color', '#00796B');
                            FeedbackService.updateDislike(snack.uuid);
                          },
                          requestSnackFeed: function(index) {
                            FeedbackService.updateRequest(feedList[index].uuid, 1);
                          }
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
    FeedbackService.checkSnack('e68aea3d-49e9-11e6-a968-0242ac120004', x.uuid);
  };


  $scope.groupName = "GROUP1";

});

