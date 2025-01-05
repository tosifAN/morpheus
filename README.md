# Form Builder Application

## Overview
This project is a Form Builder application that allows admins to create forms, add various types of questions, and view analytics for form submissions. End-users can submit responses to the forms, and both admins and users can access analytics via a public URL. 

This repository includes both the frontend (React with Tailwind CSS) and the backend (Django with SQLite database) of the application.


[![Application Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://youtu.be/o3mkl3ReGSM)


## Features
### Admin User Features:
- **Create Forms**: Admins can create unlimited forms with up to 100 questions per form.
- **Add Questions**: Admins can add various question types like Text, Dropdown, and Checkbox.
- **Analytics**: Admins can view analytics for each form, including the most common responses for each question type.

### End User Features:
- **Submit Responses**: Users can submit responses anonymously to any form.
- **Unlimited Submissions**: Users can submit the form an unlimited number of times.

### Shared Features:
- **View Analytics**: Both Admins and End-users can access the analytics of forms through a public URL.

## Tech Stack
### Backend (Django):
- **Django**: A Python framework for building web applications.
- **SQLite**: A lightweight, file-based database used to store form submissions and question data.
- **Django REST Framework**: Used to expose APIs for the frontend to interact with the backend.

### Frontend (React):
- **React**: A JavaScript library for building user interfaces.
- **React Router**: A library for handling navigation and routing within the app.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building modern UIs.
- **Axios**: A promise-based HTTP client for making requests to the API.

## Project Structure

src/
├── components/
│   ├── Admin/
│   │   ├── FormBuilder.js
│   │   ├── FormList.js
│   │   ├── Analytics
│   │  
│   │     
│   │     
│   │   
│   │   
│   ├── EndUser/
│   │   ├── FormResponse.js
│   │   ├── ThankYou.js
│   │   
│   └── Shared/
│       ├── Navbar.js
│       ├── Footer.js
│       └── Loader.js
├── pages/
│   ├── AdminDashboard.js
│   ├── SubmitForm.js
│   └── AnalyticsPage.js
|
├── App.js
├── index.js
└── styles/
    └── main.css



### Backend Directory:
- Contains Django application and API views for handling forms, responses, and analytics.
- Uses SQLite as the database to store the forms, questions, responses, and answers.

### Frontend Directory:
- Contains React application with components for form creation, form submission, analytics viewing, etc.
- Tailwind CSS is used for styling the frontend.

## Getting Started

### 1. Backend Setup (Django)
1. Clone the repository:
   ```bash
   git clone https://github.com/tosifAN/morpheus.git

2. Set up a Python virtual environment (recommended):
  ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt

4. Apply migrations to set up the database:
   ```bash
   cd app_backend
   python manage.py migrate

5. Run the Django server:
    ```bash
    python manage.py runserver


### 2. Frontend Setup (React)

1. Clone the repository:
   ```bash
   git clone https://github.com/tosifAN/morpheus.git
   cd morpheus/UI

2. Install the required dependencies:
   ```bash
   npm install


3. Start the React development server:
   ```bash
   npm start

### 3. Connecting Frontend and Backend

The frontend React app is configured to make API calls to the Django backend at http://localhost:8000/api/.

Ensure both servers (Django and React) are running simultaneously during development.

## API Documentation

You can access the API documentation via Swagger UI at the following URL when the backend is running:
    ```bash
    http://127.0.0.1:8000/swagger/


