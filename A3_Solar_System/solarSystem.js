// Daniel Charua A01017419
var renderer = null

var duration = 5000; // ms
var currentTime = Date.now();
// Create a group to hold all the objects
var solarGroup = new THREE.Object3D(0,0,0);
var mercuryGroup = new THREE.Object3D(0,0,0)
var venusGroup = new THREE.Object3D(0,0,0);
var earthGroup2 = new THREE.Object3D(0,0,0);
var marsGroup = new THREE.Object3D(0,0,0);
var jupiterGroup = new THREE.Object3D(0,0,0);
var saturnGroup2 = new THREE.Object3D(0,0,0);
var uranusGroup = new THREE.Object3D(0,0,0);
var neptuneGroup = new THREE.Object3D(0,0,0);
var plutoGroup = new THREE.Object3D(0,0,0);
var asteroidGroup = new THREE.Object3D(0,0,0);
var sun= null;
var mercury= null;
var venus= null;
var earth= null;
var mars= null;
var jupiter= null;
var saturn= null;
var uranus= null;
var neptune= null;
var pluto= null;
var moon= null;

function animate() {
  controls.update();
  var now = Date.now();
  var deltat = now - currentTime;
  currentTime = now;
  var fract = deltat / duration;
  var angle = Math.PI * 0.8* fract;

  // The rotation animation
  solarGroup.rotation.y += angle;
  mercuryGroup.rotation.y += angle /1.4;
  venusGroup.rotation.y += angle /2.4;
  earthGroup2.rotation.y += angle/3.5;
  marsGroup.rotation.y += angle/6;
  jupiterGroup.rotation.y += angle/2.1;
  saturnGroup2.rotation.y += angle/3.2;
  uranusGroup.rotation.y += angle/2.2;
  neptuneGroup.rotation.y += angle/3.5;
  plutoGroup.rotation.y += angle/1.2;

  sun.rotation.y += angle * 2;
  mercury.rotation.y += angle * 2;
  venus.rotation.y +=angle * 2;
  earth.rotation.y += angle;
  mars.rotation.y += angle * 2;
  jupiter.rotation.y += angle * 2;
  saturn.rotation.y += angle * 2;
  uranus.rotation.y += angle * 2;
  neptune.rotation.y += angle * 2;
  pluto.rotation.y += angle * 2;
}

function run() {
  requestAnimationFrame(function(){
     run();
  });

  // Render the scene
  renderer.render(scene, camera);

  // Spin the cube for next frame
  animate();
}

