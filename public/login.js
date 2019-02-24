var socket = io.connect("http://localhost:3000");
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
    console.log("entered entername func");
    socket.emit("newPlayer", name);
    setTimeout(broo, 2000);
    function broo()
    {
        document.location.href = "game.html";
    }
}
