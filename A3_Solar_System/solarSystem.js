// Daniel Charua A01017419
var renderer = null,
scene = null,
camera = null,
solarGroup = null,
sun = null,
mercuryOrbit = null,
mercury = null,
venusOrbit = null,
venus = null,
earthOrbit = null,
earthGroup = null,
earth = null,
moon = null,
marsOrbit = null,
mars = null,
jupiterOrbit = null,
jupiter = null,
saturnOrbit = null,
saturnGroup = null,
saturn = null,
saturnRings = null,
uranusOrbit = null,
uranus = null,
neptuneOrbit = null,
neptune = null,
plutoOrbit = null,
pluto = null;

var duration = 5000; // ms
var currentTime = Date.now();

function animate() {
  var now = Date.now();
  var deltat = now - currentTime;
  currentTime = now;
  var fract = deltat / duration;
  var angle = Math.PI * 0.8 * fract;

  // The rotation animation
  solarGroup.rotation.y += angle;
  sun.rotation.y += angle * 2;
  mercury.rotation.y += angle * 2;
  venus.rotation.y +=angle * 2;
  earth.rotation.y -= angle * 2;
  mars.rotation.y += angle * 2;
  jupiter.rotation.y += angle * 2;
  saturn.rotation.y += angle * 2;
  uranus.rotation.y += angle * 2;
  neptune.rotation.y += angle * 2;
  pluto.rotation.y += angle * 2;
  moon.rotation.y += angle * 2;
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
  new THREE.TextureLoader().load('textures/sky.jpeg' , texture => scene.background = texture);
  //scene.background = new THREE.Color(0.2, 0.2, 0.2);
  // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
  camera.position.z = 100;
  camera.position.y = 15;
  scene.add(camera);

  // Create a group to hold all the objects
  solarGroup = new THREE.Object3D;
  mercury = new THREE.Object3D;
  venus = new THREE.Object3D;
  earthGroup = new THREE.Object3D;
  mars = new THREE.Object3D;
  jupiter = new THREE.Object3D;
  saturnGroup = new THREE.Object3D;
  uranus = new THREE.Object3D;
  neptune = new THREE.Object3D;
  pluto = new THREE.Object3D;

  // Add a directional light to show off the objects
  var light = new THREE.DirectionalLight(0xffffff, 1.0);
  // var light = new THREE.DirectionalLight( "rgb(255, 255, 100)", 1.5);

  // Position the light out from the scene, pointing at the origin
  light.position.set(-.5, .2, 1);
  light.target.position.set(0, -2, 0);
  scene.add(light);

  // This light globally illuminates all objects in the scene equally.
  // Cannot cast shadows
  var ambientLight = new THREE.AmbientLight(0xffcc00, 0.5);
  scene.add(ambientLight);

  // Create Textures
  var sunTexture = new THREE.TextureLoader().load("textures/sunmap.jpg");
  var mercuryTexture = new THREE.TextureLoader().load("textures/mercurymap.jpg");
  var venusTexture =  new THREE.TextureLoader().load("textures/venusmap.jpg");
  var earthTexture =  new THREE.TextureLoader().load("textures/earthmap1k.jpg");
  var moonTexture =  new THREE.TextureLoader().load("textures/moonmap1k.jpg");
  var marsTexture =  new THREE.TextureLoader().load("textures/mars_1k_color.jpg");
  var jupiterTexture =  new THREE.TextureLoader().load("textures/jupitermap.jpg");
  var saturnTexture =  new THREE.TextureLoader().load("textures/saturnmap.jpg");
  var saturnRingsTexture = new THREE.TextureLoader().load("textures/saturnringcolor.jpg");
  var uranusTexture = new THREE.TextureLoader().load("textures/uranusmap.jpg");
  var neptuneTexture = new THREE.TextureLoader().load("textures/neptunemap.jpg");
  var plutoTexture = new THREE.TextureLoader().load("textures/plutomap1k.jpg");

  // Assign texture to material
  var sunMaterial = new THREE.MeshPhongMaterial({map: sunTexture});
  var mercuryMaterial = new THREE.MeshPhongMaterial({map: mercuryTexture});
  var venusMaterial = new THREE.MeshPhongMaterial({map: venusTexture});
  var earthMaterial = new THREE.MeshPhongMaterial({map: earthTexture});
  var moonMaterial = new THREE.MeshPhongMaterial({map: moonTexture});
  var marsMaterial = new THREE.MeshPhongMaterial({map: marsTexture});
  var jupiterMaterial = new THREE.MeshPhongMaterial({map: jupiterTexture});
  var saturnMaterial = new THREE.MeshPhongMaterial({map: saturnTexture});
  var saturnRingsMaterial = new THREE.MeshPhongMaterial({map: saturnRingsTexture,side: THREE.DoubleSide,transparent: true,opacity: 1});
  var uranusMaterial = new THREE.MeshPhongMaterial({map: uranusTexture});
  var neptuneMaterial = new THREE.MeshPhongMaterial({map: neptuneTexture});
  var plutoMaterial = new THREE.MeshPhongMaterial({map: plutoTexture});
  var OrbitsMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});

  // Center the solarGroup
  solarGroup.position.set(0, 0, 0);

  // sun geometry
  sun = new THREE.Mesh(new THREE.SphereGeometry(15, 20, 20), sunMaterial);
  sun.position.set(0, 0, 0);
  sun.rotation.x = Math.PI / 5;
  sun.rotation.y = Math.PI / 5;
  solarGroup.add(sun);

  //  Mercury geometry
  mercury = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 20), mercuryMaterial);
  mercury.position.set(16, 0, 0);
  mercury.rotation.y = Math.PI / 5;
  mercury.rotation.x = Math.PI / 5;
  solarGroup.add(mercury);

  // Mercury Orbit
  mercuryOrbit = new THREE.Mesh(new THREE.TorusGeometry(16, 0.05, 2, 50), OrbitsMaterial);
  mercuryOrbit.position.set(0, 0, 0);
  mercuryOrbit.rotation.x = Math.PI / 2;
  solarGroup.add(mercuryOrbit);

  // Venus geometry
  venus = new THREE.Mesh(new THREE.SphereGeometry(1.3, 20, 20), venusMaterial);
  venus.position.set(19, 0, 0);
  venus.rotation.y = Math.PI / 5;
  venus.rotation.x = Math.PI / 5;
  solarGroup.add(venus);

  // Venus Orbit
  venusOrbit = new THREE.Mesh(new THREE.TorusGeometry(19, 0.05, 3, 50), OrbitsMaterial);
  venusOrbit.position.set(0, 0, 0);
  venusOrbit.rotation.x = Math.PI / 2;
  solarGroup.add(venusOrbit);

  // Earth Group with moon and planet
  earthGroup = new THREE.Object3D;
  earthGroup.position.set(24, 0, 0);
  solarGroup.add(earthGroup);

  // Earth geometry
  earth = new THREE.Mesh(new THREE.SphereGeometry(1.4, 20, 20), earthMaterial);
  earth.position.set(0, 0, 0);
  earthGroup.add(earth);

  // Moon  geometry
  moon = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 10), moonMaterial);
  moon.position.set(1.2, 0, 1.2);
  earth.add(moon);

  // Earth Orbit
  earthOrbit = new THREE.Mesh(new THREE.TorusGeometry(24, 0.05, 3, 50), OrbitsMaterial);
  earthOrbit.position.set(0, 0, 0);
  earthOrbit.rotation.x = Math.PI / 2;
  solarGroup.add(earthOrbit);

  // Mars geometry
  mars = new THREE.Mesh(new THREE.SphereGeometry(0.8, 20, 20), marsMaterial);
  mars.position.set(28, 0, 0);
  mars.rotation.y = Math.PI / 5;
  mars.rotation.x = Math.PI / 5;
  solarGroup.add(mars);

  // Mars Orbit
  marsOrbit = new THREE.Mesh(new THREE.TorusGeometry(28, 0.05, 3, 50), OrbitsMaterial);
  marsOrbit.position.set(0, 0, 0);
  marsOrbit.rotation.x = Math.PI / 2;
  solarGroup.add(marsOrbit);

  // Jupiter geometry
  jupiter = new THREE.Mesh(new THREE.SphereGeometry(3.5, 20, 20), jupiterMaterial);
  jupiter.position.set(34, 0, 0);
  jupiter.rotation.y = Math.PI / 5;
  jupiter.rotation.z = Math.PI / 5;
  solarGroup.add(jupiter);

  // Jupiter Orbit
  jupiterOrbit = new THREE.Mesh(new THREE.TorusGeometry(34, 0.05, 3, 50), OrbitsMaterial);
  jupiterOrbit.position.set(0, 0, 0);
  jupiterOrbit.rotation.x = Math.PI / 2 ;
  solarGroup.add(jupiterOrbit);

  // Satrun Groupe with the planet and rings
  saturnGroup = new THREE.Object3D;
  saturnGroup.position.set(45, 0, -6);
  solarGroup.add(saturnGroup);

  // Saturn geometry
  saturn = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 20), saturnMaterial);
  saturn.position.set(0, 0, 0);
  saturn.rotation.y = Math.PI / 5;
  saturnGroup.add(saturn);

  // rings geometry
  saturnRings = new THREE.Mesh(new THREE.RingGeometry(5, 3, 20), saturnRingsMaterial);
  saturnRings.position.set(0, 0, 0);
  saturnRings.rotation.x = Math.PI / 2;
  saturn.add(saturnRings);

  // Saturn Orbit
  saturnOrbit = new THREE.Mesh(new THREE.TorusGeometry(45, 0.05, 3, 50), OrbitsMaterial);
  saturnOrbit.position.set(0, 0, 0);
  saturnOrbit.rotation.x= Math.PI / 2;
  solarGroup.add(saturnOrbit);

  // Uranus geometry
  uranus = new THREE.Mesh(new THREE.SphereGeometry(2.2, 20, 20), uranusMaterial);
  uranus.position.set(56, 0, 0);
  uranus.rotation.y = Math.PI / 5;
  uranus.rotation.x = Math.PI / 5;
  solarGroup.add(uranus);

  // Uranus Orbit
  uranusOrbit = new THREE.Mesh(new THREE.TorusGeometry(56, 0.05, 3, 50), OrbitsMaterial);
  uranusOrbit.position.set(0, 0, 0);
  uranusOrbit.rotation.x = Math.PI / 2;
  solarGroup.add(uranusOrbit);

  // Neptune geometry
  neptune = new THREE.Mesh(new THREE.SphereGeometry(1.6, 20, 20), neptuneMaterial);
  neptune.position.set(62, 0, 0);
  neptune.rotation.y = -Math.PI / 5;
  neptune.rotation.x = -Math.PI / 5;
  solarGroup.add(neptune);

  // Neptune Orbit
  neptuneOrbit = new THREE.Mesh(new THREE.TorusGeometry(62, 0.05, 3, 50), OrbitsMaterial);
  neptuneOrbit.position.set(0, 0, 0);
  neptuneOrbit.rotation.x = Math.PI / 2;
  solarGroup.add(neptuneOrbit);

  // Pluto geometry
  pluto = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 20), plutoMaterial);
  pluto.position.set(66, 0, 0);
  pluto.rotation.y = Math.PI / 5;
  pluto.rotation.x = Math.PI / 5;
  solarGroup.add(pluto);

  // Pluto Orbit
  plutoOrbit = new THREE.Mesh(new THREE.TorusGeometry(66, 0.05, 3, 50), OrbitsMaterial);
  plutoOrbit.position.set(0, 0, 0);
  plutoOrbit.rotation.x = Math.PI / 2;
  solarGroup.add(plutoOrbit);

  // Add all the objects in teh group to the scene
  scene.add(solarGroup);
}
