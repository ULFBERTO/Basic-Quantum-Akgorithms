import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { CircuitDesignerComponent } from './components/circuit-designer/circuit-designer.component';
import { AlgorithmExplorerComponent } from './components/algorithm-explorer/algorithm-explorer.component';
import { GateVisualizerComponent } from './components/gate-visualizer/gate-visualizer.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'designer', component: CircuitDesignerComponent },
  { path: 'explorer', component: AlgorithmExplorerComponent },
  { path: 'gates', component: GateVisualizerComponent },
  { path: '**', redirectTo: '' }
];
