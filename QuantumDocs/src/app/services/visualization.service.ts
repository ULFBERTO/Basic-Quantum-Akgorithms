import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { BehaviorSubject } from 'rxjs';
import { BlochSphereData, VisualizationConfig } from '../models/quantum-behavior.model';

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private animationFrameId: number | null = null;

  private blochSphereState = new BehaviorSubject<BlochSphereData>({
    theta: 0,
    phi: 0,
    x: 0,
    y: 0,
    z: 1
  });
  public blochSphereState$ = this.blochSphereState.asObservable();

  constructor() {}

  initializeScene(container: HTMLElement, config?: VisualizationConfig): void {
    // Crear escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(config?.renderSettings.backgroundColor || '#0A0E1A');

    // Configurar cámara
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(
      config?.cameraSettings.fov || 75,
      aspect,
      config?.cameraSettings.near || 0.1,
      config?.cameraSettings.far || 1000
    );
    
    const camPos = config?.cameraSettings.position || { x: 3, y: 3, z: 3 };
    this.camera.position.set(camPos.x, camPos.y, camPos.z);
    this.camera.lookAt(0, 0, 0);

    // Configurar renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: config?.renderSettings.antialias ?? true,
      alpha: true
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, config?.renderSettings.ambientLight || 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, config?.renderSettings.directionalLight || 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Grid y ejes si están habilitados
    if (config?.showGrid) {
      const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
      this.scene.add(gridHelper);
    }

    if (config?.showAxes) {
      const axesHelper = new THREE.AxesHelper(2);
      this.scene.add(axesHelper);
    }

    this.animate();
  }

  createBlochSphere(): THREE.Group {
    const group = new THREE.Group();

    // Esfera semi-transparente
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x4D96FF,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);

    // Wireframe
    const wireframe = new THREE.WireframeGeometry(sphereGeometry);
    const line = new THREE.LineSegments(wireframe);
    (line.material as THREE.LineBasicMaterial).color.setHex(0x4D96FF);
    (line.material as THREE.LineBasicMaterial).opacity = 0.3;
    (line.material as THREE.LineBasicMaterial).transparent = true;
    group.add(line);

    // Ejes X, Y, Z
    this.addAxis(group, new THREE.Vector3(1.5, 0, 0), 0xFF0000, 'X');
    this.addAxis(group, new THREE.Vector3(0, 1.5, 0), 0x00FF00, 'Y');
    this.addAxis(group, new THREE.Vector3(0, 0, 1.5), 0x0000FF, 'Z');

    // Etiquetas de estados
    this.addLabel(group, '|0⟩', new THREE.Vector3(0, 0, 1.3), 0xFFFFFF);
    this.addLabel(group, '|1⟩', new THREE.Vector3(0, 0, -1.3), 0xFFFFFF);

    // Vector de estado (inicialmente en |0⟩)
    const arrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      1,
      0x00BFFF,
      0.2,
      0.1
    );
    arrowHelper.name = 'stateVector';
    group.add(arrowHelper);

    return group;
  }

  private addAxis(group: THREE.Group, direction: THREE.Vector3, color: number, label: string): void {
    const origin = new THREE.Vector3(0, 0, 0);
    const arrowHelper = new THREE.ArrowHelper(
      direction.clone().normalize(),
      origin,
      direction.length(),
      color,
      0.15,
      0.1
    );
    group.add(arrowHelper);
  }

  private addLabel(group: THREE.Group, text: string, position: THREE.Vector3, color: number): void {
    // Crear sprite para texto (simplificado)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 128;
    canvas.height = 64;
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.font = 'Bold 32px Space Grotesk, Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 64, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.scale.set(0.5, 0.25, 1);
    group.add(sprite);
  }

  updateBlochSphereState(theta: number, phi: number): void {
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    this.blochSphereState.next({ theta, phi, x, y, z });

    // Actualizar vector en la escena
    if (this.scene) {
      const stateVector = this.scene.getObjectByName('stateVector') as THREE.ArrowHelper;
      if (stateVector) {
        stateVector.setDirection(new THREE.Vector3(x, y, z));
      }
    }
  }

  animateGateTransition(
    fromState: BlochSphereData,
    toState: BlochSphereData,
    duration: number = 1000
  ): void {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Interpolación esférica
      const theta = fromState.theta + (toState.theta - fromState.theta) * progress;
      const phi = fromState.phi + (toState.phi - fromState.phi) * progress;
      
      this.updateBlochSphereState(theta, phi);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  createQuantumGateVisualization(gateType: string): THREE.Group {
    const group = new THREE.Group();

    // Crear representación 3D de la puerta
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.2);
    let color = 0x9333EA;

    switch (gateType) {
      case 'h': color = 0x9333EA; break;
      case 'x': color = 0xF97316; break;
      case 'y': color = 0xEC4899; break;
      case 'z': color = 0x10B981; break;
      case 'cx': color = 0x0EA5E9; break;
    }

    const material = new THREE.MeshPhongMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    // Agregar brillo
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, linewidth: 2 });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    group.add(edges);

    return group;
  }

  createCircuitVisualization(numQubits: number): THREE.Group {
    const group = new THREE.Group();
    const spacing = 1.5;

    for (let i = 0; i < numQubits; i++) {
      // Línea de qubit
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-5, -i * spacing, 0),
        new THREE.Vector3(5, -i * spacing, 0)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x666666 });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      group.add(line);

      // Etiqueta de qubit
      this.addLabel(group, `q${i}`, new THREE.Vector3(-5.5, -i * spacing, 0), 0xFFFFFF);
    }

    return group;
  }

  addObjectToScene(object: THREE.Object3D): void {
    if (this.scene) {
      this.scene.add(object);
    }
  }

  removeObjectFromScene(object: THREE.Object3D): void {
    if (this.scene) {
      this.scene.remove(object);
    }
  }

  private animate(): void {
    if (!this.renderer || !this.scene || !this.camera) return;

    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(container: HTMLElement): void {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }

  getScene(): THREE.Scene | null {
    return this.scene;
  }

  getCamera(): THREE.PerspectiveCamera | null {
    return this.camera;
  }
}
