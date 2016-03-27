console.log("test0");

var render = function () {
    requestAnimationFrame( render );

    renderer.render( scene, camera );
};

var updateLoop = function () {

}

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(43, window.innerWidth/window.innerHeight, 0.01, 3000 );

camera.position.set( 0.92, 1.12, 0.98 );
camera.rotation.set( -0.85, 0.55, 0.54 );

var controls = new CameraControls(camera);

scene.add( new THREE.AmbientLight(0x8C8C8C) );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 1, 0, 1 );
scene.add( directionalLight );

var icosphere = new IcoSphere(6);

scene.add(icosphere.mesh);

render();

