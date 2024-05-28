$(document).ready(function(){
    const colors = ["yellow", "blue", "red", "green", "black", "grey"];
    $(".button").mouseenter(function(){
      $(this).css("background-color", colors[parseInt(this.id) - 1]);
    });

    $(".button").mouseout(function(){
        $(this).css("background-color", "white");
      });
});
