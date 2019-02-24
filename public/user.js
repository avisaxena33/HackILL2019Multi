var socket = io.connect("http://localhost:3000");
var nametag;
var sub1;
var sub2;
var sub3;
var ques1;
var ques2;
var ques3;
var pSet;
var ans1;
var ans2;
var ans3;
var right;
var starter;
//will move to game.js once I figure it out

var health = 100; //starting healthbar
var count = -5;   //head start that player gets
var point = 0;   //points accumulated by player starts at 0
var hard = 8;     //hard problem value
var medium = 5;    //medium problem value
var easy = 3;      //easy problem value
var speed = 0.1;   //base speed, 0.1 increase per tenth of a second
var speed_multiplier = 1.5; //speed increase multiplier
var damage_multiplier = 1.5; //damage modifier
var damage_tick = 1;       //base damage at beginning of the game
var zone_freq = 20;        //speed up / damage increase frequency in seconds and runtime
var zone = 1;              // zone number
var boost = 1;
var boostModifier = .5;
var connections;
//countdown();

document.addEventListener("DOMContentLoaded", function()
{
    nametag = document.getElementById("namebar");
    sub1 = document.getElementById("submit1");
    sub2 = document.getElementById("submit2");
    sub3 = document.getElementById("submit3");
    ques1 = document.getElementById("q1");
    ques2 = document.getElementById("q2");
    ques3 = document.getElementById("q3");
    starter = document.getElementById("start");

    sub1.addEventListener("click", function(e)
    {
        checker();
        e.preventDefault();
    });

    sub2.addEventListener("click", function(e)
    {
        checker2();
        e.preventDefault();
    });

    sub3.addEventListener("click", function(e)
    {
        checker3();
        e.preventDefault();
    });

    starter.addEventListener("click", function(e)
    {
        e.preventDefault();
        socket.emit("startGameAll");
    });
});

socket.on("firstSet", function(data)
{
    nametag.innerHTML = "Hello " + data.name + "!";
});

socket.on("firstProblems", function(data)
{
    pSet = data.problems.slice();
    ques1.innerHTML = pSet[0];
    ques2.innerHTML = pSet[2];
    ques3.innerHTML = pSet[4];
});

socket.on("newProblems", function(data)
{
    pSet = data.slice();
    ques1.innerHTML = pSet[0];
    ques2.innerHTML = pSet[2];
    ques3.innerHTML = pSet[4];
    ans1 = document.getElementById("answer1").value = "";
    ans2 = document.getElementById("answer2").value = "";
    ans3 = document.getElementById("answer3").value = "";

});

socket.on("startGameAll", function(data)
{
    connections = data;
    countdown();
});

socket.on("lifeCount", function(data)
{
    connections = data;
});

socket.on("winner", function() {
    document.location.href ="win.html";
});

function checker()
{
    ans1 = parseInt(document.getElementById("answer1").value);




    if (!(ans1 == "" || ans1.length == 0 || ans1 == null))
    {
        if (ans1 == pSet[1])
        {
            right = true;
            if(boost != 3)
            {
                boost += boostModifier;
            }
            point = point + (easy*boost);
        }

        else
        {
            right = false;
            boost = 1;
            point = point - Math.ceil(easy);
            health = health - easy;

        }
    }


    if (right == true)
    {
        console.log("you got it correct!");
    }

    else if (right == false)
    {
        console.log("you got it wrong!");
    }


    newProblems();
}
function checker2()
{
ans2 = parseInt(document.getElementById("answer2").value);
if(!(ans2 == "" || ans2.length == 0 || ans2 == null))
{
    if (ans2 == pSet[3])
    {
        right = true;
        if(boost != 3)
        {
            boost += boostModifier;
        }
        point = point + (medium*boost);
    }

    else
    {
        right = false;
        boost = 1;
        point = point - Math.ceil(medium/2);
        health = health - medium;
    }
}
if (right == true)
{
    console.log("you got it correct!");
}

else if (right == false)
{
    console.log("you got it wrong!");
}

    newProblems();
}

