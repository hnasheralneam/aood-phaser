let rows = 12;
let columns = rows;
const tileWidth = 32;
let noise;

const config = {
   type: Phaser.AUTO,
   width: (rows * tileWidth),
   height: (columns * tileWidth),
   parent: "game-container",
   scene: {
      preload: preload,
      create: create,
      update: update
   }
};

const game = new Phaser.Game(config);

function preload() {
   this.load.image("cooking-tiles", "assets/cooking-tilemap.png");
}

function create() {
   let mapPath = createMap();
   noise = generatePerlinMap(10, 10);
   let level = generateRandomKitchenLevel(mapPath);


   const map = this.make.tilemap({ data: level, tileWidth: tileWidth, tileHeight: tileWidth });
   const tiles = map.addTilesetImage("cooking-tiles");
   const layer = map.createDynamicLayer(0, tiles, 0, 0);
}

function update(time, delta) {
}

function generateRandomKitchenLevel(mapPath) {
   const level = [];
   for (let i = 0; i < 12; i++) {
      level.push([]);
      for (let j = 0; j < 12; j++) {
         switch (i) {
            case 0:
            case 11:
               level[i].push(5);
               break;
            default:
               let options = [0, 1, 2, 3, 4];
               if (j == 0 || j == 11) {
                  level[i].push(5);
                  break;
               }
               if (mapPath.path.some(([x, y]) => x === i - 1 && y === j - 1)) {
                  level[i].push(2);
                  break;
               }
               level[i].push(noise[i - 1][j - 1]);
               break;
         }
      }
   }
   return level;
   // const level = [];
   // for (let i = 0; i < 12; i++) {
   //    level.push([]);
   //    for (let j = 0; j < 12; j++) {
   //       switch (i) {
   //          case 0:
   //          case 11:
   //             level[i].push(5);
   //             break;
   //          default:
   //             let options = [0, 1, 2, 3, 4];
   //             if (j == 0 || j == 11) {
   //                level[i].push(5);
   //                break;
   //             }
   //             level[i].push(noise[i - 1][j - 1]);
   //             break;
   //          // level[i].push(randomInArray(options));
   //          // break;
   //       }
   //    }
   // }
   // return level;
}

// tilesize: 16
// function generateRandomTerrainLevel() {
//    const level = [];
//    for (let i = 0; i < 11; i++) {
//       level.push([]);
//       for (let j = 0; j < 11; j++) {
//          switch (i) {
//             case 0:
//             case 1:
//             case 2:
//             case 3:
//             case 4:
//                // if left is 4 or we are on left wall choose 5
//                if (level[i][j - 1] == 4) {
//                   level[i].push(5);
//                   break;
//                }
//                else {
//                   let options = [3, 3, 3, 3, 3, 3, 3, 4, 6];
//                   if (j == 0) options.push(5);
//                   level[i].push(randomInArray(options));
//                }
//                break;
//             case 5:
//                // if grass above, choose dirt
//                if (level[i - 1][j] == 2) {
//                   level[i].push(randomInArray([1, 1, 1, 1, 1, 3]));
//                   break;
//                }
//                else {
//                   level[i].push(randomInArray([1, 2]));
//                }
//                break;
//             case 6:
//                let options = [1];
//                if (level[i - 1][j] == 3) options.push(2);
//                level[i].push(randomInArray(options));
//                break;
//             case 7:
//                level[i].push(1);
//                break;
//             case 8:
//                level[i].push(randomInArray([0, 1, 1, 1, 1]));
//                break;
//             case 9:
//                level[i].push(randomInArray([0, 0, 1]));
//                break;
//             case 10:
//                level[i].push(0);
//                break;
//             default:
//                level[i].push(6);
//                break;
//          }
//       }
//    }
//    return level;
// }

function randomInArray(arr) {
   return arr[Math.floor(Math.random() * arr.length)];
}

function regenerateMap() {
   game.scene.scenes[0].scene.restart();
}

function generatePerlinMap(width, height, scale = 0.9) {
   const noise = new Noise(Math.random());

   let map = [];

   for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < width; x++) {
         const value = noise.perlin2(x * scale, y * scale);

         const intValue = Math.floor(((value + 1) / 2) * 6);
         row.push(intValue);
      }
      map.push(row);
   }

   return map;
}














function createMap() {

   let size = 10;

   // Pseudorandom cost generator using a simple seeded random function
   function seededRandom(seed) {
      let x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
   }

   // Generate a 10x10 grid with pseudorandom terrain costs
   function generateTerrain(seed) {
      const terrain = [];
      for (let i = 0; i < 10; i++) {
         terrain[i] = [];
         for (let j = 0; j < 10; j++) {
            const cost = seededRandom(seed + i * 10 + j) * 5;
            terrain[i][j] = cost;
         }
      }
      return terrain;
   }

   // A* algorithm to find the shortest path
   function aStar(grid, start, goal) {
      const openList = [];
      const closedList = new Set();
      const cameFrom = {};

      const gScore = {};
      const fScore = {};
      for (let i = 0; i < 10; i++) {
         for (let j = 0; j < 10; j++) {
            gScore[`${i},${j}`] = Infinity;
            fScore[`${i},${j}`] = Infinity;
         }
      }

      gScore[`${start[0]},${start[1]}`] = 0;
      fScore[`${start[0]},${start[1]}`] = heuristic(start, goal);

      openList.push(start);

      while (openList.length > 0) {
         openList.sort((a, b) => fScore[`${a[0]},${a[1]}`] - fScore[`${b[0]},${b[1]}`]); // Sort openList by fScore
         const current = openList.shift();

         if (current[0] === goal[0] && current[1] === goal[1]) {
            // Reconstruct the path
            const path = [];
            let temp = goal;
            while (temp) {
               path.push(temp);
               temp = cameFrom[`${temp[0]},${temp[1]}`];
            }
            return path.reverse();
         }

         closedList.add(`${current[0]},${current[1]}`);

         // Get the neighbors of the current node
         const neighbors = [
            [current[0] - 1, current[1]], // Up
            [current[0] + 1, current[1]], // Down
            [current[0], current[1] - 1], // Left
            [current[0], current[1] + 1]  // Right
         ];

         for (const neighbor of neighbors) {
            const [nx, ny] = neighbor;
            if (nx < 0 || ny < 0 || nx >= 10 || ny >= 10) continue; // Skip out-of-bounds

            if (closedList.has(`${nx},${ny}`)) continue; // Skip already processed nodes

            const tentativeGScore = gScore[`${current[0]},${current[1]}`] + grid[nx][ny];

            if (!openList.some(([x, y]) => x === nx && y === ny)) {
               openList.push([nx, ny]);
            }

            if (tentativeGScore < gScore[`${nx},${ny}`]) {
               cameFrom[`${nx},${ny}`] = current;
               gScore[`${nx},${ny}`] = tentativeGScore;
               fScore[`${nx},${ny}`] = gScore[`${nx},${ny}`] + heuristic([nx, ny], goal);
            }
         }
      }

      return null; // No path found
   }

   // Heuristic for A* (Manhattan distance)
   function heuristic(a, b) {
      return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
   }

   // Example usage
   const seed = Math.random() * 1000; // Random seed for each query
   const grid = generateTerrain(seed);

   // Define start and goal
   const start = [0, 0];
   const goal = [9, 9];

   const path = aStar(grid, start, goal);
   console.log("Generated terrain grid:", grid);
   console.log("Generated path:", path);

   return {
      grid: grid,
      path: path
   }
}