function createScene(canvas) {
  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

  // Set the viewport size
  renderer.setSize(canvas.width, canvas.height);

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Set the background image
  new THREE.TextureLoader().load('textures/2k_stars_milky_way.jpg' , texture => scene.background = texture);
  //scene.background = new THREE.Color(0.2, 0.2, 0.2);
  // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
  camera.position.z = 100;
  camera.position.y = 15;
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.update();
  scene.add(camera);

  
  // Add a directional light to show off the objects
  var light = new THREE.PointLight( 0xffffff, 1.5, 1000 );
  light.position.set( 0, 0, 0 );
  scene.add( light );
  // var light = new THREE.DirectionalLight( "rgb(255, 255, 100)", 1.5);

  // Position the light out from the scene, pointing at the origin

  // This light globally illuminates all objects in the scene equally.
  // Cannot cast shadows
  var ambientLight = new THREE.AmbientLight(0xffcc00, 0.5);
  scene.add(ambientLight);

  // Create Textures
  let sunTexture = new THREE.TextureLoader().load("textures/2k_sun.jpg");
  let mercuryTexture = new THREE.TextureLoader().load("textures/mercurymap.jpg");
  let venusTexture =  new THREE.TextureLoader().load("textures/venusmap.jpg");
  let earthTexture =  new THREE.TextureLoader().load("textures/earthmap1k.jpg");
  let moonTexture =  new THREE.TextureLoader().load("textures/moonmap1k.jpg");
  let marsTexture =  new THREE.TextureLoader().load("textures/mars_1k_color.jpg");
  let jupiterTexture =  new THREE.TextureLoader().load("textures/jupitermap.jpg");
  let saturnTexture =  new THREE.TextureLoader().load("textures/saturnmap.jpg");
  let saturnRingsTexture = new THREE.TextureLoader().load("textures/saturnringcolor.jpg");
  let uranusTexture = new THREE.TextureLoader().load("textures/uranusmap.jpg");
  let neptuneTexture = new THREE.TextureLoader().load("textures/neptunemap.jpg");
  let plutoTexture = new THREE.TextureLoader().load("textures/plutomap1k.jpg");
  let asteriodTexture = new THREE.TextureLoader().load("textures/AsteroidStrike.jpg");
  let asteriodTexture2 = new THREE.TextureLoader().load("textures/AsteroidStrike.jpg");


  // Assign texture to material
  let sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
  let mercuryMaterial = new THREE.MeshPhongMaterial({map: mercuryTexture});
  let venusMaterial = new THREE.MeshPhongMaterial({map: venusTexture});
  let earthMaterial = new THREE.MeshPhongMaterial({map: earthTexture});
  let moonMaterial = new THREE.MeshPhongMaterial({map: moonTexture});
  let marsMaterial = new THREE.MeshPhongMaterial({map: marsTexture});
  let jupiterMaterial = new THREE.MeshPhongMaterial({map: jupiterTexture});
  let saturnMaterial = new THREE.MeshPhongMaterial({map: saturnTexture});
  let saturnRingsMaterial = new THREE.MeshPhongMaterial({map: saturnRingsTexture,side: THREE.DoubleSide,transparent: true,opacity: 1});
  let uranusMaterial = new THREE.MeshPhongMaterial({map: uranusTexture});
  let neptuneMaterial = new THREE.MeshPhongMaterial({map: neptuneTexture});
  let plutoMaterial = new THREE.MeshPhongMaterial({map: plutoTexture});
  let OrbitsMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
  let asteroidMaterial = new THREE.MeshBasicMaterial({map: asteriodTexture});
  let asteroidMaterial2 = new THREE.MeshBasicMaterial({map: asteriodTexture2});



  // Center the solarGroup

  // sun geometry
  sun = new THREE.Mesh(new THREE.SphereGeometry(15, 20, 20), sunMaterial);
  sun.position.set(0, 0, 0);
  sun.rotation.x = Math.PI / 5;
  sun.rotation.y = Math.PI / 5;
  solarGroup.add(sun);
  scene.add(solarGroup);

  //  Mercury geometry
  mercury = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 20), mercuryMaterial);
  mercury.position.set(16, 0, 0);
  mercury.rotation.y = Math.PI / 5;
  mercury.rotation.x = Math.PI / 5;
  mercuryGroup.add(mercury);

  // Mercury Orbit
  mercuryOrbit = new THREE.Mesh(new THREE.TorusGeometry(16, 0.05, 2, 50), OrbitsMaterial);
  mercuryOrbit.position.set(0, 0, 0);
  mercuryOrbit.rotation.x = Math.PI / 2;
  mercuryGroup.add(mercuryOrbit);
  scene.add(mercuryGroup);

  // Venus geometry
  venus = new THREE.Mesh(new THREE.SphereGeometry(1.3, 20, 20), venusMaterial);
  venus.position.set(19, 0, 0);
  venus.rotation.y = Math.PI / 5;
  venus.rotation.x = Math.PI / 5;
  venusGroup.add(venus);
 

  // Venus Orbit
  venusOrbit = new THREE.Mesh(new THREE.TorusGeometry(19, 0.05, 3, 50), OrbitsMaterial);
  venusOrbit.position.set(0, 0, 0);
  venusOrbit.rotation.x = Math.PI / 2;
  venusGroup.add(venusOrbit);
  scene.add(venusGroup);

  // Earth geometry
  // Earth Group with moon and planet
  var earthGroup = new THREE.Object3D;
  earthGroup.position.set(24, 0, 0);

  earth = new THREE.Mesh(new THREE.SphereGeometry(1.4, 20, 20), earthMaterial);
  earth.position.set(0, 0, 0);
  earthGroup.add(earth);

  // Moon  geometry
  var moon = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 10), moonMaterial);
  moon.position.set(1.2, 0, 1.2);
  earth.add(moon);

  // Earth Orbit
  var earthOrbit = new THREE.Mesh(new THREE.TorusGeometry(24, 0.05, 3, 50), OrbitsMaterial);
  earthOrbit.position.set(-24, 0, 0);
  earthOrbit.rotation.x = Math.PI / 2;
  earthGroup.add(earthOrbit);
  earthGroup2.add(earthGroup)
  scene.add(earthGroup2)

  // Mars geometry
  mars = new THREE.Mesh(new THREE.SphereGeometry(0.8, 20, 20), marsMaterial);
  mars.position.set(28, 0, 0);
  mars.rotation.y = Math.PI / 5;
  mars.rotation.x = Math.PI / 5;
  marsGroup.add(mars);

  // Mars Orbit
  var marsOrbit = new THREE.Mesh(new THREE.TorusGeometry(28, 0.05, 3, 50), OrbitsMaterial);
  marsOrbit.position.set(0, 0, 0);
  marsOrbit.rotation.x = Math.PI / 2;
  marsGroup.add(marsOrbit);
  scene.add(marsGroup);

  // Asteroids
  let ammount = 100;
  // row 1
  for(let i = 0; i < ammount; i++){
    let asteroid = new THREE.Mesh(new THREE.SphereGeometry(Math.random()/2, 20, 20), Math.random() > 0.5 ? asteroidMaterial : asteroidMaterial2);
    asteroid.position.set(Math.cos(i * 2 * Math.PI / ammount) * (31 + (Math.random()* 2)) , 0, Math.sin(i * 2 * Math.PI / ammount) * (31 + (Math.random() * 2)));
    asteroidGroup.add(asteroid);
  }

  // row 2
  for(let i = 0; i < ammount; i++){
    let asteroid = new THREE.Mesh(new THREE.SphereGeometry(Math.random()/2, 20, 20),  Math.random() > 0.5 ? asteroidMaterial : asteroidMaterial2);
    asteroid.position.set(Math.cos(i * 2 * Math.PI / ammount) * (32 + (Math.random()* 2)) , 0, Math.sin(i * 2 * Math.PI / ammount) * (32 + (Math.random() * 2)));
    asteroidGroup.add(asteroid);
  }
  solarGroup.add(asteroidGroup)

  // Jupiter geometry
  jupiter = new THREE.Mesh(new THREE.SphereGeometry(3.5, 20, 20), jupiterMaterial);
  jupiter.position.set(39, 0, 0);
  jupiter.rotation.y = Math.PI / 5;
  jupiter.rotation.z = Math.PI / 5;
  jupiterGroup.add(jupiter);

  // Jupiter Orbit
  var jupiterOrbit = new THREE.Mesh(new THREE.TorusGeometry(39, 0.05, 3, 50), OrbitsMaterial);
  jupiterOrbit.position.set(0, 0, 0);
  jupiterOrbit.rotation.x = Math.PI / 2 ;
  jupiterGroup.add(jupiterOrbit);
  scene.add(jupiterGroup);

  // Satrun Groupe with the planet and rings
  var saturnGroup = new THREE.Object3D;
  saturnGroup.position.set(49, 0, -6);

  // Saturn geometry
  saturn = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 20), saturnMaterial);
  saturn.position.set(0, 0, 0);
  saturn.rotation.y = Math.PI / 5;
  saturnGroup.add(saturn);

  // rings geometry
  var saturnRings = new THREE.Mesh(new THREE.RingGeometry(5, 3, 20), saturnRingsMaterial);
  saturnRings.position.set(0, 0, 0);
  saturnRings.rotation.x = Math.PI / 2;
  saturn.add(saturnRings);

  // Saturn Orbit
  var saturnOrbit = new THREE.Mesh(new THREE.TorusGeometry(49, 0.05, 3, 50), OrbitsMaterial);
  saturnOrbit.position.set(0, 0, 0);
  saturnOrbit.rotation.x= Math.PI / 2;
  solarGroup.add(saturnOrbit)
  saturnGroup2.add(saturnGroup)
  scene.add(saturnGroup2);


  // Uranus geometry
  uranus = new THREE.Mesh(new THREE.SphereGeometry(2.2, 20, 20), uranusMaterial);
  uranus.position.set(60, 0, 0);
  uranus.rotation.y = Math.PI / 5;
  uranus.rotation.x = Math.PI / 5;
  uranusGroup.add(uranus);

  // Uranus Orbit
  var uranusOrbit = new THREE.Mesh(new THREE.TorusGeometry(60, 0.05, 3, 50), OrbitsMaterial);
  uranusOrbit.position.set(0, 0, 0);
  uranusOrbit.rotation.x = Math.PI / 2;
  uranusGroup.add(uranusOrbit);
  scene.add(uranusGroup);

  // Neptune geometry
  neptune = new THREE.Mesh(new THREE.SphereGeometry(1.6, 20, 20), neptuneMaterial);
  neptune.position.set(67, 0, 0);
  neptune.rotation.y = -Math.PI / 5;
  neptune.rotation.x = -Math.PI / 5;
  neptuneGroup.add(neptune);

  // Neptune Orbit
  var neptuneOrbit = new THREE.Mesh(new THREE.TorusGeometry(67, 0.05, 3, 50), OrbitsMaterial);
  neptuneOrbit.position.set(0, 0, 0);
  neptuneOrbit.rotation.x = Math.PI / 2;
  neptuneGroup.add(neptuneOrbit);
  scene.add(neptuneGroup);

  // Pluto geometry
  pluto = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 20), plutoMaterial);
  pluto.position.set(71, 0, 0);
  pluto.rotation.y = Math.PI / 5;
  pluto.rotation.x = Math.PI / 5;
  plutoGroup.add(pluto);

  // Pluto Orbit
  var plutoOrbit = new THREE.Mesh(new THREE.TorusGeometry(71, 0.05, 3, 50), OrbitsMaterial);
  plutoOrbit.position.set(0, 0, 0);
  plutoOrbit.rotation.x = Math.PI / 2;
  plutoGroup.add(plutoOrbit);
  scene.add(plutoGroup);

  
}