function checker3()
{
    ans3 = parseInt(document.getElementById("answer3").value);
    if (!(ans3 == "" || ans3.length == 0 || ans3 == null))
    {
        if(ans3 == pSet[5])
        {
            right = true;
            if(boost != 3)
            {
                boost += boostModifier;
            }
            point = point + (hard*boost);
        }

        else
        {
            right = false;
            boost = 1;
            point = point - Math.ceil(hard/2);
            health = health - hard;
        }
    }
    if (right == true)
    {
        console.log("you got it correct!");
    }

    else if (right == false)
    {
        console.log("you got it wrong!");
    }


    newProblems();
}

function newProblems()
{
    console.log(boost);
    socket.emit("newProb", socket.id);
}

function updateName(newname) {
  document.getElementById('namebar').innerHTML = "Hello " + newname;
}


function sethealth(percent) {
  health = percent;
}

function setcount(percent) {
  count = percent;
}

function setpoint(percent) {
  point = percent;
}

var in_zone = 0;
function updateUser() {
  if(count > point){
    if(in_zone >= 15){
      health = health - Math.ceil(damage_tick*Math.pow(damage_multiplier, zone));
      in_zone = 0;
    }else{
      in_zone++;
    }
  }
  if(health < 0){
    health = 0;
    connections--;
    var dataarr = [];
    dataarr.push(connections, socket.id);
    socket.emit("lifeCount", dataarr);
    document.location.href = 'lose.html';
  }
  $('#healthbar1').width(health +"%");
  $('#healthbar1').html(health +" \\ 100 HP");
  $('#points').width(point + "%");
  $('#points').html("Points: " + point + "");
}

function updateTime() {
  $('#timer').width(count+"%");
  $('#timer').html("Zone: " + Math.ceil(count + 1) +"");
}

function updateCount() {
  var trueSpeed = speed*Math.pow(speed_multiplier, zone);
  count = count + trueSpeed;
  calculateAI();
}
function zoneTimer() {
  if(count < 0){
    document.getElementById('zone').innerHTML = "Circle is closing: " + (Math.floor(z));
  }else{
    if(!rest){
      var t = (Math.ceil(zone_freq - y - 0.5));
      if(t <= 0){
        t = 0;
      }
      document.getElementById('zone').innerHTML = "Circle is closing: " + (t - 1);
    }else if(rest){
      var t = (zone_timer - (Math.ceil(y)));
      if(t <= 0){
        t = 0;
      }
      document.getElementById('zone').innerHTML = "Circle is going to close in: " + t;
    }
  }
}
var zone_timer = zone_freq/2;
var z = zone_freq - count;
var y = 1; //couldn't figure out a better way to count
var rest = false;
var maxvalue = 10;
function countdown() {

  //$('#points').attr("aria-valuemax", maxvalue +"");
//  $('#timer').attr("aria-valuemax", maxvalue +"");
  var x = setInterval(function() {
    if(y >= Math.floor(zone_freq/2)){
      rest = false;
    }
    if(!rest){
      updateCount();
    }
    if(count > 0)
    {
      updateTime();
      if(Math.ceil(y) % zone_freq == 0){
        zone = zone + 1;
        y = 1;
        rest = true;
        zoneTimer();
      }
      y = y + 0.1;
    }else{
      $('#timer').width(0);
      $('#timer').html("Zone: " + 0 + "");
    }
    zoneTimer();
    if(zone == 1){
      z = z - 0.1;
    }
    updateUser();
    //will add win condition where you beat an AI
    //couldn't find how to change the max size of progress Bar
    //if you could modify the max size of the progress that'd be great!
    if(health <= 0){
        clearInterval(x);
        console.log("You lose!");
    }
  }, 100);
}


function calculateAI() {
  var delta = point - count;
  var totalplayers = 100 - count;
  var behind = Math.max((0.01*delta + 0.5)*totalplayers,0);
  var ahead = Math.max(totalplayers - behind, 0);
  $('#pbehind').html("Players Behind: " + Math.floor(behind));
  $('#pahead').html("Players Ahead: " + Math.floor(ahead));
}
