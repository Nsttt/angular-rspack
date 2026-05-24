import { Component, computed, signal } from '@angular/core';

interface BuildMetric {
  label: string;
  value: string;
  tone: 'cold' | 'warm' | 'hot';
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly rebuilds = signal(3);
  protected readonly metrics: BuildMetric[] = [
    { label: 'Angular entry', value: 'src/main.ts', tone: 'cold' },
    { label: 'Config surface', value: '/rspack', tone: 'warm' },
    { label: 'Dev server', value: '4200', tone: 'hot' },
  ];

  protected readonly buildLabel = computed(
    () => `local rebuild #${this.rebuilds()}`
  );

  protected increment() {
    this.rebuilds.update((value) => value + 1);
  }
}
