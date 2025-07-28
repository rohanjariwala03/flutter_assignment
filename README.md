# Assignment Project

This project consists of two main components: a Flutter messaging application with an integrated dashboard and an Angular-based internal tools dashboard for support agents.

## Project Structure

```
assignment/
├── flutter_app/          # Flutter messaging app with WebView dashboard
└── webpage/              # Angular internal tools dashboard
```

## Components Overview

### 1. Flutter Messaging App (`flutter_app/`)

A cross-platform Flutter application featuring messaging capabilities and an embedded dashboard using WebView.

#### Features
- **Messaging System**
  - Chat UI with message bubbles
  - Send and receive messages (simulated agent replies)
  - Messages saved locally using SharedPreferences
  - Unread message badge in navigation
  - Clear all messages with confirmation dialog.

- **Dashboard Integration**
  - WebView integration for displaying the internal dashboard
  - Error handling with retry functionality
  - Loading indicators during dashboard load
  - Manual refresh capability

### 2. Internal Tools Dashboard (`webpage/`)

An Angular-based dashboard designed for support agents with comprehensive internal tools.

#### Features
- **Ticket Viewer**
  - Display and filter support tickets in a table format
  - Filter by status (Open, In Progress, Closed)
  - Shows ticket details: ID, subject, status, priority, assignee, creation date

- **Knowledgebase Editor**
  - Rich text editor with Markdown support
  - Live preview functionality
  - Article title and content editing
  - Save functionality with success notifications

- **Live Logs**
  - Real-time log streaming capabilities
  - Filter by log level (Info, Warning, Error, Debug)
  - Clear all logs functionality
  - Terminal-style display with color coding

## Prerequisites

### For Flutter App
- Flutter SDK (3.0.0 or higher)
- Dart SDK (included with Flutter)

### For Angular Dashboard
- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Angular CLI

## Installation & Setup

### Setting up the Angular Dashboard

1. Navigate to the webpage directory:
   ```bash
   cd webpage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   # OR
   npx ng serve --host 0.0.0.0 --port 4200
   ```

4. The dashboard will be available at `http://localhost:4200`

### Setting up the Flutter App

1. Navigate to the flutter_app directory:
   ```bash
   cd flutter_app
   ```

2. Install Flutter dependencies:
   ```bash
   flutter pub get
   ```

3. Run the app:
   ```bash
   flutter run
   ```

   For specific platforms:
   ```bash
   flutter run -d ios     
   flutter run -d android 
   flutter run -d chrome  
   flutter run -d windows 
   flutter run -d macos   
   ```

## Running Both Components Together

1. **Start the Angular dashboard first** (it needs to be running on port 4200 for the Flutter app's WebView to work):
   ```bash
   cd webpage
   npm start
   ```

2. **Then start the Flutter app** in a new terminal:
   ```bash
   cd flutter_app
   flutter run
   ```

The Flutter app will embed the Angular dashboard in its WebView component, creating a unified experience.

## Troubleshooting

### Dashboard Not Loading in Flutter App
- Ensure the Angular dashboard is running on port 4200
- Check network connectivity
- Verify firewall settings aren't blocking the connection
- Use the manual refresh button in the Flutter app

### Flutter Build Issues
```bash
cd flutter_app
flutter clean
flutter pub get
flutter run
```

### Angular Development Server Issues
```bash
cd webpage
rm -rf node_modules package-lock.json
npm install
npm start
```
