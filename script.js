let model, mixer, clock;
let keyindex = 0;
let actions, activeAction, previousAction;
let gltf;
let positionModel = [0, 0, 0];
let positionCamera = [-75, 55, 70];
let container, stats, gui, params;
let scene, camera, renderer, hemiLight;
let time = 0;
let frame = 0;
let currentStep = 0;
let command, velocity, note;
var correctChord = [60, 64, 67, 70];
var activeChord = [];
var correctNoteSequence = [60, 65, 69, 67];
var activeNoteSequence = [];

function onMIDISuccess(midiAccess) {
  console.log("midi success!");
  // document.querySelector(".step0").innerHTML = "Press any note to begin...";
  var inputs = midiAccess.inputs;
  var outputs = midiAccess.outputs;

  for (var input of midiAccess.inputs.values()) {
    input.onmidimessage = getMIDIMessage;
  }
}

function onMIDIFailure() {
  console.log(
    "Error: Could not access MIDI devices. Connect a device and refresh to try again."
  );
}

function getMIDIMessage(message) {
  var command = message.data[0];
  var note = message.data[1];
  var velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {
        noteOnListener(note, velocity);
      } else {
        noteOffListener(note);
      }
      break;
    case 128: // noteOff
      console.log("quiet");
      break;
  }
}

function noteOnListener(note, velocity) {
  switch (currentStep) {
    // If the model has been loaded.
    // The first noteOn message we get will run the first sequence
    case 1:
      // Run start up sequence
      runSequence("StartPage");
      currentStep++;
      break;

    case 2:
      // add the note to the array
      activeNoteSequence.push(note);

      var match1 = false,
        match2 = false,
        match3 = false,
        match4 = false;
      if (
        activeNoteSequence[activeNoteSequence.length - 1] ==
        correctNoteSequence[0]
      ) {
        match1 = true;
      } else if (
        activeNoteSequence[activeNoteSequence.length - 1] ==
        correctNoteSequence[1]
      ) {
        match2 = true;
      } else if (
        activeNoteSequence[activeNoteSequence.length - 1] ==
        correctNoteSequence[2]
      ) {
        match3 = true;
      } else if (
        activeNoteSequence[activeNoteSequence.length - 1] ==
        correctNoteSequence[3]
      ) {
        match4 = true;
      }
      if (match1) {
        runSequence("handstand");
      } else if (match2) {
        runSequence("idle");
      } else if (match3) {
        runSequence("jump");
      } else if (match4) {
        runSequence("slide");
      } else {
        activeNoteSequence = [];
        runSequence("wrongNote");
      }
      break;

    case 3:
      // add the note to the active chord array
      activeChord.push(note);
      break;
  }
}

function noteOffListener(note) {
  console.log("note off");
}

function runSequence(sequence) {
  switch (sequence) {
    case "StartPage":
      console.log("push any key to start");
      break;

    case "handstand":
      stopAnimations();
      mixer.clipAction(gltf.animations[0]).play();
      break;

    case "idle":
      stopAnimations();
      mixer.clipAction(gltf.animations[1]).play();
      break;

    case "jump":
      stopAnimations();
      mixer.clipAction(gltf.animations[2]).play();
      break;

    case "slide":
      stopAnimations();
      mixer.clipAction(gltf.animations[3]).play();
      break;

    case "walk":
      stopAnimations();
      mixer.clipAction(gltf.animations[4]).play();
      break;

    case "wrongNote":
      currentStep = 3;

      break;
  }
}

function keyPressed() {
  if (key >= 1 && key <= 5) {
    stopAnimations();
    keyindex = parseInt(key);

    let index = parseInt(key);
    mixer.clipAction(gltf.animations[index - 1]).play();
    
  }
}

function setupGLTF() {
  const loader = new THREE.GLTFLoader();
  console.log(loader);
  scene = new THREE.Scene();

  loader.load(
    "https://cdn.glitch.com/0aa4cfe1-11c0-401b-8a81-9c5907f3dd8b%2Fbrushmantest23.gltf?v=1630872801734",

    gltfData => {
      // called when the resource is loaded
      console.log("Model is loaded");

      gltf = gltfData;
      model = gltf.scene;
      model.position = (positionModel[0], positionModel[1], positionModel[2]);
      // use after animation is added:
      gltf.scene.scale.set(6, 6, 6);
      mixer = new THREE.AnimationMixer(gltf.scene);
      // gltf.animations.forEach((clip) => {mixer.clipAction(clip).play(); });
      let action = mixer.clipAction(gltf.animations[1]);
      action.play();
      // action.setLoop(2,5);

      scene.add(gltf.scene);
      currentStep = 1;
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

///// p5.js /////

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("container-p5");
  canvas.hide();
  background(0);

  initTHREE();
  if (navigator.requestMIDIAccess) {
    console.log("This browser supports WebMIDI!");

    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("WebMIDI is not supported in this browser.");
  }
  animate();
}

function draw() {
  noLoop();
}

///// three.js /////

function initTHREE() {
  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color();
  scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
  clock = new THREE.Clock();

  // scene.background = new THREE.Color(0xdddddd);
 
  setupGLTF();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  camera.position.set(positionCamera[0], positionCamera[1], positionCamera[2]);
  // camera.lookAt( new THREE.Vector3( 0, 2, 0 ) );

  // light
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(0, 20, 10);
  scene.add(dirLight);
  
  // ground
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3000, 3000),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  // const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
  // grid.material.opacity = 0.2;
  // grid.material.transparent = true;
  // scene.add(grid);

  // render
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
    jump: 0,
    walk: 0,
    value3: 0
  };
  gui.add(params, "jump", 0, 1).step(1);
  gui
    .add(params, "walk")
    .min(0)
    .max(1)
    .step(1);
  // .listen()
  // .onChange(callback)
  let folder = gui.addFolder("FolderName");
  folder.add(params, "value3", 0, 1).step(1);

  // stats
  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  container.appendChild(stats.dom);
  // render();
}
			//
function animate() {
  // requestAnimationFrame(animate);
  // stats.update();
  // time = performance.now();
  // frame++;
  requestAnimationFrame(animate);

  var delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  render();

  stats.update();
}

function stopAnimations() {
  for (let i = 0; i < gltf.animations.length; i++) {
    mixer.clipAction(gltf.animations[i]).stop();
    
  }
}

function render() {
  renderer.render(scene, camera);
  if (keyindex == 1){
    model.position.x = - 0.05;
  } else if (keyindex == 2){
    model.position.z += 0;
  } else if (keyindex == 3){
    model.position.z += 0.06;
    if(model.position.y < 0.06 && model.position.y > 0) {
      model.position.y
    }
  } else if (keyindex == 4){
    model.position.z += 0.06;
  }

  // requestAnimationFrame(render);
}

// event listeners
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

		// function createGUI( model, animations ) {

// 				const states = ['handstand', 'idle', 'jump', 'slide', 'walk'];
// 				gui = new dat.gui.GUI();
// 				mixer = new THREE.AnimationMixer( model );
// 				actions = {};

// 				for (let i = 0; i < animations.length; i ++) {

// 					const clip = animations[i];
// 					const action = mixer.clipAction(clip);
// 					actions[clip.name] = action;
          
// 					if (states.indexOf(clip.name) >= 4) {
// 						action.clampWhenFinished = true;
// 						action.loop = THREE.LoopOnce;
// 					}
// 				}

// 				// states
// 				const statesFolder = gui.addFolder('States');
// // 				const clipCtrl = statesFolder.add(api, 'state').options(states);
// // 				clipCtrl.onChange(function () {
// // 					fadeToAction(api.state, 0.5);
// // 				} );

// // 				statesFolder.open();

// // 				function restoreState() {
// // 					mixer.removeEventListener('finished', restoreState);
// // 					fadeToAction(api.state, 0.2);
// // 				}
// // 			}

// 			function fadeToAction(name, duration) {
// 				previousAction = activeAction;
// 				activeAction = actions[name];

// 				if (previousAction !== activeAction) {
// 					previousAction.fadeOut(duration);
// 				}
        
// 				activeAction
// 					.reset()
// 					.setEffectiveTimeScale( 1 )
// 					.setEffectiveWeight( 1 )
// 					.fadeIn( duration )
// 					.play();

// 			}
//     }


// for the linter
/* global
THREE p5 GLTFLoader rotation scale ml5 Stats dat alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase 2D Primitives arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex plane box sphere cylinder cone ellipsoid torus loadModel model HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS print frameCount deltaTime focused cursor frameRate noCursor displayWidth displayHeight windowWidth windowHeight windowResized width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams remove disableFriendlyErrors noLoop loop isLooping push pop redraw select selectAll removeElements changed input createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement createCanvas resizeCanvas noCanvas createGraphics blendMode drawingContext setAttributes boolean string number applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate storeItem getItem clearStorage removeItem createStringDict createNumberDict append arrayCopy concat reverse shorten shuffle sort splice subset float int str byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ turnAxis setMoveThreshold setShakeThreshold deviceMoved deviceTurned deviceShaken keyIsPressed key keyCode keyPressed keyReleased keyTyped keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseWheel mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveFrames image tint noTint imageMode pixels blend copy filter THRESHOLD GRAY OPAQUE INVERT POSTERIZE BLUR ERODE DILATE get loadPixels set updatePixels loadImage loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo Output createWriter save saveJSON saveStrings saveTable day hour minute millis month second year abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess camera perspective ortho frustum createCamera setCamera ADD CENTER CORNER CORNERS POINTS WEBGL RGB ARGB HSB LINES CLOSE BACKSPACE DELETE ENTER RETURN TAB ESCAPE SHIFT CONTROL OPTION ALT UP_ARROW DOWN_ARROW LEFT_ARROW RIGHT_ARROW sampleRate freqToMidi midiToFreq soundFormats getAudioContext userStartAudio loadSound createConvolver setBPM saveSound getMasterVolume masterVolume soundOut chain drywet biquadFilter process freq res gain toggle setType pan phase triggerAttack triggerRelease setADSR attack decay sustain release dispose notes polyvalue AudioVoice noteADSR noteAttack noteRelease isLoaded playMode set isPlaying isPaused setVolume getPan rate duration currentTime jump channels frames getPeaks reverseBuffer onended setPath setBuffer processPeaks addCue removeCue clearCues getBlob getLevel toggleNormalize waveform analyze getEnergy getCentroid linAverages logAverages getOctaveBands fade attackTime attackLevel decayTime decayLevel releaseTime releaseLevel setRange setExp width output stream mediaStream currentSource enabled amplitude getSources setSource bands panner positionX positionY positionZ orient orientX orientY orientZ setFalloff maxDist rollof leftDelay rightDelay delayTime feedback convolverNode impulses addImpulse resetImpulse toggleImpulse sequence getBPM addPhrase removePhrase getPhrase replaceSequence onStep musicalTimeMode maxIterations synced bpm timeSignature interval iterations compressor knee ratio threshold reduction record isDetected update onPeak WaveShaperNode getAmount getOversample amp setInput connect disconnect play pause stop start add mult
*/
