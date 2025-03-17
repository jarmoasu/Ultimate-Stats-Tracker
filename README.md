# Ultimate Stats Tracker

Ultimate Stats Tracker is a lightweight web application designed to help you track game statistics for Ultimate Frisbee matches. The app allows you to manage players, record in-game events, view real-time statistics, and export your data as a CSV file. It also features server-side scraping to automatically add players from external event pages.

The app is coded using AI asssitant (Version 1 with Google Gemini and there on with ChatGPT 03-mini )

## Technologies

- **HTML/CSS/JavaScript:** Front-end interface and dynamic functionality.
- **LocalStorage:** For data persistence across sessions.
- **Serverless Functions (Vercel):** To perform server-side scraping with [Cheerio](https://cheerio.js.org/).
- **Vercel:** Hosting and deployment platform for serverless applications.

## Project Structure
ultimate-stats-tracker/ ├── index.html # Main HTML file ├── style.css # Stylesheet for the app ├── script.js # Client-side JavaScript for functionality ├── package.json # Project metadata and dependencies └── api/ └── scrape.js # Serverless function for scraping player names

## Features

- **Player Management:**  
  Easily add, view, and remove players. Each player is displayed with a red "×" button for quick removal.

- **Event Recording:**  
  Record key game events—such as passes, turnovers, assists, goals, breaks, and drops—for each player using a dedicated button interface. Event cells also show the current count next to the button.

- **Real-Time Statistics:**  
  See live updates in player statistics and event logs as you record game events.

- **Data Export:**  
  Export your game data as a CSV file for further analysis.

- **Server-Side Scraping:**  
  Automatically scrape player names from external event pages (from nimenhuuto.com) using a serverless API. No CORS workarounds needed on the client side!

- **Undo Functionality:**  
  Easily undo the last recorded event with a dedicated, wide, and centered button.

## Installation and Local Development

To set up and test Ultimate Stats Tracker locally, follow these steps:

1. **Clone or Download the Repository:**  
   Ensure your project folder includes the following files and folders:
   - `index.html`
   - `style.css`
   - `script.js`
   - `package.json`
   - `/api/scrape.js`

2. **Install Dependencies:**  
   Open your terminal in the project folder and run:


3. **Run the App Locally Using Vercel CLI:**  
If you haven’t already, install the Vercel CLI globally (preferably via [nvm](https://github.com/nvm-sh/nvm)):

Then start the local development server:
Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.


## Deployment to Vercel

Ultimate Stats Tracker is optimized for deployment to Vercel. Once you have tested your app locally, deploy it with these steps:

1. **Log In to Vercel:**  
In your project folder, run:

Follow the prompts to log in via your email.

2. **Deploy the Project:**  
Run the following command in the root directory of your project:

Answer the guided prompts to set up and deploy your project. Vercel will provide a public URL for your live app.

Answer the guided prompts to set up and deploy your project. Vercel will provide a public URL for your live app.

3. **Updating Your App:**  
When you need to update the app, run:
to push your changes to production.




