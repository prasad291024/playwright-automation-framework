import { chromium, request } from '@playwright/test';
import fs from 'fs';

async function globalSetup() {
  // const browser = await chromium.launch();
  // const page = await browser.newPage();

  // await page.goto('https://your-app.com/login'); // ✅ Replace with actual login URL
  // await page.waitForSelector('#username', { state: 'visible' }); // ✅ Wait for input

  
  // await page.fill('#username', process.env.USERNAME || '');
  // await page.fill('#password', process.env.PASSWORD || '');
  // await page.click('button[type="submit"]');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://demo.automationtesting.in/Register.html');
  await page.context().storageState({ path: 'storageState.json' });

  await browser.close();



  // ✅ API call using request.newContext()
  const apiContext = await request.newContext();
  const response = await apiContext.get('https://jsonplaceholder.typicode.com/users/1');
  const data = await response.json();
  console.log('API response:', data);

  // Save storage state
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;