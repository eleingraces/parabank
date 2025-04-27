import { expect } from '@playwright/test';
import fs from 'fs/promises'; 
import path from 'path';
const filePath = path.resolve(__dirname, '../../fixtures/data.json');

class openNewAccPage {

   async goToOpenNewAccPage(page){
      await page.locator('a[href="openaccount.htm"]').click();
   }

   async selectTypeOfAccount(page) {
      await page.locator('select[id="type"][class="input"]').click()
      await page.selectOption('#type', '1');

      const selected = await page.$eval('#type', el => el.value);
      console.log('Currently selected value:', selected);
   }

   async selectAccount(page) {
      //get minimum value
      const text = await page.locator('#openAccountForm form p b').nth(1).innerText();
      console.log('Open Account text:', text);

      const arrAmount = text.match(/\$.*?\.00/);
      const minAmount = arrAmount[0];
      console.log('Minimum Amount:', minAmount);

      //account number original
      await page.locator('select[id="fromAccountId"][class="input"]').click();

      const options = await page.locator('#fromAccountId > option').allTextContents();
      console.log('Available options:', options);

      await page.selectOption('select[id="fromAccountId"]', { label: options[0] });

      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);

         const userData = {
            ...parsedData, 
            minimum_amount: minAmount
         };
         const jsonData = JSON.stringify(userData, null, 2);
         await fs.writeFile(filePath, jsonData);  // Use fs.promises.writeFile
         console.log('✅ Minimum Amount details have been saved to fixtures/data.json');
         } catch (err) {
         console.error('❌ Error reading or writing to file:', err);
      }  
   }

   async openNewAccountSubmit(page) {
      //click open new account button
      await expect(page.locator('input.button[value="Open New Account"]')).toBeVisible();
      await page.waitForSelector('input.button[value="Open New Account"]');
      await page.locator('input.button[value="Open New Account"]').click();
   }

   async validation(page) {
      const accountOpened = page.locator('h1.title', { hasText: 'Account Opened!' });
      await expect(accountOpened).toBeVisible();
      await expect(accountOpened).toContainText('Account Opened');
      await page.waitForSelector('#newAccountId');

      const accountNumber2 = await page.locator('#newAccountId').innerText();
      console.log('Account Number2:', accountNumber2);

      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);

         const userData = {
            ...parsedData, 
            account_number2: accountNumber2,
         };
         const jsonData = JSON.stringify(userData, null, 2);
         await fs.writeFile(filePath, jsonData);  // Use fs.promises.writeFile
         console.log('✅ Account Number details have been saved to fixtures/data.json');
         } catch (err) {
         console.error('❌ Error reading or writing to file:', err);
      }  
   }

   async openNewAccSteps(page) {
      await this.goToOpenNewAccPage(page);
      await this.selectAccount(page);
      await this.openNewAccountSubmit(page);
      await this.validation(page);
   }

 } 
 export { openNewAccPage };