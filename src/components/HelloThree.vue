<template>
  <div class="container">
    <div class="three-dom" ref="threeDomRef" @mousemove="onMousemove"></div>
    <div id="label" style="display: none">
      <div
        style="position: relative; width: 120px; height: 160px; color: #ffffff"
      >
        <div
          style="font-size: 12px; background-color: rgba(224, 124, 124, 0.4)"
        >
          <div style="font-size: 14px; font-weight: 400">
            <span id="txtName">货箱详情</span>
          </div>
          <div style="margin-top: 8px">
            <span style="color: #fff; font-weight: 300">编号：</span>
            <span
              style="font-weight: 400; margin-left: 10px"
              id="txtMaterial"
              >{{ formItems.name }}</span
            >
          </div>
          <div style="margin-top: 8px">
            <span style="color: #fff; font-weight: 300">颜色：</span>
            <span style="font-weight: 400; margin-left: 2px" id="txtColor"
              >红色</span
            >
          </div>
        </div>
      </div>
    </div>
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
        <select @change="onMeshChange" style="width: 120px">
          <option v-for="option in options" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
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
const options = ref([]);
const formItems = reactive({
  name: "标准箱",
  id: 0,
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
  formItems.id++;
  formItems.name = "标准箱" + formItems.id;
  const option = {
    id: formItems.id,
    label: formItems.name,
    meshBox: makeMeshBox(
      formItems.size.split(","),
      formItems.color,
      formItems.position.split(",")
    ),
  };
  options.value.push(option);
  meshBox = option.meshBox;
  alan3d.addObject(option.meshBox);
};
const onRemoveMesh = () => {
  options.value.splice(
    options.value.findIndex((item) => (item.mesh = meshBox)),
    1
  );
  alan3d.removeObject(meshBox);
};

const onMeshChange = (event) => {
  meshBox = options.value.find((item) => (item.id = event.target.value));
};
const onMoveMesh = (mesh) => {
  if (!mesh) {
    return;
  }
  const list = [
    { position: { x: 3.85, y: 1, z: 10.5 }, interval: 2000 },
    { position: { x: 3.85, y: 3.75, z: 10.5 }, interval: 2000 },
    { position: { x: 3.85, y: 3.75, z: 6.2 }, interval: 2000 },
  ];
  const chainList = getTweenList(mesh.position, list);
  chainList.start();
};

// 返回一个补间递归方法
const getTweenList = (start, positionList) => {
  let newlist = JSON.parse(JSON.stringify(positionList));
  let chainList = null;
  const createTween = (newArr) => {
    if (newArr.length > 0) {
      const { position, interval } = newArr.pop();
      const tween = new TWEEN.Tween(start)
        .to({ x: position.x, y: position.y, z: position.z }, interval)
        .easing(TWEEN.Easing.Sinusoidal.InOut);
      if (chainList) {
        chainList = tween.chain(chainList);
      } else {
        chainList = tween;
      }
      return createTween(newArr);
    } else {
      return chainList;
    }
  };
  return createTween(newlist);
};

const onBatchAddMesh = () => {
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      for (let k = 0; k < 7; k++) {
        let box = makeMeshBox(
          [2, 2, 1],
          "#f8d059",
          [-29 + i * 3, 1 + j * 3, 10.5 + k * 3],
          `货物${i}、${j}、${k}`
        );
        alan3d.addObject(box);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.container {
  height: 100%;
  padding-top: 20px;
  .three-dom {
    height: 600px;
    box-shadow: 0 2px 10px 0 rgba(14, 33, 39, 0.2);
    width: 1200px;
    border-radius: 4px;
    overflow: hidden;
    margin: 0 auto;
    box-sizing: border-box;
    position: relative;
  }
  .action-area {
    margin: 40px auto;
    background-color: #f3f4e7;
    box-shadow: 0 2px 10px 0 rgba(14, 33, 39, 0.2);
    border-radius: 4px;
    padding: 20px;
    width: 1200px;
    display: flex;
    .box-form {
      color: #333;
      display: flex;
      flex-direction: column;
      padding: 10px;
      border: 1px solid #fff;
      border-radius: 4px;
      margin-right: 20px;
    }
  }
}
</style>
