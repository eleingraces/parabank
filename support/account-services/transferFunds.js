import { expect } from '@playwright/test';

import fs from 'fs/promises'; 
import path from 'path';
const filePath = path.resolve(__dirname, '../../fixtures/data.json');

class transferFundsPage {

   async goToTranferFundsPage(page){
      await page.locator('a[href= "transfer.htm"]').click();
   }

   async transferAmount(page){
      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const minimumAmt = parseFloat(parsedData.minimum_amount.replace('$', ''));

         // transfer amount
         let transfer = minimumAmt - 10;
         let transferAmount = transfer.toString();
         await expect(page.locator('#amount')).toBeVisible();
         await page.fill('#amount', transferAmount);

         const userData = {
            ...parsedData, 
            amount_transferred: transferAmount,
         };

         const jsonData = JSON.stringify(userData, null, 2);

         await fs.writeFile(filePath, jsonData);  // Use fs.promises.writeFile
         console.log('✅ Account Number details have been saved to fixtures/data.json');
         } catch (err) {
         console.error('❌ Error reading or writing to file:', err);
      }  
   }

   async selectAccount(page) {
      // dropdown element
      let fromAccount = page.locator('#fromAccountId');
      await expect(fromAccount).toBeVisible();

      // select newly created account from dropdown
      let transferredAccount = await fromAccount.locator('option').nth(1).getAttribute('value');
      await fromAccount.selectOption(transferredAccount);
      console.log('Account used for Transfer:', transferredAccount);
   }

   async transferSuccess(page) {
      //click transfer
      await page.locator('input[type="submit"][value="Transfer"]').click();

      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const accountNumber1 = parsedData.account_number1;
         const transferredAccount = parsedData.account_number2;
         const transferAmount = parsedData.amount_transferred;
     
         //validate if transfer has completed
         const transferComplete = page.locator('h1.title', { hasText: 'Transfer Complete!' });
         await expect(transferComplete).toBeVisible();
         await expect(transferComplete).toContainText('Transfer Complete!');

         //validate if transferred from second account
         let acctTransFrom = page.locator('#fromAccountIdResult');
         await expect(acctTransFrom).toContainText(transferredAccount);

         //validate if transferred to first account
         let acctTransTo = page.locator('#toAccountIdResult');
         await expect(acctTransTo).toContainText(accountNumber1);

         //validate if transferred the right amount
         let amountTransferred = page.locator('#amountResult')
         await expect(amountTransferred).toContainText('$' + transferAmount);

         } catch (err) {
            console.error('❌ Error reading JSON file or validating account number:', err);
      }
   }


 } 
 export { transferFundsPage };