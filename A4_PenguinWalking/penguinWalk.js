// 1. Enable shadow mapping in the renderer. 
// 2. Enable shadows and set shadow parameters for the lights that cast shadows. 
// Both the THREE.DirectionalLight type and the THREE.SpotLight type support shadows. 
// 3. Indicate which geometry objects cast and receive shadows.

var renderer = null, 
scene = null, 
camera = null,
root = null,
penguin = null,
orbitControls = null;

var mtlLoader = null;
var duration = 20000; // ms
var currentTime = Date.now();


function loadMTL(){
if(!mtlLoader)
    mtlLoader = new THREE.OBJLoader(),

    mtlLoader.load('./Penguin_obj/penguin.mtl', function(object){
        var texture = new THREE.TextureLoader().load('./Penguin_obj/peng_texture.jpg');
        var eyeTexture = new THREE.TextureLoader().load('./Penguin_obj/peng_eye_texture.jpg');
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) 
            {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;
            }
        } );
                
        pinguin = object;
        pinguin.scale.set(3,3,3);
        pinguin.position.z = -3;
        pinguin.position.x = -1.5;
        pinguin.rotation.x = Math.PI / 180 * 15;
        pinguin.rotation.y = -3;
        scene.add(object);
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
    camera.position.set(-2, 6, 12);
    scene.add(camera);

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.update();
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0x000000, 1);

    // Create and add all the lights
    directionalLight.position.set(.5, 1, -3);
    directionalLight.target.position.set(0,0,0);
    directionalLight.castShadow = true;
    root.add(directionalLight);

    spotLight = new THREE.SpotLight (0x000000);
    spotLight.position.set(2, 8, 15);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow. camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.4);
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
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    
    // Add the mesh to our group
    group.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    // Now add the group to our scene
    scene.add( root );
}