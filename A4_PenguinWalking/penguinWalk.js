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
        object.rotation.y = -Math.PI/2;
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


function run() {
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

         // Update the animations
        KF.update();

        // update controls
        controls.update();

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


const path = [
  {x: 0, y: 0, z: 0,},
  {x: -8,y: 0,z: -4}, 
  {x: -16, y: 0, z: -8}, 
  {x: -24, y: 0, z: -4}, 
  {x: -26, y: 0, z: 0}, 
  {x: -24, y: 0, z: 4}, 
  {x: -18, y: 0, z: 8}, 
  {x: -8, y: 0, z: 4}, 
  {x: 0, y: 0, z: 0}, // midle point
  {x: 8, y: 0, z: -4}, 
  {x: 16, y: 0, z: -8}, 
  {x: 24, y: 0, z: -4},
  {x: 26, y: 0, z: 0},
  {x: 24, y: 0, z: 4},
  {x: 16, y: 0, z: 8},
  {x: 8, y: 0, z: 4},
  {x: 0, y: 0, z: 0}
];

angles = [
  {x: 0, y: Math.PI/2, z: 0},
  {x: 0, y: -Math.PI/2, z: 0}
];

function getKeys(len){
  return Array(len).fill().map((value, i) => i / (len- 1))
}

function getAngles(len){
  return  Array(len).fill().map((value, i) => {
    return (i%2) ? {x: 0, y: Math.PI/6, z: 0} : {x: 0, y: -Math.PI/6, z: 0}
  })
}


function playAnimations() {
  animation = new KF.KeyFrameAnimator;
  animation.init({
    interps: [{
        keys: getKeys(path.length),
        values: path,
        target: penguin.position
      },
      {
        keys: getKeys(path.length * 2),
        values: getAngles(path.length * 2),
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

