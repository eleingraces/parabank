import { test } from '@playwright/test';
import { loginUserPage } from '../../support/authorization/login';
import { openNewAccPage } from '../../support/account-services/openNewAcc';

test.beforeEach(async ({ page }) => {
   const loginPage = new loginUserPage();

   await page.goto('/');
   await loginPage.login(page);
 });

test('User is able to open new account successfully.', async ({ page }) => {

      const newAccPage = new openNewAccPage();
      await newAccPage.openNewAccSteps(page);
  });