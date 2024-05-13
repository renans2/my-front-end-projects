
$(".toggle").on("mouseenter", function(){
    $(".toggle").css("filter", "brightness(500%)");
});

$(".toggle").on("mouseleave", function(){
    $(".toggle").css("filter", "contrast(100%)");
});
