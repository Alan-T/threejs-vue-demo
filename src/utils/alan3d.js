import * as THREE from "three"; //导入three.js核心库
import Stats from "three/addons/libs/stats.module.js";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //导入轨道控制器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //导入GLTF模型加载器
import { OBJLoader } from "three/addons/loaders/OBJLoader.js"; //导入OBJ模型加载器
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"; //导入后期处理器
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer"; // 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject

class Alan3d {
  constructor(dom) {
    this.container = dom; //获取容器
    this.scene;
    this.camera;
    this.renderer;
    this.controls;
    this.stats;
    this.composer;
    this.css2dRenderer;
    this.selectObj = null;
    this.group = new THREE.Group();
    this.windowInfo;
    this.infoDiv;
    this.boxHelper = new THREE.BoxHelper(
      new THREE.Object3D(),
      new THREE.Color(0x00ffff)
    );
  }
  init() {
    // 初始化场景
    this.initScene();
    // 初始化包围盒的辅助对象
    this.initBoxHelper();
    // 初始化地板
    this.initFloor();
    // 初始化CSS2D渲染器
    this.initCSS2DRenderer();
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
    this.container.addEventListener("click", this.onMouseClick.bind(this));
  }
  animate = () => {
    this.stats.update();
    TWEEN.update();
    requestAnimationFrame(this.animate);
    //渲染
    this.renderer.render(this.scene, this.camera);
    this.css2dRenderer.render(this.scene, this.camera);
  };
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb9d3ff);
    this.scene.position.set(0, 0, 0)
  }
  initBoxHelper() {
    this.scene.add(this.boxHelper);
  }
  initFloor() {
    const planeWidth = 500;
    const planeHeight = 500;
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(planeWidth, planeHeight),
      new THREE.MeshPhongMaterial({ color: 0x619ac3, depthWrite: false })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const size = 500;
    const divisions = 200;
    const colorCenterLine = 0x888888;
    const colorGrid = 0x888888;

    const grid = new THREE.GridHelper(
      size,
      divisions,
      colorCenterLine,
      colorGrid
    );
    this.scene.add(grid);
  }
  initCSS2DRenderer() {
    this.css2dRenderer = new CSS2DRenderer();
    this.css2dRenderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.css2dRenderer.domElement.style.position = "absolute";
    this.css2dRenderer.domElement.style.top = "0px";
    this.css2dRenderer.domElement.style.pointerEvents = "none";
    this.container.appendChild(this.css2dRenderer.domElement);
    this.infoDiv = document.querySelector("#label");
    this.windowInfo = new CSS2DObject(this.infoDiv);
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
    // const hesLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    // hesLight.intensity = 0.6;
    // this.scene.add(hesLight);

    // const dirLight = new THREE.DirectionalLight();
    // dirLight.position.set(5, 5, 5);
    // this.scene.add(dirLight);
    //环境光
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(12, 6, 22);

    // this.camera = new THREE.PerspectiveCamera(
    //   25,
    //   this.container.clientWidth / this.container.clientHeight,
    //   1,
    //   2000
    // );
    // //设置相机位置
    // this.camera.position.set(40, 20, 30);
    // //设置相机方向
    // this.camera.lookAt(0, 0, 0);

    // const width = this.container.clientWidth; //canvas画布宽度
    // const height = this.container.clientHeight; //canvas画布高度
    // const k = width / height; //canvas画布宽高比
    // const s = 20; //控制left, right, top, bottom范围大小
    // this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 0, 100);
    // this.camera.position.set(0, 5, 25);
  }
  initRender() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true ,alpha:true}); //设置抗锯齿
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
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
  onMouseClick(e) {
    console.log(e);
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    mouse.x = (e.offsetX / this.container.clientWidth) * 2 - 1;
    mouse.y = -(e.offsetY / this.container.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.group.children, true);
    console.log(this.group);

    if (intersects.length > 0) {
      this.selectObj = intersects[0].object;
      this.boxHelper.setFromObject(this.selectObj);
      this.boxHelper.visible = true;
      const pos = this.selectObj.position;
      this.infoDiv.style.display = "block";
      this.windowInfo.position.set(pos.x, pos.y, pos.z);
      this.scene.add(this.windowInfo);
    } else {
      if (this.selectObj) {
        this.boxHelper.visible = false;
        this.infoDiv.style.display = "none";
        this.scene.remove(this.windowInfo);
      }
    }
  }
  addObject(object) {
    this.group.add(object);
    console.log(this.group);
    this.scene.add(this.group);
  }
  removeObject(object) {
    this.group.remove(object);
    // this.scene.remove(object);
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
  loadGltfModel(url,position=[0, 0, 0]) {
    const that = this;
    const loader = new GLTFLoader();
    loader.load(
      url,
      function (gltf) {
        console.log(gltf);
        gltf.scene.position.set(...position);
        // gltf.scene.scale.set(0.001, 0.001, 0.001);
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.emissiveMap = child.material.map;
          }
        });
        that.scene.add(gltf.scene);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error(error);
      }
    );
  }
}
export default Alan3d;
