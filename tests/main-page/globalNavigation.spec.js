import { test } from '@playwright/test';
import { loginUserPage } from '../../support/authorization/login';
import { globalNavigationPage } from '../../support/main-page/global-navigation';

test.beforeEach(async ({ page }) => {
   const loginPage = new loginUserPage();

   await page.goto('/');
   await loginPage.login(page);
 });

test('User is able to navigate through the global navigation page successfully.', async ({ page }) => {

      const navigatePage = new globalNavigationPage();
      await navigatePage.goToRegistrationPage(page);
  });