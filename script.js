let cube, model, mixer, clock;

let container, stats, gui, params;
let scene, camera, renderer, hemiLight;
let time = 0;
let frame = 0;

function setupGLTF() {
  const loader = new THREE.GLTFLoader();
  console.log(loader);
  scene = new THREE.Scene();
  
  loader.load(
    //both animation&model works:
    //1. fox model
    // "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2FFox.glb?v=1624811797502", 
  
    //2. Footman_rig model
    // "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2FFootman_RIG.glb?v=1624812048970",
    
    //3. EggysecondTest
    // "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2FCubegltftest.gltf?v=1626150211497", // successful model with animation
    // "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2Fbrushmanmodelonly.glb?v=1626874020500",
    //"https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2Ftest4Brushman.glb?v=1627369904670", // test4
    // "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2Fanimationtest3brushman.glb?v=1627390049709",//test3
    // "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2Fanimationtest4brushman.glb?v=1627392563444", //my current model 
    // "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2Fcolormanmodel7.gltf?v=1627547715981",
    // "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2FBrushmantest8.gltf?v=1627739133791",
    // "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2FBrushmantest9.gltf?v=1627739335579",
    // "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2FBrushmantest10.gltf?v=1627739533904",
    "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2Fbrushmantest11.gltf?v=1627739777409",
    
    gltf => {
      // called when the resource is loaded

      console.log("Model is loaded");
      // console.log(gltf.animation[1]);
      model = gltf.scene.children[0];
      console.log(gltf.animations[0]);
      // use after animation is added:
      // gltf.scene.scale.set(160,160,160);
      mixer = new THREE.AnimationMixer(gltf.scene);
      var action = mixer.clipAction(gltf.animations[0]);
      console.log(action);
      action.play();
      // action.setLoop(2,5);
      
      scene.add(gltf.scene);
      // mixer= new THREE.AnimationMixer(gltf.scene);
      // gltf.animations.forEach((clip) => {mixer.clipAction(clip).play(); });
      // console.log(model);
      //let mesh1 = gltf.scene;
    },
    xhr => {
      // called while loading is progressing
      console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    error => {
      // called when loading has errors
      console.error("An error happened", error);
    }
  );
}

// function loadModel(url) {
//   return new Promise(resolve => {
//     new THREE.GLTFLoader().load(url, resolve);
//   });
// }

// let model1, model2;
// //fox
// let p1 = loadModel('https://cdn.glitch.com/f2ed76f1-76e2-4403-a68d-cc3484e05a36%2FFox.glb?v=1624806759004').then(result => {  model1 = result.scene.children[0]; });
// //footman
// let p2 = loadModel('https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2FFootman_RIG.glb?v=1624812048970').then(result => {  model2 = result.scene.children[0]; });

// Promise.all([p1,p2]).then(() => {
//    //do something to the model
//    model1.position.set(0,0,0);
//    model2.position.set(0,20,0);
//    //add model to the scene
//    scene.add(model1);
//    scene.add(model2);
// });



///// p5.js /////

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("container-p5");
  canvas.hide();
  background(50);
  

  initTHREE();
  animate();
  
}

function draw() {
  
  noLoop();
  
}

///// three.js /////

function initTHREE() {
  // scene
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // scene.background = new THREE.Color(0xdddddd);
  // camera (fov, ratio, near, far)
    setupGLTF();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  camera.position.z = 100;
  hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
  // hemiLight.position.set(0, 0, 1000);
  // console.log(hemiLight);
  // scene.add(hemiLight);
  	var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	scene.add( ambientLight );

	var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( pointLight );
	scene.add( camera );

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor("#333333");
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // container
  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  // controls
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  // gui
  // https://davidwalsh.name/dat-gui
  gui = new dat.gui.GUI();
  params = {
    value1: 0,
    value2: 0,
    value3: 0
  };
  gui.add(params, "value1", -10, 10).step(10);
  gui
    .add(params, "value2")
    .min(-10)
    .max(10)
    .step(10);
  // .listen()
  // .onChange(callback)
  let folder = gui.addFolder("FolderName");
  folder.add(params, "value3", -10, 10).step(1);

  // stats
  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  container.appendChild(stats.dom);
  // render();

}

