const config = {
   type: Phaser.AUTO, // Which renderer to use
   width: (11 * 16), // Canvas width in pixels
   height: (11 * 16), // Canvas height in pixels
   parent: "game-container", // ID of the DOM element to add the canvas to
   scene: {
      preload: preload,
      create: create,
      update: update
   }
};

const game = new Phaser.Game(config);

function preload() {
   this.load.image("mario-tiles", "assets/tilemap.png");
}

function create() {
   // Load a map from a 2D array of tile indices
   let level = [
      [3, 3, 3, 3, 6, 3, 3, 3, 3, 3, 3],
      [3, 4, 5, 3, 3, 3, 3, 4, 5, 3, 6],
      [3, 3, 3, 6, 3, 3, 3, 3, 6, 3, 3],
      [3, 6, 3, 3, 3, 4, 5, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   ];
   level = generateRandomLevel();

   // When loading from an array, make sure to specify the tileWidth and tileHeight
   const map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
   const tiles = map.addTilesetImage("mario-tiles");
   const layer = map.createDynamicLayer(0, tiles, 0, 0);
}

function update(time, delta) {
   // Runs once per frame for the duration of the scene
}

function generateRandomLevel() {
   const level = [];
   for (let i = 0; i < 11; i++) {
      level.push([]);
      for (let j = 0; j < 11; j++) {
         switch (i) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
               // if left is 4 choose 5
               if (level[i][j - 1] == 4) {
                  level[i].push(5);
                  break;
               }
               else {
                  level[i].push(randomInArray([3, 3, 3, 3, 3, 3, 4, 6]));
               }
               break;
            case 5:
               // if grass above, choose dirt
               if (level[i - 1][j] == 2) {
                  level[i].push(randomInArray([1, 1, 1, 1, 1, 3]));
                  break;
               }
               else {
                  level[i].push(randomInArray([1, 2]));
               }
               break;
            case 6:
               let options = [1];
               if (level[i - 1][j] == 3) options.push(2);
               level[i].push(randomInArray(options));
               break;
            case 7:
               level[i].push(1);
               break;
            case 8:
               level[i].push(randomInArray([0, 1, 1, 1, 1]));
               break;
            case 9:
               level[i].push(randomInArray([0, 0, 1]));
               break;
            case 10:
               level[i].push(0);
               break;
            default:
               level[i].push(6);
               break;
         }
      }
   }
   return level;
}

function randomInArray(arr) {
   return arr[Math.floor(Math.random() * arr.length)];
}


function regenerateMap() {
   game.scene.scenes[0].scene.restart();
}