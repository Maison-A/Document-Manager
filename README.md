# PDF Document Management App (WIP)

## Overview
This is a web application for managing PDF documents, where registered users can view, add, and delete documents in a communal pool.

## Technologies Used
- MongoDB
- Express
- Vue.js
- Node.js
- JWT for authentication

## Features
- User Authentication with JWT
- Document Upload and Deletion
- Communal Document Pool
- PDF Viewer

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm

### Setup
1. Clone the repository to your local machine.
    ```
    git clone https://github.com/Maison-A/Document-Manager.git
    ```
2. Navigate to the project directory.
    ```
    cd
    ```
3. Install the required npm packages.
    ```
    npm install
    ```
4. Create a `.env` file to set up your environment variables like your MongoDB connection string, JWT secret, etc.
    ```
    touch .env
    ```
5. cd into the frontend (location of main)
    ```
    cd frontend
    ```
6. Run the application frontend.
    ```
    npm run serve
    ```
7. cd into backend (you can open a new terminal)
    ```
    cd backend
    ```
8. start port listening
    ```
    node server.js
    ```
## Usage
1. Users need to register and log in to access the communal document pool.
2. Upon successful login, a list of available PDF documents will be displayed.
3. Users can upload new PDFs or delete existing ones.

## Author
Maison

## License
This project is licensed under the MIT License.

## Acknowledgments
ChatGPT 4 💚

