import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BlochSphereComponent } from '../bloch-sphere/bloch-sphere.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, BlochSphereComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(private router: Router) {}

  navigateToDesigner(): void {
    this.router.navigate(['/designer']);
  }

  navigateToExplorer(): void {
    this.router.navigate(['/explorer']);
  }

  navigateToGates(): void {
    this.router.navigate(['/gates']);
  }
}
