# Admin Dashboard

This is a simple, fully functional admin dashboard web app built with Vite, React, and a Node.js backend that saves data in a local JSON file.

## Features

- **Frontend**:
  - React with Vite as the build tool.
  - Simple, clean, and modern UI for managing codes.
  - Display a list of codes from a JSON file.
  - Buttons to **Add**, **Edit**, and **Delete** codes.
  - Button to view the raw JSON data in a new tab.
  - Responsive design.

- **Backend**:
  - Node.js server using Express.
  - Stores all data in a local `data.json` file.
  - Implements the following routes:
    - `GET /api/data` → returns all codes.
    - `POST /api/add` → adds a new code.
    - `PUT /api/edit` → edits a code by index.
    - `DELETE /api/delete` → deletes a code by index.

## Project Structure

```
.
├── server/
│   ├── data.json
│   └── server.js
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

## How to Run Locally

### 1. Install Dependencies

First, you need to install all the necessary dependencies. Open your terminal in the project's root directory and run the following command:

```bash
npm install
```

### 2. Run the Backend Server

Next, you'll need to start the backend server, which will handle all the API requests. Open a new terminal window in the project's root directory and run the following command:

```bash
npm run server
```

The server will start on `http://localhost:3000`.

### 3. Run the Frontend Development Server

Finally, you can start the frontend development server. Open another terminal window in the project's root directory and run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`. Any changes you make to the frontend code will be reflected in real-time.
