import { test } from '@playwright/test';
import { loginUserPage } from '../../support/authorization/login';
import { logoutUserPage } from '../../support/authorization/logout';

test.beforeEach(async ({ page }) => {
   const loginPage = new loginUserPage();

   await page.goto('/');
   await loginPage.login(page);
 });

test.describe('User is able to logout successfully.', () => {
   test('should register correctly', async ({ page }) => {

      const logoutPage = new logoutUserPage();

      await page.goto('/');
      await logoutPage.logoutUser(page);
      await logoutPage.landingPage(page);
  });
   
   
});