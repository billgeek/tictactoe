function CanvasController() {
    this.canvas = document.getElementById('t3-canvas');
    this.context = this.canvas.getContext('2d');
    this.drawEvents = [];
    this.windowDimensions = {
        width: 0,
        height: 0
    }

    this.subscribeDrawEvent = function(event) {
        this.drawEvents.push(event);
    }

    this.drawCanvas = function() {
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        for(var i = 0; i < this.drawEvents.length; i++) {
            this.drawEvents[i](this.context);
        }
    }

    this.getElementSizes = function() {
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.windowDimensions.width = window.innerWidth;
        this.windowDimensions.height = window.innerHeight;

        this.drawCanvas();
    }

    this.getElementSizes();
    window.onresize = this.getElementSizes.bind(this);
}