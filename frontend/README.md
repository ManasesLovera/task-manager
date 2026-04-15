# TaskManager Frontend

A modern, responsive frontend for the TaskManager internal ticketing system, designed to streamline support requests across organizational departments.

## 🚀 Project Summary

TaskManager provides a centralized platform for managing and tracking internal support tickets. This frontend is built to be fast, intuitive, and accessible, ensuring that team members can quickly report issues and support staff can efficiently resolve them.

### Key Features
- **Modern UI**: Built with React 19 and Tailwind CSS 4 for a clean, professional look.
- **Efficient Data Fetching**: Utilizes TanStack Query for robust state management and API interaction.
- **Type Safety**: Fully implemented in TypeScript to minimize runtime errors and improve developer experience.

## 🛠 Prerequisites

- **Node.js**: `v24.x.x` (Recommended)
- **NPM**: `v11.x.x` (Recommended)

## ⚙️ Setup & Installation

Follow these steps to get the project running locally:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd task-manager/login/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Ensure you have a `.env` file in the root directory with the following configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🏗 Available Scripts

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles the TypeScript code and builds the project for production.
- `npm run lint`: Runs ESLint to check for code quality and style issues.
- `npm run preview`: Locally previews the production build.

## 🧰 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) & [TanStack Query](https://tanstack.com/query/latest)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
