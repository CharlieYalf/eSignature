class SignaturePad {
    constructor() {
        this.canvas = document.getElementById('signatureCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nameInput = document.getElementById('signatureName');
        this.clearButton = document.getElementById('clearButton');
        this.generateButton = document.getElementById('generateButton');
        
        this.isDrawing = false;
        this.points = [];
        
        this.setupCanvas();
        this.addEventListeners();
    }

    setupCanvas() {
        // Set canvas styling
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Make canvas responsive
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    addEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());

        // Keyboard events
        this.canvas.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Button events
        this.clearButton.addEventListener('click', () => this.clear());
        this.generateButton.addEventListener('click', () => this.generateSignature());
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.points = [[x, y]];
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.points.push([x, y]);
        
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.points = [];
        this.announceChange('Signature cleared');
    }

    generateSignature() {
        const name = this.nameInput.value.trim();
        if (!name) {
            this.announceChange('Please enter your name first');
            return;
        }

        this.clear();
        this.ctx.font = '48px "Dancing Script", cursive';
        this.ctx.fillStyle = '#2c3e50';
        
        const textMetrics = this.ctx.measureText(name);
        const x = (this.canvas.width - textMetrics.width) / 2;
        const y = this.canvas.height / 2;
        
        this.ctx.fillText(name, x, y);
        this.announceChange('Signature generated from name');
    }

    handleKeyboard(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            this.generateSignature();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            this.clear();
        }
    }

    announceChange(message) {
        // Create and update aria-live region for screen readers
        let announcer = document.getElementById('signature-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'signature-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('class', 'sr-only');
            document.body.appendChild(announcer);
        }
        announcer.textContent = message;
    }
}

// Initialize the signature pad when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignaturePad();
});