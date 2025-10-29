import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizationService } from '../../services/visualization.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-bloch-sphere',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bloch-sphere.component.html',
  styleUrl: './bloch-sphere.component.scss'
})
export class BlochSphereComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLDivElement>;
  @Input() autoRotate: boolean = false;
  @Input() showControls: boolean = true;

  private controls: OrbitControls | null = null;
  private blochSphere: THREE.Group | null = null;

  theta: number = 0;
  phi: number = 0;

  constructor(public visualizationService: VisualizationService) {}

  ngOnInit(): void {
    // Esperar a que el DOM esté listo
  }

  ngAfterViewInit(): void {
    // Inicializar después de que la vista esté lista
    setTimeout(() => {
      this.initializeVisualization();
    }, 100);
  }

  ngOnDestroy(): void {
    this.visualizationService.dispose();
  }

  private initializeVisualization(): void {
    const container = this.canvasRef.nativeElement;
    
    // Asegurar que el container tenga tamaño
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      console.warn('Container has no size, retrying...');
      setTimeout(() => this.initializeVisualization(), 200);
      return;
    }
    
    this.visualizationService.initializeScene(container, {
      id: 'bloch-sphere',
      algorithmId: '',
      type: '3d',
      theme: 'dark',
      showGrid: false,
      showAxes: false,
      cameraSettings: {
        position: { x: 3, y: 3, z: 3 },
        target: { x: 0, y: 0, z: 0 },
        fov: 75,
        near: 0.1,
        far: 1000
      },
      renderSettings: {
        antialias: true,
        shadows: false,
        ambientLight: 0.6,
        directionalLight: 0.8,
        backgroundColor: '#0A0E1A'
      }
    });

    // Crear esfera de Bloch
    this.blochSphere = this.visualizationService.createBlochSphere();
    this.visualizationService.addObjectToScene(this.blochSphere);

    // Agregar controles de órbita
    const camera = this.visualizationService.getCamera();
    if (camera) {
      this.controls = new OrbitControls(camera, container);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.autoRotate = this.autoRotate;
      this.controls.autoRotateSpeed = 2.0;
    }

    // Manejar resize
    window.addEventListener('resize', () => this.onResize());
  }

  private onResize(): void {
    this.visualizationService.onWindowResize(this.canvasRef.nativeElement);
  }

  applyHadamard(): void {
    // H|0⟩ = (|0⟩ + |1⟩)/√2 -> θ = π/2, φ = 0
    this.animateToState(Math.PI / 2, 0);
  }

  applyPauliX(): void {
    // X|0⟩ = |1⟩ -> θ = π, φ = 0
    this.animateToState(Math.PI, 0);
  }

  applyPauliY(): void {
    // Y|0⟩ = i|1⟩ -> θ = π, φ = π/2
    this.animateToState(Math.PI, Math.PI / 2);
  }

  applyPauliZ(): void {
    // Z no cambia |0⟩, solo agrega fase
    this.animateToState(0, 0);
  }

  resetState(): void {
    this.animateToState(0, 0);
  }

  private animateToState(targetTheta: number, targetPhi: number): void {
    const currentState = {
      theta: this.theta,
      phi: this.phi,
      x: Math.sin(this.theta) * Math.cos(this.phi),
      y: Math.sin(this.theta) * Math.sin(this.phi),
      z: Math.cos(this.theta)
    };

    const targetState = {
      theta: targetTheta,
      phi: targetPhi,
      x: Math.sin(targetTheta) * Math.cos(targetPhi),
      y: Math.sin(targetTheta) * Math.sin(targetPhi),
      z: Math.cos(targetTheta)
    };

    this.theta = targetTheta;
    this.phi = targetPhi;

    this.visualizationService.animateGateTransition(currentState, targetState, 1000);
  }

  onThetaChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.theta = value;
    this.visualizationService.updateBlochSphereState(this.theta, this.phi);
  }

  onPhiChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.phi = value;
    this.visualizationService.updateBlochSphereState(this.theta, this.phi);
  }
}