function animate() {
  // requestAnimationFrame(animate);
  // stats.update();
  // time = performance.now();
  // frame++;
	requestAnimationFrame( animate );

	var delta = clock.getDelta();

	if ( mixer ) mixer.update( delta );

	render();

	stats.update();
  // updateTHREE();

  
}



function render() {
  renderer.render(scene, camera);
}

// event listeners
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//geometries in three.js
function setupTHREE() {
  // add your code here!

  // (example)
  cube = getBox();
  // cube.position.set(-1000, 10, 20);
  scene.add(cube);
}

function updateTHREE() {
  // add your code here!

  // (example)
  // model.rotation.x += 0.01;
  // model.rotation.z += 0.01;

  cube.scale.x = 10.0;
  cube.scale.y = 10.0;
  cube.scale.z = 10.0;
}

function getBox() {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshNormalMaterial({
    //wireframe: true
  });
  let mesh = new THREE.Mesh(geometry, material);

  return mesh;
}



// for the linter
/* global
THREE p5 GLTFLoader rotation scale ml5 Stats dat alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase 2D Primitives arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex plane box sphere cylinder cone ellipsoid torus loadModel model HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS print frameCount deltaTime focused cursor frameRate noCursor displayWidth displayHeight windowWidth windowHeight windowResized width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams remove disableFriendlyErrors noLoop loop isLooping push pop redraw select selectAll removeElements changed input createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement createCanvas resizeCanvas noCanvas createGraphics blendMode drawingContext setAttributes boolean string number applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate storeItem getItem clearStorage removeItem createStringDict createNumberDict append arrayCopy concat reverse shorten shuffle sort splice subset float int str byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ turnAxis setMoveThreshold setShakeThreshold deviceMoved deviceTurned deviceShaken keyIsPressed key keyCode keyPressed keyReleased keyTyped keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseWheel mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveFrames image tint noTint imageMode pixels blend copy filter THRESHOLD GRAY OPAQUE INVERT POSTERIZE BLUR ERODE DILATE get loadPixels set updatePixels loadImage loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo Output createWriter save saveJSON saveStrings saveTable day hour minute millis month second year abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess camera perspective ortho frustum createCamera setCamera ADD CENTER CORNER CORNERS POINTS WEBGL RGB ARGB HSB LINES CLOSE BACKSPACE DELETE ENTER RETURN TAB ESCAPE SHIFT CONTROL OPTION ALT UP_ARROW DOWN_ARROW LEFT_ARROW RIGHT_ARROW sampleRate freqToMidi midiToFreq soundFormats getAudioContext userStartAudio loadSound createConvolver setBPM saveSound getMasterVolume masterVolume soundOut chain drywet biquadFilter process freq res gain toggle setType pan phase triggerAttack triggerRelease setADSR attack decay sustain release dispose notes polyvalue AudioVoice noteADSR noteAttack noteRelease isLoaded playMode set isPlaying isPaused setVolume getPan rate duration currentTime jump channels frames getPeaks reverseBuffer onended setPath setBuffer processPeaks addCue removeCue clearCues getBlob getLevel toggleNormalize waveform analyze getEnergy getCentroid linAverages logAverages getOctaveBands fade attackTime attackLevel decayTime decayLevel releaseTime releaseLevel setRange setExp width output stream mediaStream currentSource enabled amplitude getSources setSource bands panner positionX positionY positionZ orient orientX orientY orientZ setFalloff maxDist rollof leftDelay rightDelay delayTime feedback convolverNode impulses addImpulse resetImpulse toggleImpulse sequence getBPM addPhrase removePhrase getPhrase replaceSequence onStep musicalTimeMode maxIterations synced bpm timeSignature interval iterations compressor knee ratio threshold reduction record isDetected update onPeak WaveShaperNode getAmount getOversample amp setInput connect disconnect play pause stop start add mult
*/
