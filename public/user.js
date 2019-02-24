var socket = io();
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
var hard = 3;     //hard problem value
var medium = 2.5;    //medium problem value
var easy = 1.5;      //easy problem value
var speed = 0.15;   //base speed, 0.1 increase per tenth of a second
var speed_multiplier = 1.5; //speed increase multiplier
var damage_multiplier = 2.5; //damage modifier
var damage_tick = 1;       //base damage at beginning of the game
var zone_freq = 12;        //speed up / damage increase frequency in seconds and runtime
var zone = 1;              // zone number
var boost = 1;
var boostModifier = .25;
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
        sub1.disabled = true;
    });

    sub2.addEventListener("click", function(e)
    {
        checker2();
        e.preventDefault();
        sub2.disabled = true;
    });

    sub3.addEventListener("click", function(e)
    {
        checker3();
        e.preventDefault();
        sub3.disabled = true;
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

/*socket.on("firstProblems", function(data)
{
    pSet = data.problems.slice();
    ques1.innerHTML = pSet[0];
    ques2.innerHTML = pSet[2];
    ques3.innerHTML = pSet[4];
});*/

socket.on("newProblems", function(data)
{
    pSet = data.slice();
    ques1.innerHTML = pSet[0];
    ques2.innerHTML = pSet[2];
    ques3.innerHTML = pSet[4];
    ans1 = document.getElementById("answer1").value = "";
    ans2 = document.getElementById("answer2").value = "";
    ans3 = document.getElementById("answer3").value = "";
    sub1.disabled = false;
    sub2.disabled = false;
    sub3.disabled = false;
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
            if(giveloot == 1){
            selectloot(Math.floor(Math.random()*4))
            }
            if(boost != 2)
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
        document.getElementById("card1").style.background = "white";
        document.getElementById("card2").style.background = "white";
        document.getElementById("card3").style.background = "white";
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
        if(giveloot == 2){
          selectloot(Math.floor(Math.random()*4))
        }
        if(boost != 2)
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
    document.getElementById("card1").style.background = "white";
    document.getElementById("card2").style.background = "white";
    document.getElementById("card3").style.background = "white";
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
            if(giveloot == 3){
              selectloot(Math.floor(Math.random()*4))
            }
            if(boost != 2)
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
        document.getElementById("card1").style.background = "white";
        document.getElementById("card2").style.background = "white";
        document.getElementById("card3").style.background = "white";
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
  var lootchooser = Math.floor(Math.random() * 50);
  if(lootchooser == 5){
    setloot(1);
  }else if(lootchooser > 10 && lootchooser < 17){
    setloot(2);
  }else if(lootchooser > 37){
    setloot(3);
  }
  console.log(lootchooser);
  socket.emit("newProb");
}

function updateName(newname) {
  document.getElementById('namebar').innerHTML = "Hello " + newname;
}

var giveloot = 0;
function selectloot(thing){
  if(thing == 1){
    c1++;
    document.getElementById("item1").innerHTML = "Health Pack: " + c1;
  }else if(thing == 2){
    c2++;
    document.getElementById("item2").innerHTML = "Enlarge Circle: " + c2;
  }else if(thing == 3){
    c3++;
    document.getElementById("item3").innerHTML = "Booster: " + c3;
  }else{
    c4++;
    document.getElementById("item4").innerHTML = "Scramble: " + c4;
  }
}
function setloot(question){
  if(question == 1){
    document.getElementById("card1").style.background = "purple";
    giveloot = 1;
  }else if(question == 2){
    document.getElementById("card2").style.background = "purple";
    giveloot = 2;
  }else if(question == 3){
    document.getElementById("card3").style.background = "purple";
    giveloot = 3;
  }
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
  var totalplayers = Math.min(100 - count, 100);
  var behind = Math.max((0.01*delta + 0.5)*totalplayers,totalplayers);
  var ahead = Math.max(totalplayers - behind, 0);
  $('#pbehind').html("Players Behind: " + Math.floor(behind));
  $('#pahead').html("Players Ahead: " + Math.floor(ahead));
}


var c1 = 1;
var c2 = 1;
var c3 = 1;
var c4 = 1;
document.addEventListener("DOMContentLoaded", function()
{
    i1 = document.getElementById("item1");
    i2 = document.getElementById("item2");
    i3 = document.getElementById("item3");
    i4 = document.getElementById("item4");
    document.getElementById("item1").innerHTML = "Health Pack: " + c1;
    document.getElementById("item2").innerHTML = "Enlarge Circle: " + c2;
    document.getElementById("item3").innerHTML = "Booster: " + c3;
    document.getElementById("item4").innerHTML = "Scramble: " + c4;
    i1.addEventListener("click", function(e)
    {
      if(c1 > 0){
        sethealth(health + 20);
        e.preventDefault();
        c1--;
        document.getElementById("item1").innerHTML = "Health Pack: " + c1;
      }
    });

    i2.addEventListener("click", function(e)
    {
      if(c2 > 0){
        count = count - 10;
        e.preventDefault();
        c2--;
        document.getElementById("item2").innerHTML = "Enlarge Circle: " + c2;
      }

    });

    i3.addEventListener("click", function(e)
    {
      if(c3 > 0){
        boost = 2;
        e.preventDefault();
        c3--;
        document.getElementById("item3").innerHTML = "Booster: " + c3;
      }
    });

    i4.addEventListener("click", function(e)
    {
      if(c4 > 0){
        newProblems();
        e.preventDefault();
        c4--;
        document.getElementById("item4").innerHTML = "Scramble: " + c4;
      }
    });
});
