import * as THREE from 'three';
import { DirectionalLight } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

let mixer;
let playerMixer;

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,100);
// 创建渲染器
const renderer = new THREE.WebGLRenderer({antialias:true});
// 打开renderer阴影
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
// camera.position.set(35,5,0);

// 用户控制相机
// const controls = new OrbitControls(camera,renderer.domElement);

scene.background = new THREE.Color(0.2,0.2,0.2);

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff,0.1);
scene.add(ambientLight);

// 方向光
const directionLight = new THREE.DirectionalLight(0xffffff,0.2);
// 打开灯光阴影
directionLight.castShadow = true;
scene.add(directionLight);

// 设置灯光阴影贴图大小
directionLight.shadow.mapSize.width = 2048;
directionLight.shadow.mapSize.height = 2048;

// 设置阴影体 远近 大小
const shadowDistance = 20;
directionLight.shadow.camera.near = 0.1; //默认值
directionLight.shadow.camera.far = 40; //默认值
directionLight.shadow.camera.left = -shadowDistance;
directionLight.shadow.camera.right = shadowDistance;
directionLight.shadow.camera.top = shadowDistance;
directionLight.shadow.camera.bottom = -shadowDistance;
directionLight.shadow.bias = -0.001;

directionLight.position.set(10,10,10);
directionLight.lookAt(new THREE.Vector3(0,0,0));
// 创建一个绿色盒子
// const boxGeometry = new THREE.BoxGeometry(1,1,1);
// const boxMaterial = new THREE.MeshBasicMaterial({color:0x00ff00});
// const boxMesh = new THREE.Mesh(boxGeometry,boxMaterial);
// scene.add(boxMesh);

// 创建人物模型
let playerMesh;
let actionIdle; // 人物静止动画 
let actionWalk; // 人物走路动画
new GLTFLoader().load("../resources/models/player.glb",gltf=>{

  gltf.scene.traverse(child=>{
    child.receiveShadow = true;
    child.castShadow = true;
  })

  playerMesh=gltf.scene;
  scene.add(playerMesh);
  // 人物位置
  playerMesh.position.set(13,0,0);

  // 人物方向
  playerMesh.rotateY(-Math.PI/2);

  // 相机跟着人物走
  playerMesh.add(camera);

  camera.position.set(0,2,-3);
  // 让相机看着人物的原点
  // camera.lookAt(playerMesh.position);
  camera.lookAt(new THREE.Vector3(0,0,1));

  // 增加人物的亮度，给人物背后加一个点光源
  const pointLight = new THREE.PointLight(0xffffff,0.8);
  scene.add(pointLight);
  // 让点光源跟着人物移动
  playerMesh.add(pointLight);
  // 设置点光源位置
  pointLight.position.set(0,1.5,-2);

  // 剪切人物动作
  playerMixer = new THREE.AnimationMixer(gltf.scene);
  const clipIdle = THREE.AnimationUtils.subclip(gltf.animations[0],'idle',31,281);
  actionIdle = playerMixer.clipAction(clipIdle);
  actionIdle.play();

  const clipWalk = THREE.AnimationUtils.subclip(gltf.animations[0],'walk',0,30);
  actionWalk = playerMixer.clipAction(clipWalk);
  // actionWalk.play();

})


// 控制人物移动

// 按键移动
let isWalk = false;
const playerHalfHeight = new THREE.Vector3(0,0.5,0);
window.addEventListener('keydown',e=>{
  // 前进
  if(e.key==='w'){

    // 碰撞检测
    const curPos = playerMesh.position.clone();
    playerMesh.translateZ(1);
    const frontPos = playerMesh.position.clone();
    playerMesh.translateZ(-1);

    const frontVector3 = frontPos.sub(curPos).normalize();
    const raycasterFront = new THREE.Raycaster(playerMesh.position.clone().add(playerHalfHeight),frontVector3);
    const collisionResultsFrontObjs = raycasterFront.intersectObjects(scene.children);
    if(collisionResultsFrontObjs && collisionResultsFrontObjs[0] && collisionResultsFrontObjs[0].distance > 1){
      playerMesh.translateZ(0.1);
    }

    // if(collisionResultsFrontObjs && collisionResultsFrontObjs.length === 0){
    //   playerMesh.translateZ(0.1);
    // }

    if(!isWalk){
      crossPlay(actionIdle, actionWalk);
      isWalk = true;
    }
  }
})

