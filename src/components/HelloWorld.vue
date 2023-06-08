<template>
  <div class="cotainer">
    <div class="three-canvas" ref="screenDom"></div>
    <button type="button" @click="onStartRender">按钮</button>
  </div>
</template>

<script setup>
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, ref, onBeforeUnmount } from "vue";

let screenDom = ref(null);
let scene = null;
let camera = null;
const stats = ref(null);
const renderer = ref(null);

onMounted(() => {
  stats.value = new Stats();
  screenDom.value.appendChild(stats.value.domElement);
  // 1.创建场景
  scene = new THREE.Scene();

  // 2.创建透视投影相机
  camera = new THREE.PerspectiveCamera(
    50,
    screenDom.value.clientWidth / screenDom.value.clientHeight,
    0.1,
    10000
  );
  // 设置相机位置
  camera.position.set(0, 600, 800);

  // 3.创建WebGLRenderer渲染器
  renderer.value = new THREE.WebGLRenderer();
  // 通过setSize()方法设置渲染的长宽
  renderer.value.setClearColor(0xb9d3ff, 1);
  renderer.value.setSize(
    screenDom.value.clientWidth,
    screenDom.value.clientHeight
  );
  // 设置渲染位置
  screenDom.value.appendChild(renderer.value.domElement);

  // 4.创建一个长、宽、高均为5个单位的立方体
  const geometry = new THREE.BoxGeometry(60, 60, 60);

  // 5.创建Lambert网格材质
  const materialBasic = new THREE.MeshBasicMaterial({
    color: "rgb(327,175,118)", // 绿色
    wireframe: false, //是否将几何体渲染为线框，默认值为false（即渲染为平面多边形）
  });

  // 6.创建一个网格模型对象
  const mesh = new THREE.Mesh(geometry, materialBasic); //网络模型对象Mesh
  // 设置物体在场景中的位置
  mesh.position.set(30, 30, 30);
  // 把网格模型添加到三维场景
  scene.add(mesh);
  const tween = new TWEEN.Tween(mesh.position)
    .to({ x: 160, y: 30, z: 30 }, 2000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  const tween2 = new TWEEN.Tween(mesh.position)
    .to({ x: 160, y: 30, z: 360 }, 2000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  const tween3 = new TWEEN.Tween(mesh.position)
    .to({ x: 360, y: 30, z: 360 }, 2000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  tween.chain(tween2.chain(tween3)).start();
  // 设置相机看向物体的方向(默认指向三维坐标系的原点)
  camera.lookAt(0, 0, 0);
  // 修改几何体位置
  mesh.position.set(30, 30, 30);

  // 7.创建光源
  let pointLight = new THREE.PointLight("rgb(255,255,255)", 0.5, 600, 0.2);
  pointLight.position.set(0, 1000, 2000); //点光源位置
  scene.add(pointLight); //点光源添加到场景中

  // 8.为了方便观察3D图像，添加三维坐标系对象
  const axes = new THREE.AxesHelper(150); // 坐标系轴长设置为8
  // 把三维坐标系 添加到场景中
  scene.add(axes);

  // 9.添加控制器
  let control = new OrbitControls(camera, renderer.value.domElement);
  control.update();
});
const animate = () => {
  stats.value.update();
  TWEEN.update();
  requestAnimationFrame(animate);
  //渲染
  renderer.value.render(scene, camera);
};
const onStartRender = () => {
  animate();
};
</script>

<style scoped lang="scss">
.cotainer {
  height: 100vh;
  width: 100%;
  background-color: #ffffff;
  .three-canvas {
    width: 100%;
    height: calc(100% - 200px);
    overflow: hidden;
    background-color: #d6eaff;
  }
}
</style>
