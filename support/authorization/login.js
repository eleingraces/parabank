import { expect } from '@playwright/test';
import fs from 'fs/promises';  // Use fs.promises for async/await
import path from 'path';

const filePath = path.resolve(__dirname, '../../fixtures/data.json');

class loginUserPage {
   async fillInLoginCredentials(page) {
      await page.waitForSelector('input[name="username"]', { state: 'visible' });

      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const { username, password } = parsedData;

         console.log(`Username: ${username}`);
         console.log(`Password: ${password}`);

         await page.fill('input[name="username"]', username);
         await page.fill('input[name="password"]', password);
      } catch (err) {
         console.error('Error reading or parsing the file:', err);
      }
   }

   async submitLogin(page) {
      await page.locator('input.button[type="submit"]').click();
   }

   async landingPage(page) {
      const accountsOverview = page.locator('h1.title', { hasText: 'Accounts Overview' });
      await expect(accountsOverview).toBeVisible();
      await expect(accountsOverview).toContainText('Accounts Overview');
   }

   async login(page) {
      await this.fillInLoginCredentials(page);
      await this.submitLogin(page);
      await this.landingPage(page);
   }
}

export { loginUserPage };
