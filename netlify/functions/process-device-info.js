exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    console.log(`it's 405`);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const xmlData = event.body;
    
    // Validate that it's a plist
    if (!xmlData.includes('<?xml version="1.0"') || !xmlData.includes('</plist>')) {
      console.log(`it's 400`);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid plist format' })
      };
    }
    
    // Parse the XML using a server-side XML parser
    const DOMParser = require('xmldom').DOMParser;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");

    console.log(`parsed ${xmlDoc}`)
    
    // Extract device information
    const deviceInfo = {
      UDID: xmlDoc.getElementsByTagName('UDID')[0]?.textContent || '',
      DEVICE_NAME: xmlDoc.getElementsByTagName('DEVICE_NAME')[0]?.textContent || '',
      PRODUCT: xmlDoc.getElementsByTagName('PRODUCT')[0]?.textContent || '',
      VERSION: xmlDoc.getElementsByTagName('VERSION')[0]?.textContent || '',
      CHALLENGE: xmlDoc.getElementsByTagName('CHALLENGE')[0]?.textContent || ''
    };
    
    // Create the redirect URL with parameters
    const params = new URLSearchParams(deviceInfo).toString();
    const redirectUrl = `https://ahmad-nashihuddien.netlify.app/get-ios-udid/complete?${params}`;

    return {
      statusCode: 302,
      headers: {
        Location: redirectUrl
      },
      body: JSON.stringify(deviceInfo)
    };
  } catch (error) {
    console.log(`it's 500 ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
};