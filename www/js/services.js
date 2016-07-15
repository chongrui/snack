/*
 DeepBlue Starter Kit - version 1.1
 Copyright (c) 2015 INMAGIK SRL - www.inmagik.com
 All rights reserved
 written by Mauro Bianchi
 bianchimro@gmail.com

 file: services.js
 description: this file contains all services of the DeepBlue app.
 */


angular.module('deepBlue.services', [])

  // CartService is an example of service using localStorage
  // to persist items of the cart.
  .factory('CartService', [function () {

    var svc = {};

    svc.saveCart = function(cart){
      window.localStorage.setItem('cart', JSON.stringify(cart));
    };

    svc.loadCart = function(){
      var cart = window.localStorage.getItem('cart');
      if(!cart){
        return { products : [ ] }
      }
      return JSON.parse(cart);
    };

    svc.resetCart = function(){
      var cart =  { products : [ ] };
      svc.saveCart(cart);
      return cart;
    };

    svc.getTotal = function(cart){
      var out = 0;
      if(!cart || !cart.products || !angular.isArray(cart.products)){
        return out;
      }
      for(var i=0; i < cart.products.length; i++){
        out += cart.products[i].price;
      }
      return out;
    }

    return svc;

  }])

  // #SIMPLIFIED-IMPLEMENTATION
  // This is an example if backend service using $http to get
  // data from files.
  // In this example, files are shipped with the application, so
  // they are static and cannot change unless you deploy an application update
  // Other possible implementations (not covered by this kit) include:
  // - loading dynamically json files from the web
  // - calling a web service to fetch data dinamically
  // in those cases be sure to handle url whitelisting (specially in android)
  // (https://cordova.apache.org/docs/en/5.0.0/guide_appdev_whitelist_index.md.html)
  // and handle network errors in your interface
  .factory('BackendService', ['$http', function ($http) {

    var svc = {};

    svc.getFeeds = function(){
      return $http.get('sampledata/feeds.json');
    }

    svc.getProducts = function(){
      return $http.get('sampledata/products.json');
    }

    return svc;
  }])

  .factory('UserGridService', function() {
    var client = new Usergrid.Client({
      URI:'http://10.1.176.240:8080',
      orgName:'org',
      appName:'sandbox',
      logging: true, // Optional - turn on logging, off by default
      buildCurl: true // Optional - turn on curl commands, off by default
    });

    function generateNewCollectionHelper (collectionType) {
      return new Usergrid.Collection({client: client, "type":collectionType});
    }

    return {
      generateNewCollection: function (newCollectionType) {
        return generateNewCollectionHelper (newCollectionType);
      },
      getCurrentUser: function () {
        return client.getCurrentUser();
      },
      getClient: function () {
        return client;
      }
    };
  })

  .factory('FeedbackService', function(UserGridService) {
    function calculateScore(snackPreferences, userPreferences) {
      var score = 0;
      if(snackPreferences) {
        _.each(snackPreferences, function (snackPreference) {
          if (_.indexOf(userPreferences, snackPreference) > -1) {
            score++;
          }
        });
      }
      return score;
    }
    function updateSnackGroup(snackGroups, snackId, addToRequest) {
      _.each(snackGroups, function(groupId) {

        var groups = UserGridService.generateNewCollection("snackgroups");

        groups.qs = {ql: "select * where uuid='" + groupId + "'"};
        groups.fetch(
          function (err, data) {
            var snackGroup = _.first(data.entities);
            var snackItem = _.find(snackGroup.requestedSnacks, function(snack) { return snackId === snack.id; });
            var purchasedSnackItem = _.find(snackGroup.purchasedSnacks, function(snack) { return snackId === snack.id; });
            if(purchasedSnackItem) {
              if(addToRequest) {
                purchasedSnackItem.numOfRequested = purchasedSnackItem.numOfRequested++;
              }
              else {
                purchasedSnackItem.numOfRequested = purchasedSnackItem.numOfRequested--;
                if(purchasedSnackItem.numOfRequested === 0) {
                  _.remove(snackGroup.purchasedSnacks, function(snack) { return snackId === snack.id; });
                }
              }
            }
            else if(snackItem) {
              if(addToRequest) {
                snackItem.numOfRequested = snackItem.numOfRequested++;
              }
              else {
                snackItem.numOfRequested = snackItem.numOfRequested--;
                if(snackItem.numOfRequested === 0) {
                  _.remove(snackGroup.requestedSnacks, function(snack) { return snackId === snack.id; });
                }
              }
            }
            else {
              var requestedSnack = {
                id: snackId,
                numOfRequested: 1
              };
              snackGroup.requestedSnacks.push(requestedSnack);
            }

            var properties = {
              client: UserGridService.getClient(),
              data: {
                type: 'snackgroups',
                uuid: groupId,
                purchasedSnacks: snackGroup.purchasedSnacks,
                requestedSnacks: snackGroup.requestedSnacks
              }
            };

            var entity = new Usergrid.Entity(properties);
            entity.save(function (error, result) {

              if (error) {
                //error
              } else {
                //success
              }
            });
          }
        );
      });
    }
    return {
      updateRequest: function(snackId, removable) {
        UserGridService.getClient().getLoggedInUser(function(err, data, user) {
          if(err) {
            // Error - could not get logged in user
          } else {
            // Success - got logged in user

            // You can then get info from the user entity object:
            var uuid = user.get('uuid');

            var snacks = UserGridService.generateNewCollection("snackusers");

            snacks.qs = {ql: "select * where userGridId='" + uuid + "'"};
            snacks.fetch(
              function (err, data) {
                if (err) {
                  console.log("Couldn't get the list of snacks.");
                } else {
                  var userSnacks = _.first(data.entities);
                  var snack = _.find(userSnacks.snacks, function(snack) { return snack.uuid === snackId; });
                  if(snack) {
                    if(snack.requested === 1 && !removable) {
                      return;
                    }
                    snack.requested = snack.requested === 1 ? 0 : 1;
                    var properties = {
                      client: UserGridService.getClient(),
                      data: {
                        type: 'snackusers',
                        uuid: userSnacks.uuid,
                        snacks: userSnacks.snacks
                      }
                    };

                    var entity = new Usergrid.Entity(properties);
                    entity.save(function (error, result) {

                      if (error) {
                        //error
                      } else {
                        //success
                      }
                    });
                    updateSnackGroup(userSnacks.snackGroups, snackId, snack.requested)
                  }
                  else {
                    var snacks = UserGridService.generateNewCollection("snacks");

                    snacks.qs = {ql: "select * where uuid='" + snackId + "'"};
                    snacks.fetch(
                      function (err, data) {
                        var score = calculateScore(_.first(data.entities).preferences, userSnacks.preferences);
                        var snackItem = {
                          like: 0,
                          dislike: 0,
                          requested: 1,
                          snackId: snackId,
                          score: score
                        };
                        if(!userSnacks.snacks) {
                          userSnacks.snacks = [snackItem];
                        }
                        else {
                          userSnacks.snacks.push(snackItem);
                        }
                        var properties = {
                          client: UserGridService.getClient(),
                          data: {
                            type: 'snackusers',
                            uuid: userSnacks.uuid,
                            snacks: userSnacks.snacks
                          }
                        };

                        var entity = new Usergrid.Entity(properties);
                        entity.save(function (error, result) {

                          if (error) {
                            //error
                          } else {
                            //success
                          }
                        });
                        updateSnackGroup(userSnacks.snackGroups, snackId, 1)
                      }
                  );
                  }
                }
              }
            );
          }
        });
      }
    }
  })
  .factory('RecommendationService', function (UserGridService) {
    function calculateScore(snackPreferences, userPreferences) {
      var score = 0;
      if(snackPreferences) {
        _.each(snackPreferences, function (snackPreference) {
          if (_.indexOf(userPreferences, snackPreference) > -1) {
            score++;
          }
        });
      }
      return score;
    }

    return {
      generateRecommendationList: function () {

        var recommendedList = [];
        var snackUser;
        //Get preference table from userId
        var userUuid = '6e75d074-49bd-11e6-a968-0242ac120004';
        snackUser = UserGridService.generateNewCollection('snackusers');

        snackUser.qs = {ql: 'select * where userGridId=\'' + userUuid + '\''};
        snackUser.fetch(function(err, data) {
          var snackUser = _.first(data.entities);
          var snacks = UserGridService.generateNewCollection('snacks')
          snacks.qs = {limit:1000};
          snacks.fetch(function (err, data) {

            snacks = data.entities;
            if (!snackUser || !snackUser.snacks) {
              //Get all snacks with filters
              _.each(snacks, function (snack) {
                var score = calculateScore(snack.preferences, snackUser.preferences);
                var snackItem = {
                  like: 0,
                  dislike: 0,
                  requested: 0,
                  snackId: snack.uuid,
                  score: score
                };

                recommendedList.push(snackItem);
              });
            }
            else {
              _.each(snackUser.snacks, function (snackStatus) {
                var snack = _.find(snacks, function (item) {
                  return snackStatus.snackId === item.uuid
                });
                snackStatus.score = calculateScore(snack.preferences, snackUser.preferences);
              });
              recommendedList = snackUser.snacks;
            }
            var properties = {
              client: UserGridService.getClient(),
              data: {
                type: 'snackusers',
                uuid: snackUser.uuid,
                snacks: recommendedList
              }
            };

            var entity = new Usergrid.Entity(properties);
            entity.save(function (error, result) {

              if (error) {
                //error
              } else {
                //success
              }
            });
          });
        });
      }
    }
  })

  .factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function() {
        return chats;
      },
      remove: function(chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });
