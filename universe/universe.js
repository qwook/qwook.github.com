
var imageLoader = new THREE.TextureLoader();
var objLoader = new THREE.OBJLoader();
var images = {};
var objs = {};

function load(loader, cache, img, cb) {
  return new Promise(function(resolve, reject) {

    loader.load(
      img,
      function (image) {
        cache[img] = image;
        cb(image);
        resolve();
      },
      function () {},
      function () {
        reject("Error in XHR");
      }
    )

  });
}

function loadImage(img) {
  return load(imageLoader, images, img, function(image) {
    image.magFilter = THREE.NearestFilter;
    image.minFilter = THREE.NearestMipMapNearestFilter;
  })
}

function loadObj(obj) {
  return load(objLoader, objs, obj, function(object) {});
}

Promise.all([
  loadImage("./img/grass.jpg"),
  loadImage("./img/stars.bmp"),
  loadImage("./img/full-moon.gif"),
  loadObj("./model/universe.obj"),
]).then(function () {

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, 500 / 500, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("universe")
  });
  renderer.setSize( 500, 500 );

  // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  // var cube = new THREE.Mesh( geometry, material );
  // scene.add( cube );

  camera.position.z = 2;
  camera.position.y = -5;
  camera.rotation.x = 1.6;

  var grassTexture = images["./img/grass.jpg"];
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set( 10, 10 );

  var planeGeometry = new THREE.PlaneGeometry(100, 200, 1, 1);
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x9977ff, side: THREE.DoubleSide, map: grassTexture
  });
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.receiveShadow = true;
  scene.add( plane );

  // skybox
  var skyTexture = images["./img/stars.bmp"];
  skyTexture.wrapS = THREE.RepeatWrapping;
  skyTexture.wrapT = THREE.RepeatWrapping;
  skyTexture.repeat.set( 3, 3 );

  var skyMaterial = new THREE.MeshBasicMaterial({
    color: 0xAAAAFF, side: THREE.DoubleSide, map: skyTexture
  });
  var skyGeometry = new THREE.SphereGeometry( 100, 32, 32 );
  var sky = new THREE.Mesh( skyGeometry, skyMaterial );
  scene.add( sky ); 
  sky.rotation.x = Math.PI/2;

  // moon
  var moonTexture = images["./img/full-moon.gif"];
  var moonMaterial = new THREE.SpriteMaterial( { map: moonTexture, color: 0xffffff, fog: true } );
  var moon = new THREE.Sprite( moonMaterial );
  scene.add( moon );
  moon.scale.set(10, 10, 10);
  moon.position.y = 60;
  moon.position.z = 40;
  moon.position.x = -20;

  // pillar
  var pillars = [];

  var pillarObj = objs["./model/universe.obj"];
  var pillarMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF
  });
  // pillarObj.dynamic = true
  pillarObj.children[0].material = pillarMaterial;
  pillarObj.rotation.x = Math.PI/2;
  pillarObj.position.x = 5;
  pillarObj.position.y = 5;
  pillarObj.children[0].castShadow = true;
  pillarObj.children[0].receiveShadow = true;
  // var pillar = new THREE.Mesh( pillarObj.children[0].geometry, pillarMaterial );

  // console.log(pillarObj.children[0].geometry);

  pillars.push(pillarObj);

  scene.add(pillarObj);

  for (var i = 1; i < 10; i++) {
    var pil2 = pillarObj.clone();
    pil2.position.x = -5;
    pil2.position.y = 5;
    scene.add(pil2);

    pillars.push(pil2);
  }

  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );

  // var directionalLight = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set( 0, -1, 1 );
  directionalLight.castShadow = true;

  directionalLight.shadow = new THREE.DirectionalLightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
  directionalLight.shadow.bias = 0.0001;
  directionalLight.shadow.mapSize.width = 500;
  directionalLight.shadow.mapSize.height = 500;

  renderer.autoClear = false;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  scene.add( directionalLight );

  var render = function () {
    requestAnimationFrame( render );

    // cube.rotation.x += 0.1;
    // cube.rotation.y += 0.1;

    plane.position.y = -((new Date).getTime()/100) % (200/10);
    sky.rotation.y = ((new Date).getTime()/6000) % (Math.PI*2);
    sky.rotation.z = ((new Date).getTime()/7000) % (Math.PI*2);


    for (var i = 0; i < pillars.length/2; i++) {
      var pillar = pillars[i];
      pillar.position.x = 5;
      pillar.position.y = 100-((new Date).getTime()/100 + i * 20) % (100);
    }

    for (var i = pillars.length/2; i < pillars.length; i++) {
      var pillar = pillars[i];
      pillar.position.x = -5;
      pillar.position.y = 100-((new Date).getTime()/100 + i * 20) % (100);
    }
    // pillarObj.position.y = 100-((new Date).getTime()/100) % (100);
    // pil2.position.y = 100-((new Date).getTime()/100) % (100);

    var full = 200/10;
    var i = (((new Date).getTime()/100) % full) / full;
    // pillarMaterial.color = new THREE.Color(i*i, i*i, i*i); //20-((new Date).getTime()/100) % (200/10);

    renderer.render(scene, camera);
  };

  render();

})

