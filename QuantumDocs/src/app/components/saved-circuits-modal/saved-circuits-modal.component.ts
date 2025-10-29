import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { SavedConfiguration } from '../../models/quantum-behavior.model';

@Component({
  selector: 'app-saved-circuits-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="text-white text-2xl font-bold">Circuitos Guardados</h2>
          <button (click)="close()" class="text-white hover:text-primary">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="modal-body">
          <div *ngIf="savedConfigs.length === 0" class="text-center py-8">
            <p class="text-slate-400">No hay circuitos guardados</p>
          </div>
          
          <div *ngFor="let config of savedConfigs" 
               class="config-card"
               (click)="selectConfig(config)">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-white font-bold">{{ config.name }}</h3>
                <p class="text-slate-400 text-sm">{{ config.description || 'Sin descripción' }}</p>
                <p class="text-slate-500 text-xs mt-1">
                  {{ config.circuit.qubits }} qubits, {{ config.circuit.gates.length }} puertas
                </p>
              </div>
              <div class="flex gap-2">
                <button (click)="exportConfig($event, config)" 
                        class="icon-btn"
                        title="Exportar">
                  <span class="material-symbols-outlined">download</span>
                </button>
                <button (click)="deleteConfig($event, config.id)" 
                        class="icon-btn text-red-400 hover:text-red-300"
                        title="Eliminar">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            <div class="flex gap-2 mt-2">
              <span *ngFor="let tag of config.tags" 
                    class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      background: #14142B;
      border-radius: 1rem;
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .config-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      padding: 1rem;
      margin-bottom: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .config-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(77, 150, 255, 0.5);
      transform: translateY(-2px);
    }

    .icon-btn {
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
      color: rgba(255, 255, 255, 0.7);
    }

    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .tag {
      background: rgba(77, 150, 255, 0.2);
      color: #4D96FF;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
  `]
})
export class SavedCircuitsModalComponent {
  @Output() configSelected = new EventEmitter<SavedConfiguration>();
  @Output() closed = new EventEmitter<void>();

  savedConfigs: SavedConfiguration[] = [];

  constructor(private storageService: StorageService) {
    this.loadConfigs();
  }

  loadConfigs(): void {
    this.savedConfigs = this.storageService.getAllConfigurations();
  }

  selectConfig(config: SavedConfiguration): void {
    this.configSelected.emit(config);
    this.close();
  }

  exportConfig(event: Event, config: SavedConfiguration): void {
    event.stopPropagation();
    const json = this.storageService.exportConfiguration(config.id);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.replace(/\s+/g, '_')}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  deleteConfig(event: Event, id: string): void {
    event.stopPropagation();
    if (confirm('¿Estás seguro de que quieres eliminar este circuito?')) {
      this.storageService.deleteConfiguration(id);
      this.loadConfigs();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
