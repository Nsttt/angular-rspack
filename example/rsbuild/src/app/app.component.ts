import { Component, computed, signal } from '@angular/core';

interface PipelineStep {
  name: string;
  detail: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly publishes = signal(12);
  protected readonly steps: PipelineStep[] = [
    { name: 'Entry', detail: 'src/main.ts' },
    { name: 'Plugin', detail: 'angular-rspack/rsbuild' },
    { name: 'Output', detail: 'dist/' },
  ];

  protected readonly nextPublish = computed(() => this.publishes() + 1);

  protected increment() {
    this.publishes.update((value) => value + 1);
  }
}
