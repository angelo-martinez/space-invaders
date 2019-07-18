let aliens = [];
let bullets = [];
let hits = 0;
let miss = 0;
let currentAlienPos =0;

//Get the HTML elements
let body = document.getElementsByTagName('body')[0];
let ship = document.getElementById('ship');
let message = document.getElementById('message');
let hitsTxt = document.getElementById('hits');
let missTxt = document.getElementById('miss');
// create an array of random aliens
for(let i = 0; i < 10; i++){
    let type = Math.floor(Math.random() * 3) + 1;
    let posX = Math.floor(Math.random() *(window.innerWidth - 100)) +0;
    let posY = Math.floor(Math.random() * 200) + 0;
    let alien = document.createElement('div');
    alien.classList.add('enemy');
    alien.classList.add(`e${type}`);
    alien.style.top = `${posY}px`;
    alien.style.left = `${posX}px`;
    //add the alien to the ALIENS array
    aliens.push(alien);
    //Add the alien to the actual Body of the page
    body.appendChild(alien);
}
// variable that defines how to move the aliens
let animateAliens = setInterval(function() {
    currentAlienPos = Math.abs(currentAlienPos -50);
    aliens.forEach(function(alien) {
        alien.style.backgroundPositionX = `${currentAlienPos}px`;
    });
}, 1000);
//variable that actually moves the aliens
let moveAliens = setInterval(function() {
    aliens.forEach(function(alien) {
        let alienBounds = alien.getBoundingClientRect();
        //check if game is over
        if (alienBounds.top >= window.innerHeight - 150) {
            stopGame("The aliens reached Earth!!");
            return;
        }
        //Decide what the alien does
        let think = Math.floor(Math.random() * 3) -1;
        let spaceX = Math.floor(Math.random() * 100) +1;
        //calculate where new X position is
        let posX = alienBounds.left + spaceX * think;
        if(posX <= 10 || posX >= window.innerWidth - 50) return; 
        //move the alien
        alien.style.top = alienBounds.top + 50 + 'px';
        alien.style.left = posX + 'px';
    });
}, 1500);
// Logic for bullets
let animateBullets =  setInterval(function() {
    bullets.forEach(function(bullet, i) {
        //get bounds of the bullet
        let bulletBounds = bullet.getBoundingClientRect();
        //Logic for when bullet gets to the top of the screen
        if(bulletBounds.top < 0){
            //remove buller from the screen
            bullets.splice(i, 1);
            body.removeChild(bullet);
            //increase the miss counter
            missTxt.innerHTML = `Misses: ${++miss}`
        }
        // Logic for collisions with the aliens
        aliens.forEach(function(alien, j){
            let alienBounds = alien.getBoundingClientRect();
            if(
                bulletBounds.top <= alienBounds.bottom &&
                bulletBounds.left >= alienBounds.left &&
                bulletBounds.left <= alienBounds.right
            ){
                //remove the bullet (if its still on the screen)
                if(bullet.parentNode == body){
                    bullets.splice(i, 1);
                    body.removeChild(bullet);
                }
                //increase the hits counter
                hitsTxt.innerHTML = `Hits: ${++hits}`;
                //delete the aliens from the game
                aliens.splice(j, 1);
                body.removeChild(alien);
                //show explosion
                let bum = document.createElement('div');
                bum.classList.add('explosion');
                bum.style.top = `${alienBounds.top}px`;
                bum.style.left = `${alienBounds.left}px`;
                body.appendChild(bum);
                //set a time ut to remove the explosion gif
                setTimeout(function(){
                    body.removeChild(bum);
                }, 1000);
                // create a winning condition
                if (aliens.length <= 0) {
                    stopGame("You saved the day!");
                    return;
                }
            }
        });
    });
}, 100);
// Write the logic to make the ship move
body.addEventListener('keydown', shipActions);
//move the ship and fire when yo press a key
function shipActions(event) {
    //get the bounds of the ship
    let bounds = ship.getBoundingClientRect();
    //logic for left arrow
    if (event.keyCode == '37') {
        if (bounds.x - 20 <= 0) return;
        ship.style.left = (bounds.x - 20) + 'px';
    }
    //right arrow
    if (event.keyCode == '39') {
        if (bounds.x + 100 >= window.innerWidth) return;
        ship.style.left = (bounds.x + 20) + 'px';
    }
    //spacebar logic
    if (event.keyCode == '32') {
        let bullet = document.createElement('div');
        bullet.classList.add('bullet');
        bullet.style.left = (bounds.x + 32) + 'px';
        bullets.push(bullet);
        body.appendChild(bullet);
    }
}