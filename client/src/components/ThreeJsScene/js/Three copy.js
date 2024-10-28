// 导入threejs
import * as THREE from "three";
//导入轨道控制
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

export default function init(container) {
  //创建场景
  const scene = new THREE.Scene();

  //创建相机
  const camera = new THREE.PerspectiveCamera(
    45, //视角
    container.clientWidth / container.clientHeight, //宽高比
    0.1, //近平面
    1000 //远平面
  );

  //创建渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  //创建几何体
  const geometry = new THREE.BoxGeometry(6, 6, 6);

  // 定义顶点颜色
  const colors = [];
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    // 使用HSV到RGB的转换或直接定义颜色
    const color = new THREE.Color().setHSL((x + y + z) / 9, 1, 0.5);
    colors.push(color.r, color.g, color.b);
  }

  // 将颜色数据添加到几何体的属性中
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  // 创建材质
  const material = new THREE.MeshBasicMaterial({
    vertexColors: true, // 使用顶点颜色
    transparent: true, // 开启透明度
    opacity: 0.5, // 设置透明度
    side: THREE.DoubleSide, // 确保内外部都被渲染
  });

  //创建网格
  const cube = new THREE.Mesh(geometry, material);

  //设置位置
  cube.position.set(0, 0, 0);
  //添加网格到场景中
  scene.add(cube);
  camera.position.set(10, 10, 10);

  //设置相机位置
  camera.lookAt(0, 0, 0);

  //添加轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  //设置阻尼damping
  controls.dampingFactor = 0.2;

  // 设置旋转速度
  // controls.autoRotate = true;
  controls.rotateSpeed = 0.5;

  //添加世界坐标辅助器
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  // 创建一个平面几何体作为剪切平面
  const planeGeometry = new THREE.PlaneGeometry(6, 6);
  //材质设置为透明
  const planeMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide, // 确保两面都是透明的
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.y = 3.5; // 设置平面的位置
  plane.rotation.x = -Math.PI / 2; // 设置平面的朝向

  scene.add(plane);

  // 初始化剪切平面
  let currentPlaneY = plane.position.y - 0.5; // 初始化 currentPlaneY
  // 定义平面的位置
  const planePosition = new THREE.Vector3(0, -currentPlaneY, 0); // 定义平面的位置
  const planeNormal = new THREE.Vector3(0, -1, 0);
  const planeConstant = planePosition.dot(planeNormal); // 计算平面常数
  const clippingPlanes = [new THREE.Plane(planeNormal, planeConstant)]; // 创建剪切平面
  renderer.clippingPlanes = clippingPlanes; // 设置渲染器的剪切平面

  // 获取立方体几何体的顶点
  const cubegeometry = cube.geometry;
  const vertices = [];
  for (let i = 0; i < cubegeometry.attributes.position.array.length; i += 3) {
    vertices.push(
      new THREE.Vector3(
        cubegeometry.attributes.position.array[i],
        cubegeometry.attributes.position.array[i + 1],
        cubegeometry.attributes.position.array[i + 2]
      )
    );
  }

  // 添加一个新相机来观察立方体的顶部
  const topCamera = new THREE.PerspectiveCamera(
    45, //视角
    container.clientWidth / container.clientHeight, //宽高比
    0.1, //近平面
    1000 //远平面
  );
  topCamera.position.set(0, 10, 0); // 设置相机位置在立方体的顶部
  topCamera.lookAt(0, 0, 0); // 设置相机朝向立方体的中心

  // 添加一个GUI按钮来切换相机
  let cameraOptions = {
    switchToMainCamera: function () {
      camera.visible = true;
      topCamera.visible = false;
    },
    switchToTopCamera: function () {
      camera.visible = false;
      topCamera.visible = true;
    },
  };

  //创建GUI
  const guiContainer = document.getElementById("gui-container");
  const gui = new GUI({ autoPlace: false });
  gui.add(cameraOptions, "switchToMainCamera").name("切换到主相机");
  gui.add(cameraOptions, "switchToTopCamera").name("切换到顶部相机");
  guiContainer.appendChild(gui.domElement);

  function animate() {
    // 更新控制器
    controls.update();
    requestAnimationFrame(animate);

    // 检查 plane.position.y 是否发生变化
    if (plane.position.y - 0.5 !== currentPlaneY) {
      currentPlaneY = plane.position.y - 0.5;
      // 更新剪切平面的位置和法线
      const planePosition = new THREE.Vector3(0, -currentPlaneY, 0); // 定义平面的位置
      const planeNormal = new THREE.Vector3(0, -1, 0);
      const planeConstant = planePosition.dot(planeNormal); // 计算平面常数
      clippingPlanes[0].constant = planeConstant; // 更新现有的剪切平面
      renderer.clippingPlanes = clippingPlanes; // 更新渲染器的剪切平面
    }

    // 渲染
    renderer.render(scene, camera.visible ? camera : topCamera);
  }
  animate();

  //监听窗口变化
  // 在窗口大小改变时重新设置渲染器和相机的长宽比例
  window.addEventListener("resize", () => {
    renderer.setSize(container.clientWidth, container.clientHeight); // 设置渲染器的尺寸
    camera.aspect = container.clientWidth / container.clientHeight; // 设置相机的长宽比例
    camera.updateProjectionMatrix(); // 更新相机的投影矩阵
    topCamera.aspect = container.clientWidth / container.clientHeight; // 设置顶部相机的长宽比例
    topCamera.updateProjectionMatrix(); // 更新顶部相机的投影矩阵
  });

  let eventObj = {
    Fullscreen: function () {
      document.body.requestFullscreen();
    },
    exitFullscreen: function () {
      document.body.exitFullscreen();
    },
  };

  //添加数据
  gui.add(eventObj, "Fullscreen").name("全屏");
  gui.add(eventObj, "exitFullscreen").name("退出全屏");

  let colorParams = {
    cubeColor: "#ff0000",
  };

  gui
    .addColor(colorParams, "cubeColor")
    .name("cube颜色")
    .onChange(function (value) {
      cube.material.color.set(value);
    });
  // 添加一个gui的滑块，可以让planePosition上下移动
  gui.add(plane.position, "y", -3, 3, 0.1).name("平面位置");
}
