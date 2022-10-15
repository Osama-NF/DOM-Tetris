$('.play-btn').click(function() {
    let newGame = new Game(20, 250);
    newGame.start();
})


class Game {

    constructor(dropDistance, dropSpeed) {

        this.loseZone = document.getElementsByClassName('lose.zone')[0]

        this.dropSpeed = dropSpeed;
        this.dropSpeedCopy = dropSpeed;
        this.dropDistance = dropDistance;

        this.stepDistanceY = $('main').height() / this.dropDistance;
        this.stepDistanceX = $('main').width() / this.dropDistance;

        this.blockWidth = $('main').width() * 0.05;
        this.blockHeight = $('main').height() * 0.05;

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
            {
                blockName: "t-shaped",
                divsNumber: 4
            },
            {
                blockName: "i-shaped",
                divsNumber: 4
            },
        ];

    }

    start() {
        this.inGame = true;

        let container = this.createBlock();
        $('main').append(container);

        this.dropBlock(container);
        this.startEventListening();
        
    }

    startEventListening() {

        document.addEventListener('keydown', (e) => {

            let pressedKey = e.key.toLowerCase();

            switch(pressedKey) {
                
                case "arrowright":
                case "arrowleft":
                case "d":
                case "a":
                    this.moveBlock(pressedKey);
                    break;

                case "arrowup":
                case "w":
                    this.makeBlockSlower();
                    break;

                case "arrowdown":
                case "s":
                    this.makeBlockFaster();
                    break;

                case "q":
                case "e":
                    this.rotateBlock(pressedKey);
                    break;
            }

        });

        document.addEventListener('keyup', (e) => {

            let pressedKey = e.key.toLowerCase();

            switch(pressedKey) {

                case "arrowup":
                case "arrowdown":
                case "w":
                case "s":
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
        let newValue = currentTopValue + this.stepDistanceY;
        let thereIsObstacle = this.checkObstaclesInDirection(
            this.getBlockCoordinates(container), 'bottom');

        if ($(container).hasClass('moveable') && !thereIsObstacle) {

            $(container).css('top', newValue);
            setTimeout(()=> {
                this.dropBlock(container);
            }, this.dropSpeed)

        } else {
            $(container).removeClass('moveable');
            this.checkRows();
            
            if (this.inGame) {
                let newContainer = this.createBlock();
                $('main').append(newContainer);
                
                setTimeout(()=> {
                    this.dropBlock(newContainer)
                }, this.dropSpeed)
            }
        }
        
    }
    
    moveBlock(dir) {
        
        let currentRightValue = Number($('.moveable').css('right').replace('px',''));   
        let coordinates = this.getBlockCoordinates(document.querySelector('.moveable'));
        
        if ((dir == 'arrowright' || dir == 'd')) {
            
            if (!this.checkObstaclesInDirection(coordinates, 'right')){
                
                let newRightValue = currentRightValue - this.stepDistanceX;
                $('.moveable').css('right', newRightValue);

            }
            
        } else if ((dir == 'arrowleft' || dir == 'a')) {
            
            if (!this.checkObstaclesInDirection(coordinates, 'left')) {
                
                let newRightValue = currentRightValue + this.stepDistanceX;
                $('.moveable').css('right', newRightValue);

            };

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

    checkObstaclesInDirection(blocksCoordinates, direction) {

        if (direction === 'bottom') {

            for (let block of blocksCoordinates) {

                let futureY = block.bottom + this.stepDistanceY - (this.blockHeight / 2); 
                let futureX = block.left + (this.blockWidth / 2)
                let futureElements = document.elementsFromPoint(futureX, futureY);
                
                if (checkElements(futureElements)) return true;

            }

        } else if (direction === 'right') {

            for (let block of blocksCoordinates) {

                let futureY = block.bottom - (this.blockHeight / 2); 
                let futureX = block.right + this.stepDistanceX - (this.blockWidth / 2);
                let futureElements = document.elementsFromPoint(futureX, futureY);
                
                if (checkElements(futureElements)) return true;

            }

        } else if (direction === 'left') {

            for (let block of blocksCoordinates) {

                let futureY = block.bottom - (this.blockHeight / 2); 
                let futureX = block.left - this.stepDistanceX + (this.blockWidth / 2);
                let futureElements = document.elementsFromPoint(futureX, futureY);
                
                if (checkElements(futureElements)) return true;

            }

        }

        return false;

        function checkElements(elements) {
            for (let element of elements) {

                if (element.tagName === "ASIDE"
                    || element.tagName === "FOOTER"
                    || (element.classList.contains('block') 
                    && !element.parentElement.classList.contains('moveable'))) {

                        return true;
                }

            }
        }
    }

    getBlockCoordinates(container) {
        let coordinates = [];
    
        for (let block of container.children) {
            let rect = block.getBoundingClientRect();
            let obj = {
                right: rect.right,
                left: rect.left,
                bottom: rect.bottom
            }
            coordinates.push(obj)
        }

        return coordinates;
    }

    checkRows(){
        let top = $('main').position().top + (this.blockHeight / 2);
        
        for (let col = 1; col <= 20; col++) {

            let left = $('main').position().left + (this.blockWidth / 2);
            
            for (let row = 1; row <= 20; row++) {
                

                let element = document.elementFromPoint(left,top).tagName;
                if (col == 1 && element !== "MAIN"){
                    this.end()
                    return
                } else if (col > 1 && element == "MAIN") {
                    left += this.blockWidth;
                    break;
                } else {
                    console.log(element)
                    // testDot(top,left,'w')
                }
                
            
            }

            top += this.blockHeight
        }
    
    }

    score() {

    }

    checkScoring() {
        /*
            this function should be called everytime a block loses it's .moveable class.
            it should check for the rows where the .moveable lost it's class, because 
            that's where a score can be.
            check if there is 20 .moveable class the whole row, if so then removeRows()
            and count scoring. 
        */
    }

    removeRows(rows) {
        // should receive the row number that we need removed, and then remove all blocks from it.
    }

    end() {
        this.inGame = false;
        /*
            function this should call:
            1- removeEventListeners()
            2- calcScore()
        */
    }
}
// ###########################################################################################
// testing tools

// document.addEventListener('click', e => {
//     let y = e.clientY;
//     let x = e.clientX;
//     console.log('Y: ' + y)
//     console.log('X: ' + x)
//     console.log('###############')
// })

function testDot(top, left, content = '',parent = 'body') {
    let div = document.createElement('div')
    div.textContent = content;
    div.classList.add('test-dot')
    div.style.top = top + 'px';
    div.style.left = left + 'px';
    div.style.zIndex = 9999;
    $(parent).append(div)
} 