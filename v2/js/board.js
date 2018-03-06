function T3Board(canvasController) {
    this.canvasController = canvasController;
    this.configuration = {};
    this.boardInformation = [];

    this.crossImage = new Image;
    this.circleImage = new Image;
    this.crossImage.src = 'assets/cross.svg';
    this.circleImage.src = 'assets/circle.svg';

    // Init board information
    for (var row = 0; row < 3; row++) {
        var rowInformation = [];
        for (var col = 0; col < 3; col++) {
            var cell = new T3BoardCell(row, col);
            if (row == 0 && col == 0) {
                cell.owner = 'x';
            }
            // if (row == 1 && col == 1) {
            //     cell.owner = 'y';
            // }
            rowInformation.push(cell);
        }
        this.boardInformation.push(rowInformation);
    }

    this.setConfiguration = function(configuration) {
        this.configuration = configuration;
    }

    this.getBoardInformation = function() {
        return JSON.stringify(this.boardInformation);
    }

    this.drawBoard = function(canvasContext) {
        var x = 50;
        var y = 50;
        var width = canvasContext.canvas.width - 100;
        var height = canvasContext.canvas.height - 100;

        canvasContext.strokeStyle = 'red';
        canvasContext.rect(x, y, width, height);
        canvasContext.stroke();

        for(var i = 0; i < this.boardInformation.length; i++) {
            drawRow(canvasContext, this.boardInformation[i]);
        } 
    }

    var drawRow = function(canvasContext, row) {
        for(var i = 0; i < row.length; i++) {
            row[i].drawCell(canvasContext, this.crossImage, this.circleImage);
        }
    }

    this.canvasController.subscribeDrawEvent(this.drawBoard);
}