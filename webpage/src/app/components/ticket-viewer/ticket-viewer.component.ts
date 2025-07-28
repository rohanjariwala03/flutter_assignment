import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Ticket {
  id: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: Date;
  priority: 'Low' | 'Medium' | 'High';
  assignee: string;
}

@Component({
  selector: 'app-ticket-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h2>
          <div class="flex space-x-2">
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let ticket of tickets; let index = index" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ ticket.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ ticket.subject }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [class]="getStatusClass(ticket.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ ticket.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [class]="getPriorityClass(ticket.priority)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ ticket.priority }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ ticket.assignee }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(ticket.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class TicketViewerComponent implements OnInit {
  tickets: Ticket[] = [];
  currentFilter: string = 'All';
  statuses = ['All', 'Open', 'In Progress', 'Closed'];
  pageTitle: string = 'Support Tickets';
  totalTickets: number = 0;

  ngOnInit() {
    this.loadTickets();
    this.totalTickets = this.tickets.length;
  }

  loadTickets() {
    this.generateDummyTickets();
  }

  generateDummyTickets() {

    const subjects = [
      'Login issues with mobile app',
      'Payment processing error',
      'Account verification failed',
      'Data export not working',
      'Password reset not received',
      'Feature request: Dark mode',
      'Bug: Dashboard not loading',
      'Integration API timeout',
      'Email notifications stopped',
      'Profile picture upload issue'
    ];

    const assignees = ['Rohan Doe', 'Jane Smith', 'R J', 'Jamie Smith', 'Tom Cruise'];

    const statuses: Array<'Open' | 'In Progress' | 'Closed'> = ['Open', 'In Progress', 'Closed'];

    const priorities: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];

    for (let i = 1; i <= 10; i++) {
      // Generating random tickets
      let newTicket: Ticket = {
        id: String(i),
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assignee: assignees[Math.floor(Math.random() * assignees.length)],
        createdAt: this.getRandomDateWithinLast30Days()
      };

      this.tickets.push(newTicket);
    }

  }

  getFilterButtonClass(status: string): string {
    if (this.currentFilter === status) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  }

  getStatusClass(status: string): string {
    if (status === 'Open') {
      return 'bg-red-100 text-red-800';
    } else if (status === 'In Progress') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (status === 'Closed') {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityClass(priority: string): string {
    if (priority === 'High') {
      return 'bg-red-100 text-red-800';
    } else if (priority === 'Medium') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (priority === 'Low') {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date): string {
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();

    if (day.length === 1) day = '0' + day;
    if (month.length === 1) month = '0' + month;
    if (hours.length === 1) hours = '0' + hours;
    if (minutes.length === 1) minutes = '0' + minutes;

    return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes;
  }

  getRandomDateWithinLast30Days(): Date {
    const now = Date.now();
    // Generate a random offset within the last 30 days
    const randomOffset = Math.random() * 30 * 24 * 60 * 60 * 1000;
    return new Date(now - randomOffset);
  }

}
