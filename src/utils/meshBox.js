import * as THREE from "three"; //导入three.js核心库
export const makeMeshBox = (
  size = [2, 2, 1],
  color = "#f8d059",
  position = [1, 1, 0.5]
) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...size), // 设置立方体的大小 (x 长度, y 高度 ,z 长度)
    new THREE.MeshStandardMaterial({
      // 设置材质
      color: color, // 设置材质的颜色
    })
  );
  mesh.position.set(...position); // 设置立方体的位置 (x,y,z)
  return mesh;
};
