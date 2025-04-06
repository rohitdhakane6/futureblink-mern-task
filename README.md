


# 📧 Email Sequence Builder – Visual Flowchart Based Marketing Automation

An email marketing sequence builder built using a visual **flowchart interface** powered by `React Flow`, `Bun`, and the **MERN** stack. The app allows users to visually create cold email campaigns with **Cold Email**, **Wait/Delay**, and **Lead Source** blocks and schedules emails accordingly using `Agenda` and `Nodemailer`.

## 🔧 Tech Stack

### Frontend:
- ⚛️ React (with Vite + Bun)
- 🧠 React Flow
- 🌐 Tailwind CSS
- 🔐 Authentication 

### Backend:
- 🟢 Node.js (with Bun runtime)
- 🌐 Express.js
- 📬 Nodemailer
- 🕒 Agenda (Job Scheduler)
- 💾 MongoDB (with Agenda persistence)

## 🚀 Features

- 🎯 Drag-and-drop interface to create flowcharts
- 💬 Nodes:
  - `Cold Email` – Compose an email
  - `Wait/Delay` – Wait before sending the next email
  - `Lead Source` – Source for leads
- 🧠 Intelligent scheduling using Agenda
- 📧 Emails sent using Nodemailer
- 🗃️ Save & persist flows to MongoDB
- 🕓 Emails are scheduled based on node timing and user flow

## 🛠️ Getting Started

### 🖥️ Frontend Setup

```bash
cd web
bun install
bun run dev
```

### 🧪 Backend Setup

```bash
cd api
bun install
bun run dev
```

> Make sure MongoDB is running locally or use a MongoDB Atlas cluster

### 🔐 Environment Variables

Create a `.env` file in `api/` with the following:

```env
PORT=8080
MONGO_URI=
JWT_SECRET=your_jwt_secret

```
Create a `.env` file in `web/` with the following:

```env
VITE_API_URL=http://localhost:8080/api/v1

```



## 📦 Folder Structure

```
/web           # React + ReactFlow frontend
/api           # Node + Express + Agenda backend
```

## 🔗 Live Demo & Links

- 🔗 **Frontend**:https://futureblink.rohitdhakane.me/
- 🔗 **Backend API**:https://futureblink-mern-task.onrender.com
- 📽️ **Demo Video**: https://drive.google.com/file/d/17q27jcCt0RJr-6bniYVdGaenFllC5Qhe/view?usp=drive_link



## ✨ Author
- 📨 Email: rohitdhakane6@email.com
