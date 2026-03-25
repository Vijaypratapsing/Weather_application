SkyCast — Weather & Air Quality Dashboard

A simple and responsive weather dashboard built for a Junior ReactJS Frontend Developer test. It uses the Open-Meteo API to show real-time weather data and up to 2 years of historical trends.

What This App Does
 Page 1: Current Weather
Detects your location automatically using your browser
Shows important weather info like:
Temperature (current, min, max)
Humidity, wind speed, UV index
Sunrise & sunset
Rain chances
Displays air quality data:
AQI, PM2.5, PM10, CO, CO2, NO2, SO2
Includes charts for:
Temperature
Humidity
Rain
Wind
Air quality trends

 Page 2: Historical Data
View weather data from the past (up to 2 years)
Charts for:
Temperature trends
Rainfall
Sunrise/sunset timing
Air quality changes
You can scroll and zoom charts for better analysis

 Design & Performance
Works smoothly on mobile, tablet, and desktop
Clean and simple UI
Fast loading with optimized API calls

 Tech Used
React
Recharts (for charts)
Axios (API calls)
CSS Modules (styling)
Open-Meteo API (weather data)

 How to Run the Project
1. Clone the repo
git clone [your-repository-url]
cd weather-dashboard
2. Install dependencies
npm install
3. Start the app
npm start

Open in browser:
  http://localhost:3000


 Notes
Handles large data (2 years) efficiently
Uses optimized API calls for speed
Fully responsive charts