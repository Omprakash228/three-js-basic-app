let container;
let camera;
let controls;
let renderer;
let scene;
let mesh;

function init() {
  container = document.querySelector("#scene-container");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8fbcd4);

  createCamera();
  createControls();
  createLights();
  createMeshes();
  createRenderer(); 

  //VR and AR support or use window.requestAnimationFrame
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-4, 4, 10);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
}

function createLights() {
  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  // scene.add(ambientLight);

  // const mainLight = new THREE.DirectionalLight(0xffffff, 1);
  // mainLight.position.set(10, 10, 10);

  // scene.add(ambientLight, mainLight);

  const ambientLight = new THREE.HemisphereLight(
    0xddeeff,
    0x202020,
    5
  );

  const mainLight = new THREE.DirectionalLight(0xffffff, 5);
  mainLight.position.set(10,10,10);

  scene.add(ambientLight, mainLight);
}

function createMeshes() {
  const geometry = new THREE.BoxBufferGeometry(2,2,2);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/uv_test_bw.png');
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function update() {
  
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

init();