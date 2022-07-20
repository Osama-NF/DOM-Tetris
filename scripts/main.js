$('.play-btn').click(function() {
    let newGame = new Game(false);
    newGame.start();
})


class Game {

    constructor(classic) {

        this.classic = classic;
        this.stepDistance = $('main').height() / 10;
        this.fieldLimits = $('main').height() - this.stepDistance * 2;

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

        this.dropBlock(container);
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

    // below is a recusrive function that continues to call it self as long as the block didn't hit the bottom (should be changed for the .moveable class later on)
    dropBlock(container) {

        let currentTopValue = Number($(container).css('top').replace('px',''));
        if(currentTopValue >= this.fieldLimits){
            console.log('current value: ' + currentTopValue)
            console.log('field limit: ' + this.fieldLimits)
            return;
        }

        let newValue = currentTopValue + this.stepDistance;
        $(container).css('top', newValue);

        setTimeout(() => {
            console.log(currentTopValue)
            this.dropBlock(container);
        }, 100);
        
    }
    
}