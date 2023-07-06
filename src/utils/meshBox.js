import * as THREE from "three"; //导入three.js核心库
export const makeMeshBox = (
  position = [1, 1, 0.5],
  size = [1, 1, 1],
  color = "#f8d059",
  name = "标签名称测试"
) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...size), // 设置立方体的大小 (x 长度, y 高度 ,z 长度)
    [
      new THREE.MeshStandardMaterial({ color: color }),
      new THREE.MeshStandardMaterial({ color: color }),
      new THREE.MeshStandardMaterial({ color: color }),
      new THREE.MeshStandardMaterial({ color: color }),
      new THREE.MeshStandardMaterial({
        map: new THREE.CanvasTexture(getTextCanvas(name)),
        // transparent: true
      }),
      new THREE.MeshStandardMaterial({ color: color }),
    ]
  );
  mesh.position.set(...position); // 设置立方体的位置 (x,y,z)
  return mesh;
};

function getTextCanvas(text) {
  let width = 600;
  let height = 600;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f8d059";
  ctx.fillRect(0, 0, width, height);
  ctx.font = 80 + 'px " bold';
  ctx.fillStyle = "#111111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${text}`, 300, 300);
  return canvas;
}
