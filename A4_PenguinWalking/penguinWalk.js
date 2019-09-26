// 1. Enable shadow mapping in the renderer. 
// 2. Enable shadows and set shadow parameters for the lights that cast shadows. 
// Both the THREE.DirectionalLight type and the THREE.SpotLight type support shadows. 
// 3. Indicate which geometry objects cast and receive shadows.

var renderer = null, 
scene = null, 
camera = null,
root = null,
penguin =  new THREE.Object3D;
orbitControls = null;

var mtlLoader = null;
var duration = 20000; // ms
var currentTime = Date.now();

// ANIMATION VARIABLES
var animation = null,
  positionKeys = [],
  movements = [],
  rotationKeys = [],
  angles = [];


function loadMTL(){
if(!mtlLoader)
    mtlLoader = new THREE.OBJLoader(),

    mtlLoader.load('./Penguin_obj/penguin.obj', function(object){
        var texture = new THREE.TextureLoader().load('./Penguin_obj/peng_texture.jpg');
        var eyeTexture = new THREE.TextureLoader().load('./Penguin_obj/peng_eye_texture.jpg');
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;
            }
        } );
        object.scale.set(1,1,1);
        object.position.z = 0;
        object.position.x = 0;
        object.rotation.y = 0;
        penguin.add(object)
        scene.add(penguin);
    },
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    });
}

function animate() {
    controls.update();
    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;
}

function run() {
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

         // Update the animations
        KF.update();

        // Spin the cube for next frame
        animate();

}

function setLightColor(light, r, g, b){
    r /= 255;
    g /= 255;
    b /= 255;
    
    light.color.setRGB(r, g, b);
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var pointLight = null;
var mapUrl = "./snow.jpeg";

var SHADOW_MAP_WIDTH = 3048, SHADOW_MAP_HEIGHT = 3048;

function createScene(canvas) {
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.BasicShadowMap;
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(80, 80, 80);
    scene.add(camera);

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.update();
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // spot
    spotLight = new THREE.SpotLight (0xffffff, 0.4);
    spotLight.position.set(-30, 50, 20);
    spotLight.target.position.set(0, 0, 0);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 400;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.8);
    root.add(ambientLight);
    
    pointLight = new THREE.PointLight(0xffffff, 0.8, 0);
    pointLight.position.set(0,1.5,15);

    pointLight.castShadow = true;

    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 200;
    pointLight.shadow.camera.fov = 45;

    pointLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    loadMTL();

    // Create a group to hold the objects
    snow = new THREE.Object3D;
    

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(400, 400, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    
    // Add the mesh to our group
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    snow.add( mesh );

    root.add(snow);
    // Now add the group to our scene
    scene.add( root );
}


const path = [{
    x: 0,
    y: 0,
    z: 0,
  }, //  0
  {
    x: -2,
    y: 0,
    z: -1
  }, //  1
  {
    x: -4,
    y: 0,
    z: -2
  }, //  2
  {
    x: -6,
    y: 0,
    z: -1
  }, //  3
  {
    x: -6.5,
    y: 0,
    z: 0
  }, //  4
  {
    x: -6,
    y: 0,
    z: 1
  }, //  5
  {
    x: -4,
    y: 0,
    z: 2
  }, //  6
  {
    x: -2,
    y: 0,
    z: 1
  }, //  7
  {
    x: 0,
    y: 0,
    z: 0
  }, //  8
  {
    x: 2,
    y: 0,
    z: -1
  }, //  9
  {
    x: 4,
    y: 0,
    z: -2
  }, // 10
  {
    x: 6,
    y: 0,
    z: -1
  }, // 11
  {
    x: 6.5,
    y: 0,
    z: 0
  }, // 12
  {
    x: 6,
    y: 0,
    z: 1
  }, // 13
  {
    x: 4,
    y: 0,
    z: 2
  }, // 14
  {
    x: 2,
    y: 0,
    z: 1
  } // 15
];

function setKeysTime(numeroSaltos) {
    tiempoPorSalto = 1 / numeroSaltos;
    tiempoMovimientoSalto = tiempoPorSalto / jumpMovement.length;
    for (var i = 0; i < numeroSaltos; i++) {
      for (var i2 = 0; i2 < jumpMovement.length; i2++) {
        positionKeys.push((i * tiempoPorSalto) + (i2 * tiempoMovimientoSalto));
      }
      rotationKeys.push(i * tiempoPorSalto);
    }
  }
  const jumpMovement = [0, .7, 1, .7, 0];

  
function setAllMovements() {
  let x2, z2,
    xFraction, zFraction;

  path.forEach((jump, index) => {
    if (index === path.length - 1) {
      x2 = path[0].x;
      z2 = path[0].z;
    } else {
      x2 = path[index + 1].x;
      z2 = path[index + 1].z;
    }

    setAngles(jump.x, -jump.z, x2, -z2);
    xFraction = (-jump.x + x2) / jumpMovement.length;
    zFraction = (-jump.z + z2) / jumpMovement.length;
    jumpMovement.forEach((jumpMove, index) => {
        movements.push({
          x: jump.x + (index * xFraction),
          y: jumpMove,
          z: jump.z + (index * zFraction)
        })
      });
  });
}

function setAngles(x1, z1, x2, z2) {
  angles.push({
    y: Math.atan2(-(z2 - z1), -(x2 - x1))
  });
}

setKeysTime(path.length);
setAllMovements();



function playAnimations() {
  animation = new KF.KeyFrameAnimator;
  animation.init({
    interps: [{
        keys: positionKeys,
        values: movements,
        target: penguin.position
      },
      {
        keys: rotationKeys,
        values: angles,
        target: penguin.rotation
      },
    ],
    loop: true,
    duration: 15000,
  });

  animation.start();
}

function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

