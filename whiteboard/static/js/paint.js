$(document).ready(function () {
    // display a warning message if canvas is not supported
    if (!Modernizr.canvas) {
        $("#message").html("<p><b>WARNING</b>: Your browser does not support HTML5's canvas feature, you won't be able to see the drawings below</p>");
        $("article").hide();
    } else {
        initialize();
    }

    function initialize() {
        var imagesLoaded = $(document).toObservable("images-loaded");
        var cursorsLoaded = $(document).toObservable("cursors-loaded");

        // fade out the splash panel when images and cursors are loaded
        imagesLoaded
            .Zip(cursorsLoaded, function (left, right) { return right; })
            .Delay(1000)
            .Subscribe(function () {
                $("#splash").fadeOut("slow");
            });

        // initialize the canvas
        initializeCanvas();

        // load the images
        loadImages();
    }

    function loadImages() {
        var images = ["/whiteboard/static/images/tools_panel_colour_picker_button.png",
                      "/whiteboard/static/images/tools_panel_delete_button.png",
                      "/whiteboard/static/images/tools_panel_eraser_button.png",
                      "/whiteboard/static/images/tools_panel_paint_button.png",
                      "/whiteboard/static/images/tools_panel_pencil_button.png",
                      "/whiteboard/static/images/tools_panel_spray_button.png"],
            cursors = ["/whiteboard/static/cursors/colour_picker_cursor.cur",
                       "/whiteboard/static/cursors/eraser_cursor.cur",
                       "/whiteboard/static/cursors/paint_cursor.cur",
                       "/whiteboard/static/cursors/pencil_cursor.cur",
                       "/whiteboard/static/cursors/spray_cursor.cur"];

        // fire the images-loaded event when all images are loaded
        Asset.images(images, {
            onComplete: function () {
                $(document).trigger("images-loaded");
            }
        });

        // fire the cursors-loaded event when all cursors are loaded
        Asset.images(cursors, {
            onComplete: function () {
                $(document).trigger("cursors-loaded");
            }
        });
    }
});
