window.onload = function() {
    var canvasCtrl = new CanvasController();
    var board = new T3Board(canvasCtrl);

    canvasCtrl.subscribeDrawEvent(function (canvasContext) {
        var logoImg = new Image;
        logoImg.onload = function() {
            canvasContext.drawImage(logoImg, 0, 0);
        };
        logoImg.src = 'assets/logo.png';
    });

    canvasCtrl.drawCanvas();
};
