# CreditSea Full-Stack Assignment

This project is a MERN stack application designed to process, store, and display Experian soft credit pull data from XML files.

## Features

-   **File Upload:** A RESTful API endpoint to accept XML credit reports.
-   **Data Extraction:** Parses XML to extract key financial details.
-   **Database Storage:** Persists the extracted information in a MongoDB database.
-   **Reporting UI:** A clean React frontend to display the credit report.

## Tech Stack

-   **Frontend:** React.js
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB (with Mongoose)
-   **File Handling:** Multer for uploads, xml2js for parsing.

## Setup and Installation

**Prerequisites:**
* Node.js and npm installed
* MongoDB instance (local or a cloud service like MongoDB Atlas)

**Backend Setup:**

1.  Clone the repository.
2.  Navigate to the `server` directory: `cd server`
3.  Install dependencies: `npm install`
4.  Create a `.env` file and add your `MONGO_URI`:
    `MONGO_URI=your_mongodb_connection_string`
5.  Start the server: `node index.js`

**Frontend Setup:**

1.  Navigate to the `client` directory: `cd client`
2.  Install dependencies: `npm install`
3.  Start the React application: `npm start`

The application will be available at `http://localhost:3000`.