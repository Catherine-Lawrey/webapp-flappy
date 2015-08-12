// the Game object used by the phaser.io library
var stateActions = {preload: preload, create: create, update: update};

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
var score = 0;
var labelScore;
var player;
var count = 0;
var gap = game.rnd.integerInRange(1, 5);
var block;
var pipes = [];

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}

jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting").hide();
    game.paused = false;
    //jQuery("#greeting").append("<p>" + greeting_message + "</p>");
    event_details.preventDefault();
});

function preload() {
    game.load.image ("playerImg", "../assets/spaceship.jpg");
    game.load.image("backgroundImg", "../assets/space background.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe", "../assets/moon.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {

    game.stage.setBackgroundColor("#6666FF");
    game.add.text(310, 100, "Hello World!",
        {font: "30px Reprise Script", fill: "#336600"});
    //game.add.sprite(10, 270, "playerImg");
    game.input
        .onDown
        .add(clickHandler);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);

    var background = game.add.image(0, 0, "backgroundImg");
    background.width = 790;
    background.height = 400;

    labelScore = game.add.text(750, 20, "0", {font: "30px Reprise Script", fill: "#ffA500"});

    player = game.add.sprite (50,120, "playerImg");
game.physics.arcade.enable(player);
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);
    game.paused = true;
    generatePipe();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.enable(player);

    player.body.gravity.y = 250;





    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    pipeInterval = 2.70;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
    generatePipe);
}

function playerJump() {
    player.body.velocity.y = -100;
}

function moveRight() {
    player.x = player.x + 40;
}
function moveLeft() {
    player.x = player.x - 40;
}
function moveUp() {
    player.y = player.y - 60;
}
function moveDown() {
    player.y = player.y + 60;
}

function clickHandler(event) {
}

function spaceHandler() {
    game.sound.play("score");
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -120;
}

function generatePipe() {
    var gap = game.rnd.integerInRange(1, 5);
    for (var count = 0; count < 8; count++) {
        if (count != gap && count != gap + 1) {
            addPipeBlock(790, count * 50);
        }
    }
    changeScore();
}

// set the background colour of the scene}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    for(var index=0; index<pipes.length; index++){
        game.physics.arcade
            .overlap(player, pipes[index],
        gameOver);
    }
}
function gameOver() {
    game.paused = true;
    //location.reload();
    jQuery("#score").val(score.toString());
}