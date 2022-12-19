import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

let mixer;

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,100);
// 创建渲染器
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
camera.position.set(10,5,25);

// 用户控制相机
const controls = new OrbitControls(camera,renderer.domElement);

scene.background = new THREE.Color(0.2,0.2,0.2);

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

// 创建场馆
// 加载gltf/glb模型
new GLTFLoader().load("../resources/models/test02.glb",(gltf)=>{
  // console.log(gltf);
  scene.add(gltf.scene);

  gltf.scene.traverse(child=>{
    if(child.name=='2023'){
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
    if(child.name=='屏幕1'){
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
    action.play();
    // 停在最后一帧
    action.clampWhenFinished = true;
  })
});

// 加载环境光HDR图片
new RGBELoader().load("../resources/sky.hdr",texture=>{
  // scene.background = texture;
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


  if(mixer){
    mixer.update(0.02);
  }
}

animate();