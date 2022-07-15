$('.play-btn').click(function() {
    let newGame = new Game(false);
    newGame.start();
})


class Game {

    constructor(classic) {

        this.classic = classic;

        this.blockTypes = [
            {
                blockName: "stair-like",
                divsNumber: 3
            },
            {
                blockName: "big-block",
                divsNumber: 4
            },
            {
                blockName: "single-block",
                divsNumber: 1
            },
        ];

    }

    start() {
        let block = this.createBlock()
        $('main').append(block)
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

    get getNewScore() {

    }

    set setNewScore(newScore) {

    }
}