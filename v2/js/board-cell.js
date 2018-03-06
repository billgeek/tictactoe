function T3BoardCell(rowIndex, columnIndex) {
    this.rowIndex = rowIndex;
    this.columnIndex = columnIndex;

    this.owner = null;  // Assigned to player when player plays a cell

    this.drawCell = function(canvasContext, crossImage, circleImage) {
        // todo: Add code
        var offsetX = 100;
        var offsetY = 100;

        if (this.owner == 'x') {
            canvasContext.drawImage(crossImage, offsetX, offsetY);
        }
        else if (this.owner == 'o') {
            canvasContext.drawImage(circleImage, offsetX, offsetY);
        }
    }
}