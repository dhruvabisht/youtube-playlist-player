const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// YouTube Data API Key
const apiKey = 'AIzaSyDRioYpAK_NcXj0jq9IcqbBjVK0__rxOI0';

// Serve the static HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});


// API endpoint to fetch playlist data
app.get('/api/playlist', async (req, res) => {
  const playlistUrl = req.query.playlistUrl;

  try {
    // Extract playlist ID from URL
    const playlistId = extractPlaylistId(playlistUrl);

    // Get playlist items using YouTube Data API
    const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    const response = await axios.get(playlistItemsUrl);
    const items = response.data.items;

    // Extract video IDs from playlist items
    const videoIds = items.map(item => item.snippet.resourceId.videoId);

    res.json({ videoIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch playlist data' });
  }
});

// Extract playlist ID from URL
function extractPlaylistId(playlistUrl) {
  const url = new URL(playlistUrl);
  return url.searchParams.get('list');
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
