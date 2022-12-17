import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

let mixer;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(5, 10, 25);

const controls = new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.Color(0.2, 0.2, 0.2);

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
// scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight(0xffffff, 0.4);
scene.add(directionLight);

// const boxGeometry = new THREE.BoxGeometry(1,1,1);
// const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(boxMesh);

new GLTFLoader().load('../resources/models/zhanguan.glb', (gltf) => {

    // console.log(gltf);
    scene.add(gltf.scene);

    gltf.scene.traverse((child)=>{
        // console.log(child.name);
        if (child.name === '2023') {
            const video = document.createElement('video');
            video.src = "./resources/yanhua.mp4";
            video.muted = true;
            video.autoplay = "autoplay";
            video.loop = true;
            video.play();
            
            const videoTexture = new THREE.VideoTexture(video);
            const videoMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
        
            child.material = videoMaterial;
        }
        if (child.name === '大屏幕01') {
            const video = document.createElement('video');
            video.src = "./resources/video01.mp4";
            video.muted = true;
            video.autoplay = "autoplay";
            video.loop = true;
            video.play();
            
            const videoTexture = new THREE.VideoTexture(video);
            const videoMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
        
            child.material = videoMaterial;
        }
        if (child.name === '大屏幕02' || child.name === '操作台屏幕') {
            const video = document.createElement('video');
            video.src = "./resources/video01.mp4";
            video.muted = true;
            video.autoplay = "autoplay";
            video.loop = true;
            video.play();
            
            const videoTexture = new THREE.VideoTexture(video);
            const videoMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
        
            child.material = videoMaterial;
        }
        if (child.name === '环形屏幕') {
            const video = document.createElement('video');
            video.src = "./resources/video02.mp4";
            video.muted = true;
            video.autoplay = "autoplay";
            video.loop = true;
            video.play();
            
            const videoTexture = new THREE.VideoTexture(video);
            const videoMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
        
            child.material = videoMaterial;
        }
        if (child.name === '柱子屏幕') {
            const video = document.createElement('video');
            video.src = "./resources/yanhua.mp4";
            video.muted = true;
            video.autoplay = "autoplay";
            video.loop = true;
            video.play();
            
            const videoTexture = new THREE.VideoTexture(video);
            const videoMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
        
            child.material = videoMaterial;
        }
    })



    mixer = new THREE.AnimationMixer(gltf.scene);
    const clips = gltf.animations; // 播放所有动画
    clips.forEach(function (clip) {
        const action = mixer.clipAction(clip);
        action.loop = THREE.LoopOnce;
        // 停在最后一帧
        action.clampWhenFinished = true;
        action.play();
    });

})

new RGBELoader()
    .load('../resources/sky.hdr', function (texture) {
        // scene.background = texture;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.render(scene, camera);
});

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);

    controls.update();

    // if (donuts){
    //     donuts.rotation.y += 0.01;
    // }

    if (mixer) {
        mixer.update(0.02);
    }
}

animate();