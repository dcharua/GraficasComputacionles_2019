//Daniel Charua A01017419

// SCENE VARIABLES
var renderer = null,
  scene = null,
  camera = null,
  root = null,
  group = null;

// VARIABLES FOR THE GAME TIME
var gameSettings = {
  playTime: 60,
  time: 0,
  score: 0,
  highScore: 0,
  gameOver: false,
  difficulty: 5,
  lives: 3,
  gameClock: null
}

// Robot settings object
var robotSettings = {
  object: null,
  walkingRobotAnimation: 0.001,
  walkingRobotTranslation: 0.04,
  robots: [],
  animation: null,
  robotNames: 1,
  left: -150,
  right: 150,
  start: -200,
  end: 100,
  robotMaker: null
}

var duration = 20000, // ms
  currentTime = Date.now();

var raycaster = new THREE.Raycaster(),
  mouse = new THREE.Vector2();


function loadFBX() {
  var loader = new THREE.FBXLoader();
  // load the idle animation for the clone object
  loader.load('./Robot/robot_idle.fbx', function (object) {
    object.scale.set(0.02, 0.02, 0.02);
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    robotSettings.object = object;

    // load the run robot animation for running to goal line
    loader.load('./Robot/robot_run.fbx', function (object) {
      new THREE.AnimationMixer(scene).clipAction(object.animations[0], robotSettings.object).play();
      object.animations[0].name = "run";
      robotSettings.animation = object.animations[0];
    });

  });
}

// funtion to for gametime
function clock() {
  gameSettings.gameClock = window.setInterval(function () {
    document.getElementById("time").innerHTML = `Time:  ${(gameSettings.playTime - gameSettings.time).toString()} seconds`;
    gameSettings.time++;
    if (gameSettings.time === gameSettings.playTime) {
      alert("Time is up")
      gameSettings.gameOver = true;
      resetGame();
      return;
    }
  }, 1000);
}


function resetGame() {
  //save high score
  if (gameSettings.score > gameSettings.highScore){
    gameSettings.highScore = gameSettings.score;
    window.localStorage.setItem('high_score', JSON.stringify(gameSettings.highScore));
    document.getElementById("high_score").innerHTML = `High score: ${gameSettings.score.toString()}`;
    alert("New high score!")
  }

  gameSettings.score = 0;
  gameSettings.lives = 3;
  gameSettings.time = 0;
  document.getElementById("play").value = "Play";
 
  // clear interval for gameclock and roboto maker
  window.clearInterval(gameSettings.gameClock);
  window.clearInterval(robotSettings.robotMaker);
}

// funtion to start the game
function startGame() {
  resetGame();
  // remove robots from scene if any
  robotSettings.robots.forEach(robot => scene.remove(robot));
  robotSettings.robots = [];
  // reset score time and lives in html
  document.getElementById("score").innerText = `Score: ${gameSettings.score.toString()}`;
  document.getElementById("time").innerText = `Time: ${gameSettings.playTime} seconds`;
  document.getElementById("lives").innerHTML = 'Lives: ';
  Array.from({length: gameSettings.lives}, () => document.getElementById("lives").innerHTML += ' &#9829;');
  document.getElementById("play").innerText = "Restart";
  // start game - clock and robot making
  gameSettings.gameOver = false;
  clock();
  makeRobots();
}

// animation function to move robots foward
function animate() {
  // if player lost
  if (!gameSettings.gameOver) {
    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;

    // for each robot in the array
    robotSettings.robots.forEach((robot, index) => {
      // update the mixer with the animation
      robot.mixer.update(deltat * robotSettings.walkingRobotAnimation);
      // update the z position forward if not dead
      if (!robot.dead){
        robot.position.z += deltat * robotSettings.walkingRobotTranslation;
      } else {
        robot.rotation.x += 0.05
      }
      // Robot gets to the end line
      if (robot.position.z >= robotSettings.end) {
        scene.remove(robot);
        robotSettings.robots.splice(index, 1);
        gameSettings.lives -= 1;
        document.getElementById("lives").innerHTML = 'Lives: ';
        Array.from({length: gameSettings.lives}, () => document.getElementById("lives").innerHTML += ' &#9829;');
        if (gameSettings.lives == 0) {
          alert("You have lost")
          gameSettings.gameOver = true;
          resetGame();
          return;
        }
      }
    })
  }
}

// function to make new robots every n second
function makeRobots() {
  var id = 0;
  robotSettings.robotMaker = window.setInterval(function () {
    if (!gameSettings.gameOver) {
      var clone = cloneFbx(robotSettings.object);
      // we set randomly in x by its right and left max, and in the z start line
      clone.position.set(Math.floor(Math.random() * (robotSettings.right - robotSettings.left + 1)) + robotSettings.left, -5, robotSettings.start);

      var mixer = new THREE.AnimationMixer(clone);
      mixer.clipAction(robotSettings.animation).play();

      scene.add(clone);
      clone.mixer = mixer
      clone.id = id++;
      robotSettings.robots.push(clone);
    }
  }, 5000 / gameSettings.difficulty);
}

// function to detect mouse click with raycast kill robot if hit
function kill(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);
  // check if its a robot
  if (intersects.length > 0 && intersects[0].object.name == "Robot1") {
    if (!gameSettings.gameOver) {
      var obj = intersects[0].object.parent;
      gameSettings.score++;
      document.getElementById("score").innerHTML = `Score: ${gameSettings.score.toString()}`;
      obj.rotation.x = Math.PI/2
      obj.position.y = -0
      obj.dead = true;
      window.setTimeout(()=>{
        robotSettings.robots.splice(robotSettings.robots.findIndex((robot) => robot.id == obj.id), 1);
        scene.remove(obj);
      }, 1000)
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// function to change game difficulty
function setDifficulty(){
  gameSettings.difficulty = document.getElementById("difficulty").value;
}

function run() {
  requestAnimationFrame(function () {
    run();
  });

  // Render the scene
  renderer.render(scene, camera);

  // If the game is on
  if (!gameSettings.gameOver) {
    animate();
  }
}

function setLightColor(light, r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  light.color.setRGB(r, g, b);
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "./images/surface.jpg";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function createScene(canvas) {

  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

  // Set to full screen
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Turn on shadows
  renderer.shadowMap.enabled = true;
  // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
  camera.position.set(0, 30, 160);


  scene.add(camera);

  // Create a group to hold all the objects
  root = new THREE.Object3D;

  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(30, 80, 100);
  spotLight.target.position.set(0, 0, 0);
  root.add(spotLight);

  spotLight.castShadow = true;

  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.camera.fov = 45;

  spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
  spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

  ambientLight = new THREE.AmbientLight(0x888888);
  root.add(ambientLight);

  // Create the objects
  loadFBX();
  // Create a group to hold the objects
  group = new THREE.Object3D;
  root.add(group);

  // Create a texture map
  var map = new THREE.TextureLoader().load(mapUrl);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(8, 8);

  var color = 0xffffff;

  // Put in a ground plane to show off the lighting
  geometry = new THREE.PlaneGeometry(500, 500, 50, 50);
  var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: map, side: THREE.DoubleSide }));

  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -4.02;

  // Add the mesh to our group
  group.add(mesh);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  raycaster = new THREE.Raycaster();

  // Now add the group to our scene
  scene.add(root);

  window.addEventListener('mousedown', kill);

  // get high score
  let high_score = JSON.parse(window.localStorage.getItem('high_score'));
  if (high_score) {
    gameSettings.highScore = high_score;
    document.getElementById("high_score").innerHTML = `High score: ${high_score.toString()}`;
  }

}
