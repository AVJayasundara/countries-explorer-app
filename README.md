Setup Instructions

Prerequisites

Node.js (v16 or later)
npm (v8 or later)

Installation Steps

Clone the repository

bashgit clone https://github.com/AVJayasundara/af-2-AVJayasundara
cd countries-explorer

Install dependencies
npm install

Create a .env file in the root directory (if needed)

REACT_APP_API_URL=https://restcountries.com/v3.1

Start the development server

npm start

The application will open in your browser at http://localhost:3000

Features

Browse all countries with a responsive, dynamic interface
Search countries by name with real-time results
Filter countries by region
View detailed information about each country
Navigate between neighboring countries
Mobile-friendly responsive design

Technology Stack

Frontend: React with functional components and hooks
Language: JavaScript
CSS Framework: Tailwind CSS
API: REST Countries API
Routing: React Router
Hosting: Netlify


API Endpoints Used
This application uses the following endpoints from the REST Countries API:

GET /all - Retrieves all countries
GET /name/{name} - Searches for countries by name
GET /region/{region} - Filters countries by region
GET /alpha/{code} - Gets detailed information about a specific country by code