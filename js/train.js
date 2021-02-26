let container;
let scene;
let camera;
let mesh;
let renderer;

const mixers = [];
const clock = new THREE.Clock();

function init() {
    container = document.querySelector("#scene-container");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8fbcd4);

    createCamera();
    createControls();
    createLights();
    // createMeshes();
    loadModels();
    createRenderer();

    renderer.setAnimationLoop(() => {
        update();
        render();
    });
}

function createCamera() {
    const fov = 35;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-1.5, 1.5, 6.5);
}

function createControls() {
    const controls = new THREE.OrbitControls(camera, container);
}

function createLights() {
    const ambientLight = new THREE.HemisphereLight(
        0xddeeff,
        0x0f0e0d,
        5
    );

    const mainLight = new THREE.DirectionalLight(0xffffff, 5);
    mainLight.position.set(10, 10, 10);

    scene.add(ambientLight, mainLight);
}

function loadModels() {
    const loader = new THREE.GLTFLoader();

    const onLoad = (gltf, position) => {
        const model = gltf.scene.children[0];
        model.position.copy(position);
        model.scale.set(0.025, 0.025, 0.025);

        const animation = gltf.animations[0];

        const mixer = new THREE.AnimationMixer(model);
        mixers.push(mixer);

        const action = mixer.clipAction(animation);
        action.play();

        scene.add(model);
    }

    const onProgress = () => {};

    const onError = (errorMessage) => {
        console.log(errorMessage);
    };

    const parrotPosition = new THREE.Vector3(0, 0, 2.5);
    loader.load("models/Parrot.glb", gltf => onLoad(gltf, parrotPosition), onProgress, onError);

    const flamingoPosition = new THREE.Vector3( 7.5, 0, -10);
    loader.load("models/Flamingo.glb", gltf => onLoad(gltf, flamingoPosition), onProgress, onError);

    const storkPosition = new THREE.Vector3( 0, -2.5, -10);
    loader.load("models/Stork.glb", gltf => onLoad(gltf, storkPosition), onProgress, onError);
}

function createMaterials() {
    const body = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        flatShading: true
    });

    body.color.convertSRGBToLinear();

    const detail = new THREE.MeshStandardMaterial({
        color: 0x333333,
        flatShading: true
    });

    detail.color.convertSRGBToLinear();

    return {
        body,
        detail
    };
}

function createGeometries() {
    const nose = new THREE.CylinderBufferGeometry(0.75, 0.75, 3, 12);
    const cabin = new THREE.BoxBufferGeometry(2, 2.25, 1.5);
    const chimney = new THREE.CylinderBufferGeometry(0.3, 0.1, 0.5);

    const wheel = new THREE.CylinderBufferGeometry(0.4, 0.4, 1.75, 16);
    wheel.rotateX(Math.PI / 2);

    return {
        nose,
        cabin,
        chimney,
        wheel
    };
}

function createMeshes() {
    const train = new THREE.Group();
    scene.add(train);

    const materials = createMaterials();
    const geometries = createGeometries();

    const nose = new THREE.Mesh(geometries.nose, materials.body);
    nose.rotation.z = Math.PI / 2;
    nose.position.x = -1;

    const cabin = new THREE.Mesh(geometries.cabin, materials.body);
    cabin.position.set(1.5, 0.4, 0);

    const chimney = new THREE.Mesh(geometries.chimney, materials.detail);
    chimney.position.set(-2, 0.9, 0);

    const smallWheelRear = new THREE.Mesh(geometries.wheel, materials.detail);
    smallWheelRear.position.set(0, -0.5, 0);

    const smallWheelCenter = smallWheelRear.clone();
    smallWheelCenter.position.x = -1;

    const smallWheelFront = smallWheelRear.clone();
    smallWheelFront.position.x = -2;

    const bigWheel = smallWheelRear.clone();
    bigWheel.scale.set(2, 2, 1.25);
    bigWheel.position.set(1.5, -0.1, 0);

    train.add(
        nose,
        cabin,
        chimney,
        smallWheelRear,
        smallWheelCenter,
        smallWheelFront,
        bigWheel
    );
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
    const delta = clock.getDelta();
    for(const mixer of mixers) {
        mixer.update(delta);
    }
}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);

init();