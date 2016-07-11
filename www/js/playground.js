var users = {"a": [1,2,3], "b":[1,2,4], "c":[5], "d":[1,2,4]};

function getPriorityList(users, listCount) {
    var firstInvList;
    var priorityList = [];

    //iterative method to find the suggested snack list
    for (var i = 0; i < listCount; i++)  {
        //edge case if there are no users left (i.e. all users have their preferred snack)
        if (Object.keys(users).length === 0)  {
            return priorityList.concat(addMostRequestedSnacks(priorityList, listCount-i, firstInvList));
        }
        //gets list of users that prefer a certain snack
        var invList = invertPreferenceDict(users);
        //edge case to check if there are less snacks than in listCount
        if (i === 0)  {
            firstInvList = invList;
            if (!validateInvSize(listCount,firstInvList))  {
                return Object.keys(firstInvList);
            }
        }
        //gets most popular snack out of users listed
        var snack = maxKey(invList);
        priorityList.push(snack);

        //removes users who already got the snack
        var satisfiedUsers = invList[snack];
        for (var j = 0; j < satisfiedUsers.length; j++)  {
            delete users[satisfiedUsers[j]];
        }
    }
    return priorityList;
}

function invertPreferenceDict(users)  {
    var invDict = {};
    for (var user in users)  {
        var snacks = users[user];
        for (var i in snacks)  {
            if (snacks[i] in invDict)  {
                invDict[snacks[i]].push([user]);
            } else  {
                invDict[snacks[i]]=[user];
            }
        }
    }
    return invDict;
}

function validateInvSize(listCount, snackList)  {
    return listCount < Object.keys(snackList).length;
}

function maxKey (invList)  {
    return Object.keys(invList).reduce(function(a, b)  {
        return invList[a].length > invList[b].length ? a : b;
    });
}

function addMostRequestedSnacks(priorityList, count, firstInvList)  {
    var snackList = [];
    while (snackList.length < count)  {
        var snack = maxKey(firstInvList);
        if (priorityList.indexOf(snack) === -1)  {
            snackList.push(snack);
        }
        delete firstInvList[snack];
    }
    return snackList;
}
