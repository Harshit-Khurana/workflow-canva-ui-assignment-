🧩 Workflow Builder UI

A visual, interactive Workflow Builder built using React that allows users to create, edit, and manage structured workflows consisting of actions, conditional branches, and end nodes — all without using any third-party diagram or UI libraries.

This project was developed as part of a Frontend Intern Take-Home Assignment to demonstrate skills in component architecture, state management, data modeling, and user experience design.

🚀 Live Demo

🔗 Live Application:
👉 https://workflow-canva-ui-assignment.vercel.app/

📦 GitHub Repository:
👉 https://github.com/Harshit-Khurana/workflow-canva-ui-assignment-

✨ Features
🖥️ Workflow Canvas

Starts with a root “Start” node

Displays workflow in a clear vertical flow layout

Visually distinct and readable nodes

Connection lines between parent and child nodes

🧱 Supported Node Types
Node Type	Description	Children
Action	A single task (e.g., Send Email)	1
Branch	Conditional logic (True / False)	Multiple
End	Terminates the workflow	0
🛠️ Editing & Interactions

➕ Add nodes after any non-End node

🔀 Add steps independently to True / False branches

✏️ Edit node labels inline

🗑️ Delete nodes (except Start)

Parent automatically reconnects to child nodes to preserve flow

⭐ Bonus Features

💾 Save Workflow – Logs complete workflow JSON to the console

♻️ Clean and scalable data structure

🎯 Context-aware UI for adding nodes

🧠 Data Modeling Approach

The workflow is represented as a tree-like structure, where:

Each node has a unique ID

Nodes define their type (action, branch, end)

Relationships are maintained through child references

Branch nodes store multiple outgoing paths

This design ensures:

Easy traversal

Predictable updates

Scalable extension (undo/redo, persistence, etc.)