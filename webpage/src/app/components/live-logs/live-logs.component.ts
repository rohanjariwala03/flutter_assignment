import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
}

@Component({
  selector: 'app-live-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h2>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              (click)="clearLogs()"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="mb-4 flex flex-wrap gap-2">
          <button 
            *ngFor="let level of logLevels; let i = index"
            (click)="toggleFilter(level)"
            [class]="getFilterButtonClass(level)"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          >
            {{ formatLogLevel(level) }}
            <span class="ml-1 text-xs">({{ getLogCountByLevel(level) }})</span>
          </button>
        </div>

        <div class="bg-gray-900 text-green-400 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm" #logsContainer>
          <div *ngFor="let log of filteredLogs; trackBy: trackByLogId; let i = index" class="mb-1 hover:bg-gray-800 px-2 py-1 rounded">
            <span class="text-gray-500">{{ formatLogTimestamp(log.timestamp) }}</span>
            <span [class]="getLogLevelClass(log.level)" class="ml-2 font-semibold">{{ formatLogLevelDisplay(log.level) }}</span>
            <span class="ml-2 text-blue-400">[{{ log.source }}]</span>
            <span class="ml-2">{{ log.message }}</span>
          </div>
          
          <div *ngIf="filteredLogs.length === 0" class="text-center py-8 text-gray-500">
            {{ getEmptyStateMessage() }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class LiveLogsComponent implements OnInit, OnDestroy {
  logs: LogEntry[] = [];
  filteredLogs: LogEntry[] = [];
  logLevels = ['info', 'warning', 'error', 'debug'];
  activeFilters: Set<string> = new Set(['info', 'warning', 'error', 'debug']);
  private logInterval: any;

  pageTitle: string = 'Live Logs Panel';

  private logSources = ['auth-service', 'api-gateway', 'database', 'cache', 'notification-service', 'file-processor'];

  private sampleMessages = {
    info: [
      'User login successful',
      'API request processed',
      'Database connection established',
      'Cache hit for user data',
      'Notification sent successfully',
      'File upload completed',
      'Session renewed',
      'Health check passed'
    ],
    warning: [
      'API rate limit approaching',
      'Database connection pool 80% full',
      'Cache miss rate increasing',
      'Large file upload detected',
      'Slow query detected',
      'Memory usage above threshold'
    ],
    error: [
      'Authentication failed',
      'Database timeout',
      'API endpoint not found',
      'File processing failed',
      'Network connection lost',
      'Invalid request format'
    ],
    debug: [
      'Query execution time: 45ms',
      'Cache key generated',
      'Request headers validated',
      'File size: 2.3MB',
      'Session data serialized',
      'Response compressed'
    ]
  };

  constructor() {
  }

  ngOnInit() {
    this.startLogGeneration();
    this.generateInitialLogs();
  }

  ngOnDestroy() {
    if (this.logInterval) {
      clearInterval(this.logInterval);
    }
  }

  generateInitialLogs() {

    for (let i = 0; i < 20; i++) {
      this.generateRandomLog();
    }

    this.updateFilteredLogs();
  }

  startLogGeneration() {

    this.logInterval = setInterval(() => {
      this.generateRandomLog();
      this.updateFilteredLogs();
      this.scrollToBottom();
    }, 2000 + Math.random() * 3000);
  }

  generateRandomLog() {
    const levels: Array<'info' | 'warning' | 'error' | 'debug'> = ['info', 'warning', 'error', 'debug'];

    const level = levels[Math.floor(Math.random() * levels.length)];
    const source = this.logSources[Math.floor(Math.random() * this.logSources.length)];
    const messages = this.sampleMessages[level];
    const message = messages[Math.floor(Math.random() * messages.length)];

    const log: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level: level,
      message: message,
      source: source
    };

    this.logs.push(log);

    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

  }

  updateFilteredLogs() {

    this.filteredLogs = [];
    for (let i = 0; i < this.logs.length; i++) {
      let log = this.logs[i];
      if (this.activeFilters.has(log.level)) {
        this.filteredLogs.push(log);
      }
    }
  }

  toggleFilter(level: string) {

    if (this.activeFilters.has(level)) {
      this.activeFilters.delete(level);
    } else {
      this.activeFilters.add(level);
    }

    this.updateFilteredLogs();
  }

  getFilterButtonClass(level: string): string {
    const baseClass = 'px-3 py-1 rounded-full text-sm font-medium transition-colors';
    const isActive = this.activeFilters.has(level);

    if (level === 'info') {
      return isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    } else if (level === 'warning') {
      return isActive ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    } else if (level === 'error') {
      return isActive ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    } else if (level === 'debug') {
      return isActive ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    } else {
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  }

  getLogLevelClass(level: string): string {
    if (level === 'info') {
      return 'text-blue-400';
    } else if (level === 'warning') {
      return 'text-yellow-400';
    } else if (level === 'error') {
      return 'text-red-400';
    } else if (level === 'debug') {
      return 'text-purple-400';
    } else {
      return 'text-gray-400';
    }
  }

  getLogCountByLevel(level: string): number {
    let count = 0;
    for (let i = 0; i < this.logs.length; i++) {
      if (this.logs[i].level === level) {
        count++;
      }
    }
    return count;
  }

  clearLogs() {

    let confirmClear = confirm('Are you sure you want to clear all logs?');

    if (confirmClear === true) {
      this.logs = [];
      this.filteredLogs = [];
    } else {
    }
  }

  trackByLogId(index: number, log: LogEntry): string {
    return log.id;
  }

  private scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.bg-gray-900');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 0);
  }

  formatLogLevel(level: string): string {
    return level.charAt(0).toUpperCase() + level.slice(1);
  }

  formatLogLevelDisplay(level: string): string {
    return level.toUpperCase();
  }

  formatLogTimestamp(timestamp: Date): string {
    let hours = timestamp.getHours().toString().padStart(2, '0');
    let minutes = timestamp.getMinutes().toString().padStart(2, '0');
    let seconds = timestamp.getSeconds().toString().padStart(2, '0');
    let milliseconds = timestamp.getMilliseconds().toString().padStart(3, '0');

    return hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
  }

  getEmptyStateMessage(): string {
    return this.filteredLogs.length === 0
      ? 'No logs to display. Waiting for new entries...'
      : '';
  }
}
