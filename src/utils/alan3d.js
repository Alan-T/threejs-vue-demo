import * as THREE from "three"; //导入three.js核心库
import Stats from "three/addons/libs/stats.module.js";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //导入轨道控制器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //导入GLTF模型加载器
import { OBJLoader } from "three/addons/loaders/OBJLoader.js"; //导入OBJ模型加载器

class Alan3d {
  constructor(dom) {
    this.container = dom; //获取容器
    console.log(dom.clientHeight);
    this.scene;
    this.camera;
    this.renderer;
    this.controls;
    this.stats;
    // this.init(); //初始化
  }
  init() {
    // 初始化场景
    this.initScene();
    // 初始化辅助轴
    this.initAxesHelper();
    // 初始化stats
    this.initStats();
    // 初始化灯光
    this.initLight();
    // 初始化相机
    this.initCamera();
    // 初始化渲染器
    this.initRender();
    // 初始化轨道控制器
    this.initControls();
    //循环函数
    this.animate();
    // 监听场景大小改变，重新渲染尺寸
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }
  animate = () => {
    this.stats.update();
    TWEEN.update();
    requestAnimationFrame(this.animate);
    //渲染
    this.renderer.render(this.scene, this.camera);
  };
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);
  }
  initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(6);
    this.scene.add(axesHelper);
  }
  initStats() {
    this.stats = new Stats();
    this.container.appendChild(this.stats.domElement);
  }
  initLight() {
    const hesLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hesLight.intensity = 0.6;
    this.scene.add(hesLight);

    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      25,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(40, 20, 70);
  }
  initRender() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true }); //设置抗锯齿
    //设置屏幕像素比
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //渲染的尺寸大小
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    // 添加到容器
    this.container.appendChild(this.renderer.domElement);
  }
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  onWindowResize() {
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix(); //更新矩阵，将3d内容投射到2d画面上转换
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
  addObject(object) {
    this.scene.add(object);
  }
  removeObject(object) {
    this.scene.remove(object);
  }
  loadObjModel(url, callback) {
    const that = this;
    const loader = new OBJLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        // resource URL
        url,
        // called when resource is loaded
        function (object) {
          object.position.set(-30, 0, 10);
          object.scale.set(0.001, 0.001, 0.001);
          that.scene.add(object);
          resolve(object);
        },
        // called when loading is in progresses
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        function (error) {
          console.log("An error happened");
          reject(error);
        }
      );
    });
  }
}
export default Alan3d;
