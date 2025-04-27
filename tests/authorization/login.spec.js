import { test } from '@playwright/test';
import { loginUserPage } from '../../support/authorization/login';

test('User is able to login with correct credentials.', async ({ page }) => {
   const loginPage = new loginUserPage();

   await page.goto('/');
   await loginPage.fillInLoginCredentials(page);
   await loginPage.submitLogin(page);
   await loginPage.landingPage(page);
});