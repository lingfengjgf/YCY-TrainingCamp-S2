import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

let mixer;

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,10);
// 创建渲染器
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
camera.position.set(0.3,0.3,0.5);

// 用户控制相机
const controls = new OrbitControls(camera,renderer.domElement);

scene.background = new THREE.Color(0.6,0.6,0.6);

// 环境光
// const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
// scene.add(ambientLight);

// 方向光
const directionLight = new THREE.DirectionalLight(0xffffff,0.4);
scene.add(directionLight);

// 创建一个绿色盒子
// const boxGeometry = new THREE.BoxGeometry(1,1,1);
// const boxMaterial = new THREE.MeshBasicMaterial({color:0x00ff00});
// const boxMesh = new THREE.Mesh(boxGeometry,boxMaterial);
// scene.add(boxMesh);

// 创建甜甜圈
let donuts;
// 加载gltf/glb模型
new GLTFLoader().load("../resources/models/donuts_new.glb",(gltf)=>{
  // console.log(gltf);
  scene.add(gltf.scene);
  donuts = gltf.scene;
  // gltf.scene.traverse(child=>{
  //   console.log(child.name);
  // })

  mixer = new THREE.AnimationMixer(gltf.scene);
  const clips = gltf.animations;
  // 播放所有动画
  clips.forEach(clip=>{
    const action = mixer.clipAction(clip);
    // 只播放一次
    action.loop = THREE.LoopOnce;
    action.play();
    // 停在最后一帧
    action.clampWhenFinished = true;
  })
});

// 加载环境光HDR图片
new RGBELoader().load("../resources/sky.hdr",texture=>{
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.render(scene,camera);  
})

// 帧循环
function animate(){
  requestAnimationFrame(animate);

  renderer.render(scene,camera);

  controls.update();

  if(donuts){
    donuts.rotation.y += 0.01;
  }

  if(mixer){
    mixer.update(0.02);
  }
}

animate();