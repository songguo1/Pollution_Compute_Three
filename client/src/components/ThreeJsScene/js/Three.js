// 导入threejs
import * as THREE from "three";
//导入轨道控制
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let renderer1, renderer2, scene, camera1, camera2,crossGeometry;
let crossplane1,
  crossplane2,
  crossplane3,
  crossplane4,
  crossplane5,
  crossplane6,
  crossplane7,
  crossplane8,
  crossplane9;

export function init(container1, container2, value, crossValue) {
  //创建场景
  scene = new THREE.Scene();

  //创建相机
  camera1 = new THREE.PerspectiveCamera(
    45, //视角
    container1.clientWidth / container1.clientHeight, //宽高比
    0.1, //近平面
    1000 //远平面
  );

  // 创建相机
  camera2 = new THREE.OrthographicCamera(
    -1.5, // 左
    1.5, // 右
    1.5, // 上
    -1.5, // 下
    1.5, // 近截面
    1000 // 远截面
  );

  // 设置相机的目标点，使其朝向立方体的中心
  camera2.lookAt(0, 0, 0);
  // 加载纹理图像
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(require("@/assets/images/soil.jpg")); // 替换为你的图像路径

  //创建渲染器
  renderer1 = new THREE.WebGLRenderer();
  renderer1.setSize(container1.clientWidth, container1.clientHeight);
  container1.appendChild(renderer1.domElement);

  renderer2 = new THREE.WebGLRenderer();
  renderer2.setSize(container2.clientWidth, container2.clientHeight);
  container2.appendChild(renderer2.domElement);

  //创建一个平面
  const planeGeometry = new THREE.PlaneGeometry(3, 3);

  const planeMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  const plane1 = new THREE.Mesh(planeGeometry, planeMaterial);
  plane1.position.set(0, 0, 1.501);
  scene.add(plane1);
  const plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
  plane2.position.set(1.501, 0, 0);
  plane2.rotation.y = Math.PI / 2;
  scene.add(plane2);
  const plane3 = new THREE.Mesh(planeGeometry, planeMaterial);
  plane3.position.set(-1.501, 0, 0);
  plane3.rotation.y = Math.PI / 2;
  scene.add(plane3);
  const plane4 = new THREE.Mesh(planeGeometry, planeMaterial);
  plane4.position.set(0, 0, -1.501);
  scene.add(plane4);

  crossGeometry = new THREE.PlaneGeometry(3, 3);

  // 现有的数据点
  const points = crossValue;

  // 计算每个子数组的长度
  const partLength = Math.ceil(points.length / 3);

  // 创建三个空数组来存放结果
  const points1 = [];
  const points2 = [];
  const points3 = [];
  const points4 = [];
  const points5 = [];
  const points6 = [];
  const points7 = [];
  const points8 = [];
  const points9 = [];

  // 遍历原始数组，根据索引分配元素
  for (let i = 0; i < points.length; i++) {
    if (i % 3 === 0) {
      points1.push(points[i]);
    } else if (i % 3 === 1) {
      points5.push(points[i]);
    } else {
      points9.push(points[i]);
    }
  }

  for (let i = 0; i < partLength; i++) {
    points3.push((points1[i] + points5[i]) / 2);
    points7.push((points5[i] + points9[i]) / 2);
  }
  for (let i = 0; i < partLength; i++) {
    points2.push((points1[i] + points3[i]) / 2);
    points4.push((points3[i] + points5[i]) / 2);
    points6.push((points5[i] + points7[i]) / 2);
    points8.push((points7[i] + points9[i]) / 2);
  }

  const createDataTexture = (points) => {
    const texture = new THREE.DataTexture(
      new Float32Array(points),
      Math.sqrt(points.length),
      Math.sqrt(points.length),
      
      THREE.RedFormat,
      THREE.FloatType
    );
    texture.needsUpdate = true;
    return texture;
  };

  const dataTexture1 = createDataTexture(points1);
  const dataTexture2 = createDataTexture(points2);
  const dataTexture3 = createDataTexture(points3);
  const dataTexture4 = createDataTexture(points4);
  const dataTexture5 = createDataTexture(points5);
  const dataTexture6 = createDataTexture(points6);
  const dataTexture7 = createDataTexture(points7);
  const dataTexture8 = createDataTexture(points8);
  const dataTexture9 = createDataTexture(points9);

  // 创建着色器材质
  const crossMaterials = [];
  for (let dataTexture of [
    dataTexture1,
    dataTexture2,
    dataTexture3,
    dataTexture4,
    dataTexture5,
    dataTexture6,
    dataTexture7,
    dataTexture8,
    dataTexture9,
  ]) {
    const crossMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dataTexture: { value: dataTexture },
      },
      vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
      fragmentShader: `
      uniform sampler2D dataTexture;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(dataTexture, vUv);
        gl_FragColor = vec4(color.r, 1.0 - color.r, 0.0, 1.0);
      }
    `,
      side: THREE.DoubleSide,
    });
    crossMaterials.push(crossMaterial);
  }

  // 创建网格
  crossplane1 = new THREE.Mesh(crossGeometry, crossMaterials[0]);
  crossplane1.position.set(0, 1.5, 0);
  crossplane1.rotation.x = -Math.PI / 2;
  crossplane2 = new THREE.Mesh(crossGeometry, crossMaterials[1]);
  crossplane2.position.set(0, 1.125, 0);
  crossplane2.rotation.x = -Math.PI / 2;
  crossplane3 = new THREE.Mesh(crossGeometry, crossMaterials[2]);
  crossplane3.position.set(0, 0.75, 0);
  crossplane3.rotation.x = -Math.PI / 2;
  crossplane4 = new THREE.Mesh(crossGeometry, crossMaterials[3]);
  crossplane4.position.set(0, 0.375, 0);
  crossplane4.rotation.x = -Math.PI / 2;
  crossplane5 = new THREE.Mesh(crossGeometry, crossMaterials[4]);
  crossplane5.position.set(0, 0, 0);
  crossplane5.rotation.x = -Math.PI / 2;
  crossplane6 = new THREE.Mesh(crossGeometry, crossMaterials[5]);
  crossplane6.position.set(0, -0.375, 0);
  crossplane6.rotation.x = -Math.PI / 2;
  crossplane7 = new THREE.Mesh(crossGeometry, crossMaterials[6]);
  crossplane7.position.set(0, -0.75, 0);
  crossplane7.rotation.x = -Math.PI / 2;
  crossplane8 = new THREE.Mesh(crossGeometry, crossMaterials[7]);
  crossplane8.position.set(0, -1.125, 0);
  crossplane8.rotation.x = -Math.PI / 2;
  crossplane9 = new THREE.Mesh(crossGeometry, crossMaterials[8]);
  crossplane9.position.set(0, -1.5, 0);
  crossplane9.rotation.x = -Math.PI / 2;

  // 添加到场景中
  scene.add(crossplane1);
  scene.add(crossplane2);
  scene.add(crossplane3);
  scene.add(crossplane4);
  scene.add(crossplane5);
  scene.add(crossplane6);
  scene.add(crossplane7);
  scene.add(crossplane8);
  scene.add(crossplane9);

  //创建几何体
  const geometry = new THREE.BoxGeometry(3, 3, 3);

  // 创建材质
  const material = new THREE.MeshBasicMaterial({
    transparent: true, // 开启透明度
    opacity: 0, // 设置透明度
  });
  //创建网格
  const cube = new THREE.Mesh(geometry, material);

  //设置位置
  cube.position.set(0, 0, 0);
  //添加网格到场景中
  scene.add(cube);

  camera1.position.set(5, 4, 4);

  //设置相机位置
  camera1.lookAt(0, 0, 0);

  //添加轨道控制器
  const controls1 = new OrbitControls(camera1, renderer1.domElement);
  controls1.enableDamping = true;
  controls1.dampingFactor = 0.2;
  controls1.rotateSpeed = 0.5;

  const controls2 = new OrbitControls(camera2, renderer2.domElement);
  controls2.enableDamping = true;
  controls2.dampingFactor = 0.2;
  controls2.rotateSpeed = 0.5;
  controls2.enablePan = false; // 禁止拖动
  controls2.enableZoom = false; // 禁止缩放
  controls2.enableRotate = false; // 禁止旋转

  //添加世界坐标辅助器
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  // 初始化剪切平面

  // 定义平面的位置
  const planePosition = new THREE.Vector3(0, 0, 0); // 定义平面的位置
  const planeNormal = new THREE.Vector3(0, -1, 0);
  const planeConstant = planePosition.dot(planeNormal); // 计算平面常数
  const clippingPlanes = [new THREE.Plane(planeNormal, planeConstant)]; // 创建剪切平面
  renderer1.clippingPlanes = clippingPlanes; // 设置渲染器的剪切平面
  renderer2.clippingPlanes = clippingPlanes; // 设置渲染器的剪切平面

  function animate() {
    // 更新控制器
    controls1.update();
    controls2.update();
    requestAnimationFrame(animate);

    // 渲染
    scene.add(axesHelper);
    renderer1.render(scene, camera1);
    //删除世界坐标辅助器
    scene.remove(axesHelper);
    //渲染第二个相机
    renderer2.render(scene, camera2);
  }
  animate();

  //监听窗口变化
  window.addEventListener("resize", () => {
    renderer1.setSize(container1.clientWidth, container1.clientHeight);
    camera1.aspect = container1.clientWidth / container1.clientHeight;
    camera1.updateProjectionMatrix();

    renderer2.setSize(container2.clientWidth, container2.clientHeight);
    camera2.aspect = container2.clientWidth / container2.clientHeight;
    camera2.updateProjectionMatrix();
  });
}
export function updateScene(container1, container2, value) {
  // 获取现有的剪切平面
  const clippingPlanes = renderer1.clippingPlanes;

  // 定义平面的位置
  const planePosition = new THREE.Vector3(0, value, 0); // 定义平面的位置
  const planeNormal = new THREE.Vector3(0, -1, 0);
  const planeConstant = planePosition.dot(planeNormal); // 计算平面常数

  // 更新现有的剪切平面
  clippingPlanes[0].constant = planeConstant;

  // 更新渲染器的剪切平面
  renderer1.clippingPlanes = clippingPlanes;
  renderer2.clippingPlanes = clippingPlanes;

  // 渲染
  renderer1.render(scene, camera1);
  camera2.position.set(0, 1.5 - value, 0);
  renderer2.render(scene, camera2);
}
export function changeScene(container1, container2, value, crossValue) {
  const points = crossValue;

  // 计算每个子数组的长度
  const partLength = Math.ceil(points.length / 3) ;

  // 创建三个空数组来存放结果
  const points1 = [];
  const points2 = [];
  const points3 = [];
  const points4 = [];
  const points5 = [];
  const points6 = [];
  const points7 = [];
  const points8 = [];
  const points9 = [];

  // 遍历原始数组，根据索引分配元素
  for (let i = 0; i < points.length; i++) {
    if (i % 3 === 0) {
      points1.push(points[i]);
    } else if (i % 3 === 1) {
      points5.push(points[i]);
    } else {
      points9.push(points[i]);
    }
  }

  for (let i = 0; i < partLength; i++) {
    points3.push((points1[i] + points5[i]) / 2);
    points7.push((points5[i] + points9[i]) / 2);
  }
  for (let i = 0; i < partLength; i++) {
    points2.push((points1[i] + points3[i]) / 2);
    points4.push((points3[i] + points5[i]) / 2);
    points6.push((points5[i] + points7[i]) / 2);
    points8.push((points7[i] + points9[i]) / 2);
  }

  const createDataTexture = (points) => {
    const texture = new THREE.DataTexture(
      new Float32Array(points),
      Math.sqrt(points.length),
      Math.sqrt(points.length),
      THREE.RedFormat,
      THREE.FloatType
    );
    texture.needsUpdate = true;
    return texture;
  };

  const dataTexture1 = createDataTexture(points1);
  const dataTexture2 = createDataTexture(points2);
  const dataTexture3 = createDataTexture(points3);
  const dataTexture4 = createDataTexture(points4);
  const dataTexture5 = createDataTexture(points5);
  const dataTexture6 = createDataTexture(points6);
  const dataTexture7 = createDataTexture(points7);
  const dataTexture8 = createDataTexture(points8);
  const dataTexture9 = createDataTexture(points9);

  // 创建着色器材质
  const crossMaterials = [];
  for (let dataTexture of [
    dataTexture1,
    dataTexture2,
    dataTexture3,
    dataTexture4,
    dataTexture5,
    dataTexture6,
    dataTexture7,
    dataTexture8,
    dataTexture9,
  ]) {
    const crossMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dataTexture: { value: dataTexture },
      },
      vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
      fragmentShader: `
      uniform sampler2D dataTexture;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(dataTexture, vUv);
        gl_FragColor = vec4(color.r, 1.0 - color.r, 0.0, 1.0);
      }
    `,
      side: THREE.DoubleSide,
    });
    crossMaterials.push(crossMaterial);
  }

  // 创建网格
  crossplane1 = new THREE.Mesh(crossGeometry, crossMaterials[0]);
  crossplane1.position.set(0, 1.5, 0);
  crossplane1.rotation.x = -Math.PI / 2;
  crossplane2 = new THREE.Mesh(crossGeometry, crossMaterials[1]);
  crossplane2.position.set(0, 1.125, 0);
  crossplane2.rotation.x = -Math.PI / 2;
  crossplane3 = new THREE.Mesh(crossGeometry, crossMaterials[2]);
  crossplane3.position.set(0, 0.75, 0);
  crossplane3.rotation.x = -Math.PI / 2;
  crossplane4 = new THREE.Mesh(crossGeometry, crossMaterials[3]);
  crossplane4.position.set(0, 0.375, 0);
  crossplane4.rotation.x = -Math.PI / 2;
  crossplane5 = new THREE.Mesh(crossGeometry, crossMaterials[4]);
  crossplane5.position.set(0, 0, 0);
  crossplane5.rotation.x = -Math.PI / 2;
  crossplane6 = new THREE.Mesh(crossGeometry, crossMaterials[5]);
  crossplane6.position.set(0, -0.375, 0);
  crossplane6.rotation.x = -Math.PI / 2;
  crossplane7 = new THREE.Mesh(crossGeometry, crossMaterials[6]);
  crossplane7.position.set(0, -0.75, 0);
  crossplane7.rotation.x = -Math.PI / 2;
  crossplane8 = new THREE.Mesh(crossGeometry, crossMaterials[7]);
  crossplane8.position.set(0, -1.125, 0);
  crossplane8.rotation.x = -Math.PI / 2;
  crossplane9 = new THREE.Mesh(crossGeometry, crossMaterials[8]);
  crossplane9.position.set(0, -1.51, 0);
  crossplane9.rotation.x = -Math.PI / 2;

  // 添加到场景中
  scene.add(crossplane1);
  scene.add(crossplane2);
  scene.add(crossplane3);
  scene.add(crossplane4);
  scene.add(crossplane5);
  scene.add(crossplane6);
  scene.add(crossplane7);
  scene.add(crossplane8);
  scene.add(crossplane9);

}
