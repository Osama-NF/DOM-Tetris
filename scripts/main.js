$('.play-btn').click(function() {
    let newGame = new Game(20, 500);
    newGame.start();
})


class Game {

    constructor(dropDistance, dropSpeed) {

        this.dropSpeed = dropSpeed;
        this.dropSpeedCopy = dropSpeed;
        this.dropDistance = dropDistance;

        this.stepDistanceY = $('main').height() / this.dropDistance;
        this.stepDistanceX = $('main').width() / this.dropDistance;
        this.fieldBorderY = $('main').height() * 0.85;
        this.fieldBorderX = $('main').width() * 0.9;

        this.blockTypes = [
            {
                blockName: "stair-like",
                divsNumber: 3
            },
            {
                blockName: "big-block",
                divsNumber: 4
            },
            // {
            //     blockName: "single-block",
            //     divsNumber: 1
            // },
        ];

    }

    start() {
        let container = this.createBlock();
        $('main').append(container);

        this.dropBlock(container);
        this.startEventListening();
        
    }

    startEventListening() {
        document.addEventListener('keydown', (e) => {
            let pressedKey = e.key.toLowerCase()
            switch(pressedKey) {
                
                case "arrowright":
                case "arrowleft":
                    this.moveBlock(pressedKey);
                    break;

                case "arrowup":
                    this.makeBlockSlower();
                    break;

                case "arrowdown":
                    this.makeBlockFaster();
                    break;

                case "q":
                case "e":
                    this.rotateBlock(pressedKey);
                    break;
            }
        });
        document.addEventListener('keyup', (e) => {
            switch(e.key) {

                case "ArrowUp":
                case "ArrowDown":
                    this.revertBlockToNormalSpeed();
                    break;

            }
        })
    }

    createBlock() {
        // Choose the type of the block randomly
        let randomNumber = Math.floor((Math.random() * this.blockTypes.length));
        let newBlockType = this.blockTypes[randomNumber];
        
        // Create the container and add it's classes
        let container = document.createElement("div");
        container.classList.add('container', 'moveable', newBlockType.blockName);

        // Create the needed number of blocks, add class, and append to the container
        for (let i = 0; i < newBlockType.divsNumber; i++) {

            let block = document.createElement('div');
            block.classList.add('block');
            
            container.append(block);
        }

        // return the container with the small block(s) appended to it
        return container;
    }

    dropBlock(container) {

        let currentTopValue = Number($(container).css('top').replace('px',''));

        if ($(container).hasClass('moveable') && currentTopValue <= this.fieldBorderY) {

            let newValue = currentTopValue + this.stepDistanceY;
            $(container).css('top', newValue);
            
            setTimeout(()=> {
                this.dropBlock(container);
            }, this.dropSpeed)

        } else {
            $(container).removeClass('moveable');
            return;
        }
        
    }
    
    moveBlock(dir) {
        
        let currentRightValue = Number($('.moveable').css('right').replace('px',''));   

        if (dir == 'arrowright' && currentRightValue > 0) {
            
            let newRightValue = currentRightValue - this.stepDistanceX;
            $('.moveable').css('right', newRightValue);

        } else if (dir == 'arrowleft' && currentRightValue < this.fieldBorderX) {

            let newRightValue = currentRightValue + this.stepDistanceX;
            $('.moveable').css('right', newRightValue);
        }

    }

    makeBlockSlower() {
        if (this.dropSpeed === this.dropSpeedCopy) {
            this.dropSpeed *= 1.5;
        }
    }
    
    makeBlockFaster() {
        if (this.dropSpeed === this.dropSpeedCopy) {
            this.dropSpeed /= 10;
        }
    }

    revertBlockToNormalSpeed() {
        this.dropSpeed = this.dropSpeedCopy;
    }

    rotateBlock(dir) {

        let container = $('.moveable').first();
        let containerClasses = container.attr('class').split(' ');

        // if container has 3 classes only, then it's in the default position
        if (containerClasses.length == 3) {

            if (dir == 'q') container.addClass('flipped-left');
            else container.addClass('flipped-right');

        } else if (container.hasClass('flipped-left')) {
            
            if (dir == 'q') container.addClass('flipped-down');
            container.removeClass('flipped-left');

        } else if (container.hasClass('flipped-down')) {

            if (dir == 'q') container.addClass('flipped-right');
            else container.addClass('flipped-left');
            container.removeClass('flipped-down');

        } else if (container.hasClass('flipped-right')) {

            if (dir == 'e') container.addClass('flipped-down');
            container.removeClass('flipped-right');

        }
        
    }
}
