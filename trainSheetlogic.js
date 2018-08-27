// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the minutes till arrival. Using difference between next arrival and current time.
//    Then use moment.js formatting to set difference in minutes.
// 5. Calculate-- N/A.

var config = {
  apiKey: "AIzaSyB8Hl0wvOgYZzc3VZBSjW6u7c2O68u6sB0",
  authDomain: "mattsproject-10951.firebaseapp.com",
  databaseURL: "https://mattsproject-10951.firebaseio.com",
  projectId: "mattsproject-10951",
  storageBucket: "mattsproject-10951.appspot.com",
  messagingSenderId: "733266563793"
};


firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#dest-input").val().trim();
  var trainTime = moment($("#start-input").val().trim(), "hh:mm:ss").format("hh:mm:ss");
  var trainFreq = $("#freq-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDest,
    start: trainTime,
    frequency: trainFreq
  };

  // Uploads Train data to the database
  database.ref().push(newTrain);

  //Logs everything to console
  // console.log(newTrain.name);
  // console.log(newTrain.destination);
  // console.log(newTrain.start);
  // console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("#start-input").val("");
  $("#freq-input").val("");
});

// 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (trainSnapshot) {
  console.log(trainSnapshot.val());

  // Store everything into a variable.
  var trainName = trainSnapshot.val().name;
  var trainDest = trainSnapshot.val().destination;
  var trainStart = trainSnapshot.val().start;
  var trainFreq = trainSnapshot.val().frequency;
  //var trainNext = trainSnapshot.val().next;

  // Train Info
  // console.log(trainName);
  // console.log(trainDest);
  // console.log(trainStart);
  // console.log(trainFreq);

  //var trainArrivalTime = moment(trainStart, "hh:mm:ss").format("hh:mm:ss");
  //var minsAway = moment(trainArrivalTime).diff(moment([]),"m");

  //var tFrequency = newTrain.frequency;
  console.log("tFrequency:  " + trainFreq);

  var firstTimeConverted = moment(trainStart, "hh:mm:ss").subtract(1, "years");
  console.log(firstTimeConverted);
  //Current time
  var currentTime = moment();
  console.log("Current Time:  " + moment(currentTime).format("hh:mm:ss"));

  //Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("Difference in time:  " + diffTime);

  //Time apart (remainder)
  var tRemainder = diffTime % trainFreq;
  console.log(tRemainder);

  //Minute until train
  var tMinutesTillTrain = trainFreq - tRemainder;
  console.log("Minutes till train:  " + tMinutesTillTrain);

  //Next train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("Arrival time:  " + moment(nextTrain).format("hh:mm"));

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(trainFreq),
    $("<td>").text(trainStart),
    $("<td>").text(nextTrain)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
}, function (errorObject) {
  console.log("The read failed:  " + errorObject.code);
});


