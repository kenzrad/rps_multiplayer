// var rps = {
//     [ name: "rock";
//  ]
// }


// Initialize Firebase
var config = {
    apiKey: "AIzaSyD6voO2yfhl8iAAjbTQe0k9ILZZzfyTAlI",
    authDomain: "fir-intro-91948.firebaseapp.com",
    databaseURL: "https://fir-intro-91948.firebaseio.com",
    projectId: "fir-intro-91948",
    storageBucket: "fir-intro-91948.appspot.com",
    messagingSenderId: "741989939003"
};

firebase.initializeApp(config);
  
var dataRef = firebase.database();

//////////USER INITIATION/////////////

var userName = ""; //local user
var userNameSelected = false; //this will stay local
var message = ""; //local users message
  
$("#user-name-btn").on("click", function(event) {
    event.preventDefault();
    if (userNameSelected === false) {
        userNameSelected = true;
        userName = $("#user-name").val().trim();
        $("#user-name").val("");
        dataRef.ref().push({
            userName: userName,
            dateAdded: firebase.database.ServerValue.TIMESTAMP //timestamp so we can chose the 1st and 2nd player; also track messages
        });
        if ((playerOneName === false) && (playerTwoName === false)) {
            playerOne = userName;
            playerOneName = true;
        }
        else if ((playerOneName === true) && (playerTwoName === false)) {
            playerTwo = userName;
            playerTwoName = true;
        }
        else {
            console.log("No more players needed!")
        }
    }
    else {
        console.log(`Your user name is already ${userName}, deal with it!`)
    }
    
});

//player one
var playerOne = null;
var playerOneWins = 0;
var playerOneLosses = 0;
var playerOneTies = 0
var playerOneName = false; //to see if player exists
var playerOneChoice = false; //to see if player has selected something
var playerOneSelection = "";

//player two
var playerTwo = null;
var playerTwoWins = 0;
var playerTwoLosses = 0;
var playerTwoTies = 0;
var playerTwoName = false;
var playerTwoChoice = false;
var playerTwoSelection = "";

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
dataRef.ref().on("child_added", function(childSnapshot) {
  
    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().userName);
    console.log(childSnapshot.val().joinDate);

    // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
});

//need to change to respect player
dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    // Change the HTML to reflect
    $("#local-user-name").text(snapshot.val().userName);   
    if(playerOneName === false) {
        $("#player-one-name").text(snapshot.val().userName);
    }
    else if (playerOneName) {
        $("#player-two-name").text(snapshot.val().userName);
    }
    else {
        console.log("no new names needed")
    }
});

/////////////////////ITS GAME TIME/////////////////////////

//If both players exist in the game, then we can do this shit
if ((playerOneName) && (playerTwoName)) {
    gameOn();
}

var gameOn = function() {

$(".game-button").on("click", function(event) {

    ///record choice to playerOne if you are player one
    if( userName === playerOne) {
        playerOneSelection = $(".game-button").val();
        playerOneChoice = true;
        appendChoice(playerOneSelection);
        dataRef.ref().push({
            playerOneSelection,
        });
        
    }
    ///record choice to playerTwo if you are playerTwo
    else if ( userName === playerTwo) {
        playerTwoSelection = $(".game-button").val();
        playerTwoChoice = true;
        appendChoice(playerTwoSelection);
        dataRef.ref().push({
            playerOneSelection,
        });
    }

});

///Append the selection to the selection div 
var appendChoice = function(selection) {
    ///display only the users choice
    ////once both exists, display both
}

//if player one and player two have chosen (true)
if ((playerOneChoice) && (playerTwoChoice)) {
    if ((playerOneSelection === "r" && playerTwoSelection === "s") ||
        (playerOneSelection === "s" && playerTwoSelection === "p") || 
        (playerOneSelection === "p" && playerTwoSelection === "r")) {
        playerOneWins++;
        playerTwoLosses++;
    } else if (playerOneSelection === playerTwoSelection) {
        playerOneTies++;
        playerTwoTies++;
    } else {
        playerTwoWins++;
        playerOneLosses++;
    }
};
}

//////////////////////WE ARE THE WATCHERS/////////////////////////////

// Link to Firebase Database for viewer tracking
var connectionsRef = dataRef.ref("/connections");
var connectedRef = dataRef.ref(".info/connected");

connectedRef.on("value", function(snap) {
  if (snap.val()) {
    // Add ourselves to presence list when online.
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }

  // Number of online users is the number of objects in the presence list.
  connectionsRef.on("value", function(snapshot) {
    
    if (snapshot.numChildren() > 1) {
      $("#connected-viewers").html(`Littles Orcsees: <strong>${snapshot.numChildren()} </strong>`);
    }
    else {
      $("#connected-viewers").text(`Nobody cares for the woods anymore`);
    }
  })
})


/////////////////////FEELING CHATTY/////////////////////////////