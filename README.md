## ♻️SwachhSeva

**AI-Powered Smart Waste Report System**

SwachhSeva is a real-time, AI-enabled waste monitoring platform that helps identify and prioritize roadside garbage using image analysis and geospatial intelligence. The system enables citizen-driven reporting and supports authorities with actionable insights for efficient waste management.

## Adding Your Logo

To add your custom logo:

1. Replace the `public/logo.svg` file with your logo image (PNG, JPG, or SVG)
2. The Logo component will automatically use your new logo
3. For different formats, update the `src` attribute in `components/Logo.tsx`

Current setup uses an SVG logo with a recycling symbol and leaf design that matches the app's environmental theme.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
