# ⛪ Sauti Nyikani Church

<p align="center">
  <img src="Frontend/src/assets/images/logo.png" alt="Sauti Nyikani Church Logo" width="160"/>
</p>

<h3 align="center">Church Website & Management Application</h3>

<p align="center">
  A modern, responsive, and installable platform connecting the church community through worship, sermons, events, ministries, and church administration.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/PWA-Installable-5A0FC8" alt="PWA"/>
</p>

---

## 📖 About the Project

**Sauti Nyikani Church Website & Management Application** is a church platform developed to improve communication, make church information accessible, and simplify administrative activities.

The project combines a public website with a protected management dashboard. Visitors can explore church information and activities, while authorized administrators can manage church content through a centralized interface.

The application is designed for mobile phones, tablets, and desktop computers, with Progressive Web App (PWA) support for installation on compatible devices.

## ✨ Features

### 🌐 Public Website

- **Home:** A welcoming introduction to the church.
- **About Us:** Church background and information.
- **Ministries:** Information about church ministries.
- **Sermons:** Access to published sermons and associated media.
- **Events:** Church events and activities.
- **Gallery:** Photos documenting church life and activities.
- **Giving:** Church giving information and contribution options.
- **Prayer Requests:** A way for visitors to submit prayer requests.
- **Contact:** Contact information and message submission.
- **Bible:** A dedicated Bible section.
- **Settings:** User-facing application preferences.
- **Multilingual Interface:** English, French, and Swahili support.
- **Responsive Design:** Adaptable layouts for different screen sizes.

### 🔐 Management Dashboard

The protected management interface provides administrative tools for authorized users.

- **Ministries Management:** Maintain ministry information and activities.
- **Sermons Management:** Create and manage sermon content.
- **Events Management:** Organize and update church events.
- **Gallery Management:** Upload and manage church photographs.
- **Contributions Management:** Record contributions and track giving status.
- **Projects Management:** Set project goals, record contributions, and track progress.
- **Announcements Management:** Publish and update church announcements.
- **Giving Management:** Manage giving-related information and records.
- **Prayer Requests and Contact Messages:** Manage submitted requests and messages through the available administrative features.

### 📱 Progressive Web App (PWA)

The application includes PWA support intended to provide an app-like experience on compatible devices.

- Installable on supported mobile devices and desktop browsers.
- Access through an installed app icon.
- Responsive user interface.
- Public website and management interface in one frontend.
- Protected management routes for authenticated administrators.

Installation availability depends on the browser, device, and correct production PWA configuration.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and production builds |
| Tailwind CSS | Styling and responsive layouts |
| Node.js | Backend runtime |
| Express.js | REST API and server functionality |
| PostgreSQL | Relational database |
| JWT | Authentication |
| PWA | Installable application support |
| Render | Application hosting |

## 🗂️ Project Structure

```text
sauiti-nyikani-church/
├── Frontend/
│   ├── public/
│   │   ├── _redirects
│   │   └── ...
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/
│   ├── src/
│   │   └── server.js
│   ├── uploads/
│   ├── package.json
│   └── ...
└── README.md
```

*This is a high-level overview; individual filenames and subfolders may differ in the current repository.*

## 🚀 Getting Started

### Prerequisites

Install the following before running the application locally:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- A PostgreSQL database

### 1. Clone the Repository

```bash
git clone https://github.com/FREDDY2002835/sauiti-nyikani-church.git
cd sauiti-nyikani-church
```

### 2. Install and Run the Frontend

Open a terminal in the repository root:

```bash
cd Frontend
npm install
```

Create a `.env` file inside `Frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Make sure this URL matches the backend API address used by your local environment.

Start the frontend:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

### 3. Install and Run the Backend

Open a second terminal from the repository root:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the environment variables required by your backend:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

DATABASE_URL=your_postgresql_connection_string

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=your_long_random_secret
```

If email delivery is enabled, configure the email variables required by the current backend implementation and the email provider you use.

Replace all example values with your own configuration. Do not commit real credentials to GitHub.

Start the backend:

```bash
npm start
```

The backend health endpoint should respond at:

```text
http://localhost:5000/
```

The frontend communicates with the backend through the configured API URL.

## ☁️ Deployment

The application can be deployed with separate frontend and backend services.

### Frontend Deployment

Typical Vite build settings:

- **Root directory:** `Frontend`
- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`

Configure the production environment variable:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

Replace the example URL with your actual backend API URL. Rebuild and redeploy the frontend after changing `VITE_API_URL`.

### Backend Deployment

Typical Node.js backend settings:

- **Root directory:** `backend`
- **Build command:** `npm install`
- **Start command:** `npm start`

Configure the production environment variables in your hosting dashboard, including:

- `PORT`, if required by the hosting provider.
- `FRONTEND_URL`, set to the production frontend origin.
- `DATABASE_URL`, set to the production PostgreSQL connection string.
- `ADMIN_EMAIL`.
- `ADMIN_PASSWORD`.
- `JWT_SECRET`.
- Any additional variables required by the configured email and media-storage services.

Ensure CORS allows requests from your deployed frontend.

### Database

The application uses PostgreSQL. Configure a reachable production database and provide its connection string through `DATABASE_URL`.

Keep database credentials private and ensure the database is accessible from the backend hosting environment.

### Uploaded Media

Uploaded images and other media should be stored using persistent storage, such as a suitable cloud media service, rather than relying on a temporary server filesystem.

This helps prevent uploaded files from disappearing after server restarts or deployments.

## 🔒 Security

Security considerations include:

- Protecting administrative routes with authentication.
- Storing secrets in environment variables.
- Keeping database credentials and API keys out of source control.
- Restricting CORS to authorized frontend origins.
- Using HTTPS in production.
- Validating uploaded files and request data.
- Using persistent storage for uploaded media.
- Applying appropriate access controls to administrative functions.

**Never publish your `.env` files, administrator password, database connection string, JWT secret, or private API keys.**

## 🎯 Project Objectives

The project aims to:

- Strengthen communication between the church and its community.
- Make sermons, events, ministries, and announcements easier to access.
- Simplify church content management.
- Improve the organization of contributions and projects.
- Support tracking of project goals and progress.
- Provide convenient access across mobile and desktop devices.
- Offer a centralized digital platform for church activities.

## 👨‍💻 Developer

**Developed by:** Fred

**GitHub:** [@FREDDY2002835](https://github.com/FREDDY2002835)

**Repository:** [Sauti Nyikani Church](https://github.com/FREDDY2002835/sauiti-nyikani-church)

## 📄 License

No license has been specified for this repository. Unless a license is added, standard copyright restrictions apply to the source code.

---

<p align="center">
  <strong>Built with purpose to help the Sauti Nyikani Church community stay connected, informed, and organized.</strong>
</p>
