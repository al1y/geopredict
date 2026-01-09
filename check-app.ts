import { chromium } from 'playwright';

async function checkApp() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  try {
    await page.goto('http://localhost:3000', { timeout: 30000 });
    await page.waitForTimeout(5000); // Wait for map to load

    // Try to click on a marker (they have the % text)
    const marker = await page.$('.cursor-pointer');
    if (marker) {
      await marker.click();
      await page.waitForTimeout(1000); // Wait for popup
    }

    // Take screenshot
    await page.screenshot({ path: 'screenshot.png', fullPage: false });
    console.log('Screenshot saved to screenshot.png');

    // Get page title
    const title = await page.title();
    console.log('Page title:', title);

    // Check for popup
    const popup = await page.$('.mapboxgl-popup');
    console.log('Popup found:', !!popup);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

checkApp();
