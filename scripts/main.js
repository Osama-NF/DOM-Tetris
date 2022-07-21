$('.play-btn').click(function() {
    let newGame = new Game(false, 20);
    newGame.start();
})


class Game {

    constructor(classic, dropSpeed) {

        this.classic = classic;
        this.stepDistanceY = $('main').height() / dropSpeed;
        this.stepDistanceX = $('main').width() / dropSpeed;
        this.stepCounter = dropSpeed - (dropSpeed * 0.1);

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

        // down here is just a ref for a feture idea on how to use the rotateBlock()
        this.blockDirection = {
            default: 1,
            right: 2,
            down: 3,
            left: 4
        }

    }

    start() {
        let container = this.createBlock();
        $('main').append(container);

        this.dropBlock(container, this.stepCounter);

        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case "ArrowRight":
                case "ArrowLeft":
                    this.moveBlock(e.key);
                    break;
            }
        });
    }

    // Below function creates the container for the block and returns it
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

    // below is a recusrive function that continues to call it self as long as the block 
    // didn't hit the bottom (should be changed for the .moveable class later on)
    dropBlock(container, counter) {

        if ($(container).hasClass('moveable') && counter > 0) {

            let currentTopValue = Number($(container).css('top').replace('px',''));
            let newValue = currentTopValue + this.stepDistanceY;
            $(container).css('top', newValue);
            
            let newCounter = counter - 1;
            setTimeout(()=> {
                this.dropBlock(container, newCounter);
            }, 350) // Maybe make the speed customizable too ???

        } else {
            $(container).removeClass('moveable');
            return;
        }
        
    }
    
    moveBlock(dir) {
        
        let currentRightValue = Number($('.moveable').css('right').replace('px',''));
        let leftBorders = $('main').width() / 10 * 9; // will change math later to make it shorter (also to move the code somewhere nicer)

        if (dir == 'ArrowRight' && currentRightValue > 0) {
            
            let newRightValue = currentRightValue - this.stepDistanceX;
            $('.moveable').css('right', newRightValue);

        } else if (dir == 'ArrowLeft' && currentRightValue < leftBorders) {

            let newRightValue = currentRightValue + this.stepDistanceX;
            $('.moveable').css('right', newRightValue);
            console.log(newRightValue)
        }

    }
}