window.addEventListener('keyup',e=>{
  if(e.key==='w'){
    crossPlay(actionWalk, actionIdle);
    isWalk = false;
  }
})

// 鼠标转向
let prePos;
window.addEventListener('mousemove',e=>{
  if(prePos){
    playerMesh.rotateY((prePos - e.clientX)*0.01);
  }
  prePos = e.clientX;
  
})

window.addEventListener('resize',()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth,window.innerHeight);
},false);


// 创建机器人模型
let robotMixer;
new GLTFLoader().load("../resources/models/robot_playground.glb",gltf=>{

  let robotMesh=gltf.scene;
  robotMesh.traverse(child=>{
    child.receiveShadow = true;
    child.castShadow = true;
  })

  scene.add(robotMesh);

  robotMesh.position.set(0,1,-12);

  robotMixer = new THREE.AnimationMixer(robotMesh);
  console.log("gltf.animations",gltf.animations);
  const robotAction = robotMixer.clipAction(gltf.animations[0]);
  robotAction.play();

})

new GLTFLoader().load("../resources/models/x-12_mech.glb",gltf=>{

  let robotMesh=gltf.scene;
  robotMesh.traverse(child=>{
    child.receiveShadow = true;
    child.castShadow = true;
  })

  scene.add(robotMesh);

  robotMesh.position.set(-8.5,0.6,9);

  robotMesh.rotateY(Math.PI*3/4);

})

// 创建场馆
// 加载gltf/glb模型
new GLTFLoader().load("../resources/models/test02.glb",(gltf)=>{
  // console.log(gltf);
  scene.add(gltf.scene);

  gltf.scene.traverse(child=>{

    // 场馆投影
    child.castShadow = true;
    child.receiveShadow = true;

    if(child.name=='2023' || child.name=='造型01'){
      const video = document.createElement('video');
      video.src = "../resources/yanhua.mp4";
      video.muted = true;
      video.autoplay = "autoplay";
      video.loop = true;
      video.play();
      const videoTexture = new THREE.VideoTexture(video);
      const videoMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
      child.material = videoMaterial;
    }
    if(child.name=='屏幕1'||child.name=='操作屏'){
      const video = document.createElement('video');
      video.src = "../resources/video01.mp4";
      video.muted = true;
      video.autoplay = "autoplay";
      video.loop = true;
      video.play();
      const videoTexture = new THREE.VideoTexture(video);
      const videoMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
      child.material = videoMaterial;
    }
    if(child.name=='曲面屏'){
      const video = document.createElement('video');
      video.src = "../resources/video02.mp4";
      video.muted = true;
      video.autoplay = "autoplay";
      video.loop = true;
      video.play();
      const videoTexture = new THREE.VideoTexture(video);
      const videoMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
      child.material = videoMaterial;
    }
  })
  // console.log('num2023:',num2023);

  mixer = new THREE.AnimationMixer(gltf.scene);
  const clips = gltf.animations;
  // 播放所有动画
  clips.forEach(clip=>{
    const action = mixer.clipAction(clip);
    // 只播放一次
    action.loop = THREE.LoopOnce;
    // 停在最后一帧
    action.clampWhenFinished = true;
    action.play();
  })
});

// 加载环境光HDR图片
// new RGBELoader().load("../resources/sky.hdr",texture=>{
//   // scene.background = texture;
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   scene.environment = texture;
//   renderer.outputEncoding = THREE.sRGBEncoding;
//   renderer.render(scene,camera);  
// })

// 给动作切换时加一个淡入淡出效果，避免角色抖动
function crossPlay(curAction, newAction) {
  curAction.fadeOut(0.3);
  newAction.reset();
  newAction.setEffectiveWeight(1);
  newAction.play();
  newAction.fadeIn(0.3);
}

// 帧循环
function animate(){
  requestAnimationFrame(animate);

  renderer.render(scene,camera);

  // controls.update();


  if(mixer){
    mixer.update(0.02);
  }

  if(playerMixer){
    playerMixer.update(0.015);
  }

  if(robotMixer){
    robotMixer.update(0.015);
  }
}

animate();