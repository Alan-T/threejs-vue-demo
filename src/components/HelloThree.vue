<template>
  <div class="container">
    <div class="three-dom" ref="threeDomRef" @mousemove="onMousemove"></div>
    <div class="action-area">
      <form class="box-form">
        <label>货物编码</label>
        <input type="text" v-model="formItems.name" />
        <label>长宽高</label>
        <input type="text" v-model="formItems.size" />
        <label>初始位置</label>
        <input type="text" v-model="formItems.position" />
        <label>材质颜色</label>
        <input type="color" v-model="formItems.color" />
        <button type="reset">重置</button>
      </form>
      <div class="btn-list">
        <button @click="onAddMesh">添加货物</button>
        <button @click="onRemoveMesh">删除货物</button>
        <button @click="() => onMoveMesh(meshBox)">开始运动</button>
        <button @click="onBatchAddMesh">添加7*7*7货物</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import Alan3d from "../utils/alan3d";
import TWEEN from "@tweenjs/tween.js";
import { makeMeshBox } from "../utils/meshBox";
import { onMounted, ref, reactive } from "vue";
const threeDomRef = ref(null);
let alan3d = null;
let meshBox = null;
const formItems = reactive({
  name: "",
  size: "2,2,1",
  color: "#f8d059",
  position: "-29,1,10.5",
});

onMounted(() => {
  alan3d = new Alan3d(threeDomRef.value);
  alan3d.init();
  alan3d.loadObjModel("/24列4层货架.obj");
});

const onAddMesh = () => {
  console.log(formItems);
  meshBox = makeMeshBox(
    formItems.size.split(","),
    formItems.color,
    formItems.position.split(",")
  );
  alan3d.addObject(meshBox);
};
const onRemoveMesh = () => {
  alan3d.removeObject(meshBox);
};
const onMoveMesh = (mesh) => {
  if (!mesh) {
    return;
  }
  const tween = new TWEEN.Tween(mesh.position)
    .to({ x: 3.85, y: 1, z: 10.5 }, 2000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  const tween2 = new TWEEN.Tween(mesh.position)
    .to({ x: 3.85, y: 3.75, z: 10.5 }, 2000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  const tween3 = new TWEEN.Tween(mesh.position)
    .to({ x: 3.85, y: 3.75, z: 6.2 }, 2000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  tween.chain(tween2.chain(tween3)).start();
  // 设置相机看向物体的方向(默认指向三维坐标系的原点)
};

const onBatchAddMesh = () => {
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      for (let k = 0; k < 7; k++) {
        let box = makeMeshBox(
          [2, 2, 1],
          "#f8d059",
          [-29 + i * 3, 1 + j * 3, 10.5 + k * 3]
        );
        alan3d.addObject(box);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.container {
  height: 100vh;
  background-color: #f3f4e7;
  .three-dom {
    height: calc(100% - 280px);
    width: 100%;
  }
  .action-area {
    padding: 20px;
    display: flex;
    .box-form {
      color: #333;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
