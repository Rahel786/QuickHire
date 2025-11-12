# Events API Setup Guide

## Overview

The Career Events Calendar page now integrates with the Eventbrite API to fetch real technical events. If the API is not configured, the page will fall back to sample events.

## Setup Instructions

### Option 1: Eventbrite API (Recommended)

1. **Get Eventbrite API Token:**
   - Go to [Eventbrite Developer Portal](https://www.eventbrite.com/platform/api-keys/)
   - Sign in or create an account
   - Create a new API key
   - Copy your Personal OAuth Token

2. **Add to Frontend .env:**
   ```env
   VITE_EVENTBRITE_TOKEN=your_eventbrite_token_here
   ```

3. **Restart the frontend server:**
   ```bash
   npm run dev
   ```

### Option 2: Eventful API (Alternative)

1. **Get Eventful API Key:**
   - Go to [Eventful API](http://api.eventful.com/)
   - Sign up for a free account
   - Get your API key

2. **Add to Frontend .env:**
   ```env
   VITE_EVENTFUL_KEY=your_eventful_key_here
   ```

## How It Works

1. **API Integration:**
   - The page attempts to fetch events from Eventbrite API
   - Searches for technical events using keywords: "technology programming software developer"
   - Filters events to show only technical/tech-related events
   - Shows only upcoming events (future dates)

2. **Event Filtering:**
   - Filters events based on technical keywords:
     - tech, programming, software, developer, coding
     - hackathon, webinar, conference, workshop
     - AI, ML, data science, cybersecurity
     - cloud, devops, frontend, backend, full stack
     - JavaScript, Python, React, Node.js

3. **Fallback:**
   - If API fails or no token is provided, shows sample events
   - Displays a helpful message to users

4. **Event Transformation:**
   - Converts Eventbrite event format to our internal format
   - Maps fields: title, company, date, time, location, description, etc.
   - Adds event URL for direct registration

## Features

- ✅ Real-time event data from Eventbrite
- ✅ Automatic filtering for technical events
- ✅ Location-based search
- ✅ Upcoming events only
- ✅ Direct links to event registration
- ✅ Graceful fallback to sample events
- ✅ Loading states and error handling

## API Rate Limits

- **Eventbrite:** Free tier allows reasonable usage
- **Eventful:** Check their documentation for rate limits

## Troubleshooting

### Events not loading:
1. Check browser console for errors
2. Verify API token is set correctly in `.env`
3. Check network tab for API requests
4. Ensure token has proper permissions

### No events showing:
1. Try changing location filter
2. Check if there are upcoming technical events
3. Verify API token is valid
4. Check API response in browser console

### CORS Errors:
- Eventbrite API should handle CORS properly
- If issues occur, you may need to use a backend proxy

## Notes

- The API integration is optional - the page works with sample events if no API key is provided
- Events are filtered to show only technical/programming related events
- Only upcoming events are displayed
- Maximum 50 events are shown at a time

