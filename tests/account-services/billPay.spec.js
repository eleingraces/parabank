import { test } from '@playwright/test';
import { loginUserPage } from '../../support/authorization/login';
import { accountsOverviewPage } from '../../support/account-services/accountsOverview';
import { openNewAccPage } from '../../support/account-services/openNewAcc';
import { transferFundsPage } from '../../support/account-services/transferFunds';
import { billPayPage } from '../../support/account-services/billPay';

const loginPage = new loginUserPage();
const accountsOverview = new accountsOverviewPage();
const newAccPage = new openNewAccPage();
const transferFunds = new transferFundsPage();
const billPay = new billPayPage();

//pre-requisite (register new account)

test.beforeEach(async ({ page }) => {
   //login
   await page.goto('/');
   await loginPage.login(page);

   //capture original account number details
   await accountsOverview.goToAccountsOverview(page);
   await accountsOverview.getAccountNumber1Details(page);

   //add new account
   await newAccPage.openNewAccSteps(page);

   //transfer funds
   await transferFunds.goToTranferFundsPage(page);
   await transferFunds.transferAmount(page);
   await transferFunds.selectAccount(page);
   await transferFunds.transferSuccess(page);
 });

test('User is able to navigate through the global navigation page successfully.', async ({ page }) => {
      await billPay.goToBillPayPage(page);
      await billPay.fillOutForm(page);
      await billPay.selectAccount(page);
      await billPay.sendPayment(page);
  });