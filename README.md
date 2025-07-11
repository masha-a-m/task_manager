# Clarity - Task Management Application

## Overview

Clarity is a modern task management application designed to help users organize their daily tasks with features like priority management, drag-and-drop sorting, and calendar integration. This application provides a clean, intuitive interface for managing personal productivity.

![Clarity Screenshot]  (frontend/public/images/screenshot.png) 

## Features

### Core Functionality
- Task Management:
  - Create, edit, and delete tasks
  - Set priorities (1-4 with color coding)
  - Add descriptions and due dates
- Drag-and-Drop Interface:
  - Reorder tasks intuitively
  - Visual feedback during dragging
- Task Organization:
  - Filter by search terms
  - View tasks by specific dates
  - Priority-based sorting

### User Experience
- Onboarding Flow: Guided setup for new users
- Responsive Design: Works on desktop and mobile
- Visual Indicators:
  - Color-coded priorities
  - Clear task status visualization

### Technical Features
- Authentication: JWT-based secure login
- Data Persistence: API-connected with local caching
- Modern Stack: React, Tailwind CSS, Dnd Kit

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API server (see backend documentation)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/masha-a-m/task_manager.git
   cd clarity-task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment:
   Create a `.env` file in the root directory with:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000/api
   ```

4. Run the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Access the application:
   Open your browser to `http://localhost:3000`

## Usage Guide

### Getting Started
1. Sign up or log in using the authentication system
2. Complete the onboarding process to set up your profile
3. Start adding tasks using the "+ Add Task" button

### Task Management
- Add a Task:
  - Click "Add Task"
  - Enter title (required)
  - Add optional description and due date
  - Set priority (1 = High, 4 = Low)

- Edit a Task:
  - Click the edit icon on any task
  - Modify fields as needed
  - Save changes

- Delete a Task:
  - Click the trash icon on any task
  - Confirm deletion

### Advanced Features
- Reorder Tasks:
  - Drag tasks using the handle on the left
  - Drop to new position

- Filter Tasks:
  - Use the search bar to find specific tasks
  - Click calendar icon to view tasks for a specific date

## Technical Documentation

### Project Structure
```
/src
|-- /components
|   |-- SortableItem.jsx    # Drag-and-drop task component
|   |-- Onboarding.jsx      # New user onboarding flow
|-- /contexts               # (If using context API)
|-- /hooks                  # Custom hooks
|-- /pages
|   |-- Dashboard.jsx       # Main application interface
|   |-- Auth.jsx            # Authentication pages
|-- /utils                  # Utility functions
|-- App.js                  # Main application router
|-- index.js                # Application entry point
```

### Key Dependencies
| Package | Purpose |
|---------|---------|
| React | UI framework |
| React Router | Navigation |
| Axios | HTTP requests |
| @dnd-kit | Drag-and-drop functionality |
| Tailwind CSS | Styling |
| date-fns | Date utilities |

### API Integration
The application expects a REST API with the following endpoints:

- `POST /api/login` - User authentication
- `GET /api/user` - Get user data
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Development

### Scripts
- `npm start`: Run development server
- `npm test`: Run tests
- `npm run build`: Create production build
- `npm run lint`: Run linter

### Styling Conventions
- Uses Tailwind CSS utility classes
- Custom styles in `src/index.css`
- Responsive design with mobile-first approach

## Deployment

### Production Build
1. Create optimized build:
   ```bash
   npm run build
   ```

2. Deploy the `build` directory to your hosting service

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| REACT_APP_API_BASE_URL | Yes | Base URL for API requests |
| REACT_APP_ENV | No | Environment (development/production) |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues or questions, please:
- Open a GitHub issue
- Contact the maintainer at whisperingcodes@gmail.com