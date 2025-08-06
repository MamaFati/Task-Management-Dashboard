# Task Management Dashboard

A modern task management application built with React, TypeScript, Vite, Redux, TanStack Query, `shadcn/ui`, Tailwind CSS, and the DummyJSON API.

## Features
- **Authentication**: Login (`/login`) mock  with password visibility toggle.
- **Task Management**: Add, edit, delete tasks with optimistic updates and `localStorage` persistence.
- **Delete Confirmation**: Confirm task deletion via dialog.
- **Filtering**: Filter tasks by status ( `To Do`, `In Progress`, `Done`).
- **Responsive UI**: Blue-themed design with dark mode support.
- **Navigation**: Protected routes, redirects for authenticated/unauthenticated users.

## Tech Stack
- **Frontend**: React, TypeScript, Vite
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query
- **UI Components**: `shadcn/ui`, Tailwind CSS
- **API**: DummyJSON (`/todos`, `/auth/login` )
- **Routing**: React Router DOM

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-management-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install `shadcn/ui` components:
   ```bash
   npx shadcn@latest add button input label dialog select alert-dialog
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open `https://task-management-dashboard-orpin.vercel.app/` in your browser.

## Usage
 
- **Login**: Use `username:  emilys, `password:  emilyspass` at `/login`.
- **Dashboard**: Add, edit, delete tasks at `/dashboard`. Filter tasks by status.
- **Logout**: Click `Log Out` in the navbar to return to `/`.

## Testing
- **Login**: Test with `emilys`/`emilyspass`, verify redirect to `/dashboard`.
- **Signup**: Test with any credentials, verify redirect to `/login`.
- **Tasks**: Add/edit/delete tasks, confirm immediate UI updates and `localStorage` persistence.
- **Errors**: Test invalid login/task inputs, verify error toasts.
- **UI**: Test responsiveness (mobile, tablet, desktop) and dark mode.

## Build
```bash
npm run build
 
```
Open `http://localhost:5173/` to test the production build.

## Notes
- DummyJSON API has mock behavior (non-persistent `add`, `update`, `delete`). `localStorage` is used for persistence.
- Dark mode is supported via Tailwind CSS (`dark:` classes).

## Live Link
[Click here](https://task-management-dashboard-orpin.vercel.app/) to view the live demo:  