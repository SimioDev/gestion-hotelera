const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const NGROK_API_URL = process.env.EXPO_PUBLIC_NGROK_URL || 'http://localhost:4040/api/tunnels';
const FILES_TO_UPDATE = [
  'src/screens/LoginScreen.tsx',
  'src/screens/HomeScreen.tsx',
  'src/screens/CreateHotelScreen.tsx',
  'src/screens/ProfileScreen.tsx',
  'src/screens/SharedHotelScreen.tsx',
  'src/components/shared/ShareButton.tsx'
];

async function getNgrokUrl() {
  try {
    const response = await axios.get(NGROK_API_URL);
    const tunnel = response.data.tunnels.find(t => t.proto === 'https');
    if (!tunnel) {
      throw new Error('No HTTPS tunnel found');
    }
    return tunnel.public_url;
  } catch (error) {
    console.error('Error fetching ngrok URL:', error.message);
    process.exit(1);
  }
}

async function updateFiles(ngrokUrl) {
  for (const filePath of FILES_TO_UPDATE) {
    const fullPath = path.join(__dirname, filePath);
    try {
      let content = await fs.readFile(fullPath, 'utf8');
      content = content.replace(/https:\/\/[a-z0-9-]+\.ngrok-free\.app/g, ngrokUrl);
      await fs.writeFile(fullPath, content, 'utf8');
      console.log(`Updated ngrok URL in ${filePath} to ${ngrokUrl}`);
    } catch (error) {
      console.error(`Error updating ${filePath}:`, error.message);
    }
  }
}

async function main() {
  const ngrokUrl = await getNgrokUrl();
  await updateFiles(ngrokUrl);
}

main();
