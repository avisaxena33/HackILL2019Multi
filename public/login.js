var socket = io()
console.log("js file loaded");
var name;

document.addEventListener("DOMContentLoaded", function()
{
    var subname = document.getElementById("subname");


    subname.addEventListener("click", function()
    {
        name = document.getElementById("name").value;
        enterName();
    });


});

function enterName()
{
    socket.emit("newPlayer", name);
}

socket.on("userLogin", function()
{
    document.location.href = "game.html";
});
