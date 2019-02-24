var express = require('express');
var socket = require('socket.io');

var easyNumSet = [];
var medNumSet = [];
var hardNumSet = [];
var boost = 1;

var playerList = [];
var tempName;

for (var i = -9; i < 10; i++)
{
    easyNumSet.push(i);
    medNumSet.push(i);
}

for (var i = -99; i < 100; i++)
{
    hardNumSet.push(i);
}

var easyOpSet = ["+","-"];
var medOpSet = ["x", "+", "-", "/"];
var hardOpSet = ["x", "+", "-"];

var problem1;
var problem2;
var problem3;
var answer1;
var answer2;
var answer3;

var pSet = [];
//App Setup
var app = express();

var playerName;
var newCounter = false;

var server = app.listen(process.env.PORT, function(){
  console.log('listening on :3000');
});

var io = socket(server);

app.use(express.static("public"));
var connections = 0;

io.on("connection", function(socket)
{
    console.log("Made Socket Connection", socket.id);
    if (newCounter == true)
    {
        connections++;
        newCounter = false;
        player = {};
        player.name = tempName;
        player.id = socket.id;
        genProblem(io, socket);
        //player.problems = pSet;
        playerList.push(player);
        io.to(socket.id).emit("firstSet", player);
        //io.to(socket.id).emit("firstProblems", player);
    }

    socket.on("newPlayer", function(data)
    {
        tempName = data
        newCounter = true
        io.to(socket.id).emit("userLogin");
    });

    socket.on("newProb", function()
    {
        console.log(socket.id);
        genProblem(io, socket);
    });

    socket.on("startGameAll", function()
    {
        io.sockets.emit("startGameAll", connections);
    });

    socket.on("lifeCount", function(data){
        connections = data[0];
        var sid = data[1];
        playerList.forEach(function(person, i) {
            if (person.id == sid) {
                playerList.splice(i, 1);
                console.log(playerList);
            }

        })

        if (playerList.length == 1) {
            console.log("Winner Found!");
            io.to(playerList[0].id).emit("winner");
            playerList = [];
        } else {
            socket.emit("lifeCount", connections);
        }


    });

});

function genProblem(io, socket)
{
    pSet = [];
    var op1 =  easyNumSet[Math.floor(Math.random()*(18-0+1)+0)];
    var op2 =  easyNumSet[Math.floor(Math.random()*(18-0+1)+0)];
    var oper = easyOpSet[Math.floor(Math.random()*(1-0+1)+0)];
    if (oper == "+")
    {
        answer1 = op1 + op2;
    }

    else
    {
        answer1 = parseInt(op1) - parseInt(op2)
    }

    if (parseInt(op1) < 0)
    {
        op1 = "(" + op1 + ")";
    }

    if (parseInt(op2) < 0)
    {
        op2 = "(" + op2 + ")";
    }

    problem1 = op1 + " " + oper + " " + op2;




    var op1 =  medNumSet[Math.floor(Math.random()*(18-0+1)+0)];
    var op2 =  medNumSet[Math.floor(Math.random()*(18-0+1)+0)];

    var oper = medOpSet[Math.floor(Math.random()*(3-0+1)+0)];

    if (oper == "X")
    {
        answer2 = parseInt(op1) * parseInt(op2);
        if (Math.abs(answer2) == 0)
        {
            answer2 = 0;
        }
    }

    else if (oper == "+")
    {
        answer2 = parseInt(op1) + parseInt(op2);
    }

    else if (oper == "-")
    {
        answer2 = parseInt(op1) - parseInt(op2)
    }

    else
    {
        answer2 = parseInt(op1) / parseInt(op2);
        while (answer2 != Math.ceil(answer2) || op2 == "0")
        {
            var op1 =  medNumSet[Math.floor(Math.random()*(18-0+1)+0)];
            var op2 =  medNumSet[Math.floor(Math.random()*(18-0+1)+0)];
            answer2 = parseInt(op1) / parseInt(op2);
        }
        if (Math.abs(answer2) == 0)
        {
            answer2 = 0;
        }

    }
    if (parseInt(op1) < 0)
    {
        op1 = "(" + op1 + ")";
    }

    if (parseInt(op2) < 0)
    {
        op2 = "(" + op2 + ")";
    }

    problem2 = op1 + " " + oper + " " + op2;


    var op1 =  hardNumSet[Math.floor(Math.random()*(198-0+1)+0)];
    var op2 =  hardNumSet[Math.floor(Math.random()*(198-0+1)+0)];
    var oper = hardOpSet[Math.floor(Math.random()*(2-0+1)+0)];

    if (oper == "X")
    {
        answer3 = parseInt(op1) * parseInt(op2);
    }

    else if (oper == "+")
    {
        answer3 = parseInt(op1) + parseInt(op2);
    }

    else if (oper == "-")
    {
        answer3 = parseInt(op1) - parseInt(op2)
    }

    if (parseInt(op1) < 0)
    {
        op1 = "(" + op1 + ")";
    }

    if (parseInt(op2) < 0)
    {
        op2 = "(" + op2 + ")";
    }

    problem3 = op1 + " " + oper + " " + op2;


    pSet.push(problem1, answer1, problem2, answer2, problem3, answer3);
    console.log(pSet);
    io.to(socket.id).emit("newProblems", pSet);
}
