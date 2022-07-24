$('.play-btn').click(function() {
    let newGame = new Game(20, 500);
    newGame.start();
})


class Game {

    constructor(dropDistance, dropSpeed) {

        this.dropSpeed = dropSpeed;
        this.dropSpeedCopy = dropSpeed;
        this.dropDistance = dropDistance;

        // this.rightWall = $('aside.right').position().left;
        // this.leftWall = $('main').position().left;
        // this.bottomFloor = $('main').height();

        this.stepDistanceY = $('main').height() / this.dropDistance;
        this.stepDistanceX = $('main').width() / this.dropDistance;
        // this.fieldBorderY = $('main').height() * 0.85;
        // this.fieldBorderX = $('main').width() * 0.9;

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
            this.getBlockCoordinates(container, newValue, 'bottom'));

        if ($(container).hasClass('moveable') && !thereIsObstacle) {

            $(container).css('top', newValue);
            setTimeout(()=> {
                this.dropBlock(container);
            }, this.dropSpeed)

        } else {
            $(container).removeClass('moveable');
            
            let newContainer = this.createBlock();
            $('main').append(newContainer);
            
            setTimeout(()=> {
                this.dropBlock(newContainer)
            }, this.dropSpeed)
        }
        
    }
    
    moveBlock(dir) {
        
        let currentRightValue = Number($('.moveable').css('right').replace('px',''));   

        if ((dir == 'arrowright' || dir == 'd') && currentRightValue > 0) {
            
            let newRightValue = currentRightValue - this.stepDistanceX;
            $('.moveable').css('right', newRightValue);

        } else if ((dir == 'arrowleft' || dir == 'a') && currentRightValue < this.fieldBorderX) {

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

    checkObstaclesInDirection(blocks, newValue, direction) {
    
        for (let block of blocks) {

            if (direction === 'bottom') block.bottom + newValue
            else if (direction === 'right') block.right + newValue
            else if (direction === 'left') block.left + newValue
            
            let leftCheck = document.elementsFromPoint(block.left, block.bottom);
            let rightCheck = document.elementsFromPoint(block.right, block.bottom);
            
            for (let check of [leftCheck, rightCheck]) {
    
                for (let element of check) {
                    if (element.tagName === "ASIDE"
                        || element.tagName === "FOOTER"
                        || (element.classList.contains('block') 
                            && !element.classList.contains('moveable'))) {

                        return true;
                    }
                }
            }
        }
    
        return false;
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
        console.log(coordinates)
        return coordinates;
    }
}

// ###########################################################################
// ###########################################################################
// ###########################################################################
// ###########################################################################
// down Here is just for help and will delete later

// function checkObstacles(blocks) {
    
//     for (let block of blocks) {
        
//         let leftCheck = document.elementsFromPoint(block.left, block.bottom);
//         let rightCheck = document.elementsFromPoint(block.right, block.bottom);
        
//         for (let check of [leftCheck, rightCheck]) {

//             for (element of check) {
//                 if (element.tagName === "ASIDE"
//                     || element.tagName === "FOOTER"
//                     || element.tagName === "DIV") {

//                     return true;
//                 }
//             }
//         }
//     }

//     return false;
// }

// function getBlockCoordinates(container) {
//     let coordinates = [];

//     for (let block of container.children) {
//         let rect = block.getBoundingClientRect();
//         let obj = {
//             right: rect.right,
//             left: rect.left,
//             bottom: rect.bottom
//         }
//         coordinates.push(obj)
//     }

//     return coordinates;
// }

document.addEventListener('click', e => {
    let y = e.clientY;
    let x = e.clientX;
    console.log('Y: ' + y)
    console.log('X: ' + x)
    console.log('###############')
})