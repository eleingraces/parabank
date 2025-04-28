import { test } from '@playwright/test';
import { loginUserPage } from '../../support/authorization/login';
import { accountsOverviewPage } from '../../support/account-services/accountsOverview';
import { openNewAccPage } from '../../support/account-services/openNewAcc';
import { transferFundsPage } from '../../support/account-services/transferFunds';


const loginPage = new loginUserPage();
const accountsOverview = new accountsOverviewPage();
const newAccPage = new openNewAccPage();
const transferFunds = new transferFundsPage();

test.beforeEach(async ({ page }) => {
   //login
   await page.goto('/');
   await loginPage.login(page);

   //capture original account number details
   await accountsOverview.goToAccountsOverview(page);
   await accountsOverview.getAccountNumber1Details(page);

   //add new account
   await newAccPage.openNewAccSteps(page);

 });

test('User is able to transfer funds from newly created account to original account successfully.', async ({ page }) => {
      await transferFunds.goToTranferFundsPage(page);
      await transferFunds.transferAmount(page);
      await transferFunds.selectAccount(page);
      await transferFunds.transferSuccess(page);
  });