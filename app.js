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
directionalLight.intensity = 1;
directionalLight.rotation.set( 0, 0, 0 );
scene.add( directionalLight );

var geometry = new THREE.IcosahedronGeometry(1,6);

var loader = new THREE.TextureLoader();
var texture = loader.load("2_no_clouds_8k.jpg");
var bumpmap = loader.load("elev_bump_8k.jpg");
var specularmap = loader.load("water_8k.png");
var material = new THREE.MeshPhongMaterial( {
 map: texture,
 bumpMap: bumpmap,
 bumpScale: 0.005,
 specularMap: specularmap,
 specular: new THREE.Color('grey'),
 shading: THREE.SmoothShading
 } );

var mesh = new THREE.Mesh( geometry, material );
mesh.rotateY(Math.PI/2);
scene.add(mesh);

render();

