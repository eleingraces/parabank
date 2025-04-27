import { expect } from '@playwright/test';

let menuList = [
   { name: 'About Us', url: 'https://parabank.parasoft.com/parabank/about.htm' },
   { name: 'Services', url: 'https://parabank.parasoft.com/parabank/services.htm' },
   { name: 'Products', url: 'https://www.parasoft.com/products/' },
   { name: 'Locations', url: 'https://www.parasoft.com/solutions/' },
   { name: 'Admin Page', url: 'https://parabank.parasoft.com/parabank/admin.htm' }
]

class globalNavigationPage {

  async goToRegistrationPage(page){
   for (const { name, url } of menuList) {
      const menuLink = page.locator('div#headerPanel a').filter({ hasText: name });

      await expect(menuLink).toBeVisible();
      await Promise.all([
      page.waitForURL(url, { timeout: 20000 }),
      menuLink.click()
      ]);

      await page.waitForLoadState('domcontentloaded');
      console.log(`Navigated successfully to "${name}" → ${url}`);

      if (name !== 'Admin Page') {
      await page.goto('https://parabank.parasoft.com/');
      }
   }
  }

 } 
 export { globalNavigationPage };