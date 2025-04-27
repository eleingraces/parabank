import { test } from '@playwright/test';
import { registerUserPage } from '../support/authorization/register';
import { loginUserPage } from '../support/authorization/login';
import { logoutUserPage } from '../support/authorization/logout';
import { globalNavigationPage } from '../support/main-page/global-navigation';
import { accountsOverviewPage } from '../support/account-services/accountsOverview';
import { openNewAccPage } from '../support/account-services/openNewAcc';
import { transferFundsPage } from '../support/account-services/transferFunds';
import { billPayPage } from '../support/account-services/billPay';
import { findTransactionsPage } from '../support/account-services/findTransactions';

const registerPage = new registerUserPage();
const loginPage = new loginUserPage();
const logoutPage = new logoutUserPage();
const navigatePage = new globalNavigationPage();
const accountsOverview = new accountsOverviewPage();
const newAccPage = new openNewAccPage();
const transferFunds = new transferFundsPage();
const billPay = new billPayPage();
const findTransactions = new findTransactionsPage();


   test('End to end testing of Para Bank application', async ({page}) => {
      await test.step('Go to Para Bank website', async () => {
         await page.goto('/');
      });

      await test.step('Register new user', async () => {
         await registerPage.goToRegistrationPage(page);
         await registerPage.register(page);
      });

      await test.step('Logout from created user', async () => {
         await logoutPage.logoutUser(page);
         await logoutPage.landingPage(page);
      });
   
      await test.step('Login from created user', async () => {
         await loginPage.login(page);
      });

      await test.step('Navigate through the global navigation page', async () => {
         await navigatePage.goToRegistrationPage(page);
      });

      await test.step('Capture the original account number details', async () => {
         await accountsOverview.goToAccountsOverview(page);
         await accountsOverview.getAccountNumber1Details(page);
      });

      await test.step('Open new account', async () => {
         await newAccPage.openNewAccSteps(page);
      });

      await test.step('Validate if account number details are correct', async () => {
         await accountsOverview.goToAccountsOverview(page);
         await accountsOverview.validateAccountNumber1(page);
         await accountsOverview.validateTotalAmount(page);
         await accountsOverview.validateAccountNumber2(page);
         await accountsOverview.validateMinimumAmount(page);
         await accountsOverview.validateBalance(page);
      });

      await test.step('Transfer funds from newly created account to original account', async () => {
         await transferFunds.goToTranferFundsPage(page);
         await transferFunds.transferAmount(page);
         await transferFunds.selectAccount(page);
         await transferFunds.transferSuccess(page);
      });

      await test.step('Pay bill using the newly created account', async () => {
         await billPay.goToBillPayPage(page);
         await billPay.fillOutForm(page);
         await billPay.selectAccount(page);
         await billPay.sendPayment(page);
      });
   })


   test('Search the transactions by amount using API', async({request}) => {
      await findTransactions.findTransactionsByAmount(request);
   })