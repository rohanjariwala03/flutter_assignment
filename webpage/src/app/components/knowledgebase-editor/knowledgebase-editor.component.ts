import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-knowledgebase-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">{{ componentTitle }}</h2>
      </div>
      
      <div class="p-6">
        <div class="mb-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
          <input 
            type="text" 
            id="title"
            [(ngModel)]="articleTitle"
            placeholder="Enter article title..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
        </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
              <div class="flex space-x-2">
                <button 
                  (click)="toggleMode('edit')"
                  [class]="getModeBtnClass('edit')"
                  class="px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-gray-200"
                >
                  Edit
                </button>
                <button 
                  (click)="toggleMode('preview')"
                  [class]="getModeBtnClass('preview')"
                  class="px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-gray-200"
                >
                  Preview
                </button>
              </div>
            </div>
            
            <div *ngIf="mode === 'edit'">
              <textarea 
                id="content"
                [(ngModel)]="articleContent"
                placeholder="Write your article content here... (Supports Markdown)"
                class="w-full h-60 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none font-mono text-sm"
              ></textarea>
            </div>
            
            <div *ngIf="mode === 'preview'" class="h-60 px-3 py-2 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div class="prose max-w-none" [innerHTML]="getPreviewHTML()"></div>
            </div>
          </div>

        <button 
                  (click)="saveArticle()"
                  [disabled]="!canSaveArticle()"
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Save Article
        </button>

        <div *ngIf="saveMessage" class="mt-4 p-3 rounded-lg" [ngClass]="getMessageClass()">
          {{ saveMessage.text }}
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class KnowledgebaseEditorComponent {
  articleTitle: string = '';
  mode: 'edit' | 'preview' = 'edit';
  saveMessage: { type: 'success' | 'error', text: string } | null = null;

  componentTitle: string = 'Knowledgebase Editor';

  articleContent: string = ``;

  constructor() {
    this.articleContent = this.defaultContent;
  }

  toggleMode(newMode: 'edit' | 'preview') {
    this.mode = newMode;
  }

  getModeBtnClass(mode: string): string {
    if (this.mode === mode) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-gray-100 text-gray-700';
    }
  }

  getPreviewHTML(): string {

    let html = this.articleContent;

    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');

    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');

    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>');

    html = html.replace(/\`([^`]+)\`/gim, '<code>$1</code>');

    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');

    html = html.replace(/\n/gim, '<br>');

    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');

    return html;
  }

  canSaveArticle(): boolean {
    let titleFilled = this.articleTitle.trim().length > 0;
    let contentFilled = this.articleContent.trim().length > 0;

    return titleFilled && contentFilled;
  }

  saveArticle() {

    if (!this.canSaveArticle()) {
      return;
    }


    this.saveMessage = {
      type: 'success',
      text: `Article "${this.articleTitle}" saved successfully!`
    };

    this.articleTitle = '';
    this.articleContent = '';

    setTimeout(() => {
      this.saveMessage = null;
    }, 3000);
  }

  clearEditor() {

    let confirmClear = confirm('Are you sure you want to clear the editor? This will remove all unsaved content.');

    if (confirmClear === true) {
      this.articleTitle = '';
      this.articleContent = '';
      this.saveMessage = null;

    } else {
    }
  }

  getMessageClass(): string {
    if (this.saveMessage) {
      if (this.saveMessage.type === 'success') {
        return 'bg-green-100 text-green-800';
      } else if (this.saveMessage.type === 'error') {
        return 'bg-red-100 text-red-800';
      }
    }
    return '';
  }

  defaultContent: string = `# Knowledgebase Editor
  This is a sample article to show you the editor functionality.

  ## Features

  - **Markdown Support**: Write articles using Markdown syntax
  - **Live Preview**: Switch between edit and preview modes

  ## Getting Started

  1. Enter a title for your article
  2. Write your content using Markdown
  3. Use the preview mode to see how it will look
  4. Save your article when ready

  ### Code Example

  \`\`\`javascript
    function greet(name) {
    return \`Hello, \${name}!\`;
    }
  \`\`\`
  `;

}
