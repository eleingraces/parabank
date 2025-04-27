import { expect } from '@playwright/test';

class logoutUserPage {
   async logoutUser(page) {
      await expect(page.locator('a[href="logout.htm"]')).toBeVisible();
      await page.locator('a[href="logout.htm"]').click();
   }

   async landingPage(page) {
      expect(page).toHaveURL('/parabank/index.htm?ConnType=JDBC');
      await expect(page.locator('#loginPanel')).toBeVisible();
   }
}
export { logoutUserPage };
