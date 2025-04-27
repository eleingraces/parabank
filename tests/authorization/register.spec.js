import { test } from '@playwright/test';
import { registerUserPage } from '../../support/authorization/register';

test('User is able to register as new user.', async ({ page }) => {
   const registerPage = new registerUserPage();

   await page.goto('/');
   await registerPage.goToRegistrationPage(page);
   await registerPage.register(page);
});