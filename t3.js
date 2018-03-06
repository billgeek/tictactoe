(function() {
    // *** Enable or disable console debugging  information
    var enableLogging = true;

    // *** Configuration
    var gridColor = '#ffffff';
    var gameOverColor = '#606060';
    var playerColor = '#ffff00';
    var winnerColor = '#00ff00';
    var backgroundColor = '#303030';
    var minimumBorderWidth = 50;

    // Internal game variables
    var blockData = null;
    var currentPlayer = 'x';
    var gameState = 'playing';

    $(document).ready(function() {
        var totalWidth = $(window).width();
        var totalHeight = $(window).height();
        var hBorderWidth = minimumBorderWidth;
        var vBorderWidth = minimumBorderWidth;

        if (totalWidth < 600) {
            hBorderWidth = 0;
        }
        if (totalHeight < 600) {
            vBorderWidth = 0;
        }

        createCanvas(hBorderWidth, vBorderWidth, totalWidth, totalHeight);
    });

    var createCanvas = function(hBorder, vBorder, width, height) {
        if (enableLogging) {
            console.log(`${width}x${height}; ${hBorder}:${vBorder}`);
        }
        var canvas = document.createElement('canvas');
        $(canvas).appendTo('body');

        $(canvas).attr('id', 't3canvas');
        $(canvas).width(width);
        $(canvas).height(height);
        $(canvas).attr('width', width);
        $(canvas).attr('height', height);
        $(canvas).css('backgroundColor', backgroundColor);

        $(canvas).click(playerCallback);

        var blockSize = 100;
        if (width > height) {
            blockSize = (height - (vBorder * 2)) / 3;
        }
        else {
            blockSize = (width - (hBorder * 2)) / 3;
        }

        if (enableLogging) {
            console.log(`Block Size: ${blockSize}`);
        }
        var vOffset = (height - (vBorder * 2) - (blockSize * 3)) / 2;
        var hOffset = (width - (hBorder * 2) - (blockSize * 3)) / 2;

        if (enableLogging) {
            console.log(`Offset: ${hOffset}x${vOffset}`);
        }
        var blocks = [
            [
                { marked: 'none', top: vOffset + vBorder, bottom: vOffset + blockSize + vBorder, left: hOffset + hBorder, right: hOffset + blockSize + hBorder },
                { marked: 'none', top: vOffset + vBorder, bottom: vOffset + blockSize + vBorder, left: hOffset + hBorder + blockSize, right: hOffset + (blockSize * 2) + hBorder },
                { marked: 'none', top: vOffset + vBorder, bottom: vOffset + blockSize + vBorder, left: hOffset + hBorder + (blockSize * 2), right: hOffset + (blockSize * 3) + hBorder }
            ],
            [
                { marked: 'none', top: vOffset + vBorder + blockSize, bottom: vOffset + (blockSize * 2) + vBorder, left: hOffset + hBorder, right: hOffset + blockSize + hBorder },
                { marked: 'none', top: vOffset + vBorder + blockSize, bottom: vOffset + (blockSize * 2) + vBorder, left: hOffset + hBorder + blockSize, right: hOffset + (blockSize * 2) + hBorder },
                { marked: 'none', top: vOffset + vBorder + blockSize, bottom: vOffset + (blockSize * 2) + vBorder, left: hOffset + hBorder + (blockSize * 2), right: hOffset + (blockSize * 3) + hBorder }
            ],
            [
                { marked: 'none', top: vOffset + vBorder + (blockSize * 2), bottom: vOffset + (blockSize * 3) + vBorder, left: hOffset + hBorder, right: hOffset + blockSize + hBorder },
                { marked: 'none', top: vOffset + vBorder + (blockSize * 2), bottom: vOffset + (blockSize * 3) + vBorder, left: hOffset + hBorder + blockSize, right: hOffset + (blockSize * 2) + hBorder },
                { marked: 'none', top: vOffset + vBorder + (blockSize * 2), bottom: vOffset + (blockSize * 3) + vBorder, left: hOffset + hBorder + (blockSize * 2), right: hOffset + (blockSize * 3) + hBorder }
            ]
        ];
        blockData = blocks;

        drawBlockData();
    };

    function drawGameOverText(canvasContext) {
        canvasContext.font = '30px Arial';
        canvasContext.strokeStyle = winnerColor;
        canvasContext.textAlign = 'center';
        canvasContext.strokeText('Game Over!', canvasContext.canvas.width / 2, canvasContext.canvas.height / 2);
    }

    function playerCallback(eventData) {
        if (gameState == 'playing') {
            for(var rowIdx = 0; rowIdx < blockData.length; rowIdx++) {
                var currentRow = blockData[rowIdx];
                for(var blockIdx = 0; blockIdx < currentRow.length; blockIdx++) {
                    var currentBlock = currentRow[blockIdx];

                    if (currentBlock.top < eventData.pageY && eventData.pageY < currentBlock.bottom && currentBlock.left < eventData.pageX && eventData.pageX < currentBlock.right) {
                        if (enableLogging) {
                            console.log(`Selected Target: ${rowIdx + 1}x${blockIdx + 1}`);
                        }
                        if (currentBlock.marked == 'none') {
                            currentBlock.marked = currentPlayer;
                            blockIdx = currentRow.length;
                            rowIdx = blockData.length;

                            currentPlayer = currentPlayer == 'x' ? 'o' : 'x';
                        }
                    }
                }
            }

            checkForWinner();
            drawBlockData();
        }
    }

    var drawBlockData = function() {
        var htmlCanvas = document.getElementById('t3canvas');
        var canvasContext = htmlCanvas.getContext('2d');
        canvasContext.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);

        for(var rowIdx = 0; rowIdx < blockData.length; rowIdx++) {
            drawCanvasRow(canvasContext, rowIdx);
        }

        if (gameState == 'won') {
            drawGameOverText(canvasContext);
        }
    }

    var drawCanvasRow = function(canvasContext, rowIndex) {
        var currentRow = blockData[rowIndex];
        for(var blockIdx = 0; blockIdx < currentRow.length; blockIdx++) {
            drawBlock(canvasContext, rowIndex, blockIdx);
        }
    }

    var drawBlock = function(canvasContext, rowIndex, blockIndex) {
        var currentBlock = blockData[rowIndex][blockIndex];

        canvasContext.strokeStyle = gridColor;
        if (gameState == 'won') {
            canvasContext.strokeStyle = gameOverColor;
        }
        canvasContext.strokeRect(currentBlock.left, currentBlock.top, currentBlock.right - currentBlock.left, currentBlock.bottom - currentBlock.top);

        if (currentBlock.marked == 'x') {
            drawBlockX(canvasContext, currentBlock, rowIndex, blockIndex);
        }

        if (currentBlock.marked == 'o') {
            drawBlockO(canvasContext, currentBlock, rowIndex, blockIndex);
        }
    }

    var drawBlockO = function(canvasContext, currentBlock, rowIndex, blockIndex) {
        var radius = (currentBlock.right - currentBlock.left) / 2;
        var centerX = currentBlock.left + radius;
        var centerY = currentBlock.top + radius;

        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
        canvasContext.strokeStyle = playerColor;
        if (gameState == 'won' && winningCombinationContainsBlock(rowIndex, blockIndex)) {
            canvasContext.strokeStyle = winnerColor;
        }
        else if (gameState == 'won') {
            canvasContext.strokeStyle = gameOverColor;
        }
        canvasContext.stroke();
    }
    
    var drawBlockX = function(canvasContext, currentBlock, rowIndex, blockIndex) {
        canvasContext.beginPath();
        canvasContext.moveTo(currentBlock.left, currentBlock.top);
        canvasContext.lineTo(currentBlock.right, currentBlock.bottom);
        canvasContext.strokeStyle = playerColor;
        if (gameState == 'won' && winningCombinationContainsBlock(rowIndex, blockIndex)) {
            canvasContext.strokeStyle = winnerColor;
        }
        else if (gameState == 'won') {
            canvasContext.strokeStyle = gameOverColor;
        }
        canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.moveTo(currentBlock.right, currentBlock.top);
        canvasContext.lineTo(currentBlock.left, currentBlock.bottom);
        canvasContext.strokeStyle = playerColor;
        if (gameState == 'won' && winningCombinationContainsBlock(rowIndex, blockIndex)) {
            canvasContext.strokeStyle = winnerColor;
        }
        else if (gameState == 'won') {
            canvasContext.strokeStyle = gameOverColor;
        }
        canvasContext.stroke();
    }

    var winningCombinationContainsBlock = function(row, col) {
        for(var i = 0; i < winningCombination.length; i++) {
            if (winningCombination[i][0] == row && winningCombination[i][1] == col) {
                return true;
            }
        }
        return false;
    }

    var checkForWinner = function() {
        // check rows
        for(var row = 0; row < 3; row++) {
            if (blockData[row][0].marked == blockData[row][1].marked && blockData[row][1].marked == blockData[row][2].marked && blockData[row][0].marked != 'none') {
                gameState = 'won';
                winningCombination = [[row, 0],[row, 1], [row, 2]];
            }
        }

        // check cols
        for(var col = 0 ; col < 3; col++) {
            if (blockData[0][col].marked == blockData[1][col].marked && blockData[1][col].marked == blockData[2][col].marked && blockData[0][col].marked != 'none') {
                gameState = 'won';
                winningCombination = [[0, col], [1, col], [2, col]];
            }
        }

        // check diag left
        if (blockData[0][0].marked == blockData[1][1].marked && blockData[1][1].marked == blockData[2][2].marked && blockData[2][2].marked != 'none') {
            gameState = 'won';
            winningCombination = [[0, 0], [1, 1], [2, 2]];
        }

        if (blockData[0][2].marked == blockData[1][1].marked && blockData[1][1].marked == blockData[2][0].marked && blockData[2][0].marked != 'none') {
            gameState = 'won';
            winningCombination = [[0, 2], [1, 1], [2, 0]];
        }
    }
})();