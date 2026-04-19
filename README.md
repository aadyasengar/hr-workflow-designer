# HR Workflow Designer

A visual workflow builder for designing and simulating HR processes like onboarding, approvals, and task automation using a node-based interface.

---

## 🚀 Overview

This project allows users to create and manage workflows visually by connecting different types of nodes such as tasks, approvals, and automated actions.

It is designed to simulate real-world HR workflows in a structured and interactive way.

---

## ✨ Features

- 🧩 Drag-and-drop workflow builder using React Flow
- 🔗 Connect nodes to define workflow logic
- 🧠 Multiple node types:
  - Start Node
  - Task Node
  - Approval Node
  - Automated Node
  - End Node
- 📝 Dynamic node configuration forms
- ⚙️ Automated nodes with dynamic parameters from mock API
- ✅ Workflow validation (structure + connections)
- ▶️ Workflow simulation with step-by-step execution logs
- 🎨 Color-coded nodes for better visualization
- 🗂️ Export / Import workflow as JSON
- 🧭 MiniMap and controls for navigation

---

## 🏗️ Tech Stack

- React (Vite)
- TypeScript
- React Flow
- Zustand (State Management)

---

## 🧠 Architecture

The project follows a modular and scalable architecture:
src/
├── components/ # UI components
├── nodes/ # Custom node types
├── forms/ # Dynamic node forms
├── store/ # Zustand global state
├── api/ # Mock API layer
├── hooks/ # Custom hooks
├── types/ # TypeScript types

### Key Design Decisions:
- Centralized state using Zustand for managing nodes and edges
- Separation of node UI and form logic for scalability
- Dynamic form generation for automated nodes based on API response
- Designed to easily support new node types without modifying existing logic

---

## ⚙️ How It Works

1. Drag nodes from the sidebar onto the canvas
2. Connect nodes to define workflow sequence
3. Configure each node using the side panel
4. Validate the workflow structure
5. Run simulation to view execution flow

---

## 🧪 Mock API

- `GET /automations` → returns available automated actions
- `POST /simulate` → returns execution logs for workflow

---

## ▶️ Getting Started

```bash
# Install dependencies
npm install

# Run the app
npm run dev
