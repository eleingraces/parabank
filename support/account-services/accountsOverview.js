import { expect } from '@playwright/test';

import fs from 'fs/promises'; 
import path from 'path';
const filePath = path.resolve(__dirname, '../../fixtures/data.json');

class accountsOverviewPage {

   async goToAccountsOverview(page){
      await page.locator('a[href="overview.htm"]').click();
   }

   async getAccountNumber1Details(page){
      const accountNumber1 = await page.locator('a[href^="activity.htm?id="]').innerText();
      console.log('Account Number 1:', accountNumber1);

      const totalAmount = await page.locator('b', { hasText: '$' }).innerText();
      console.log('Total Amount:', totalAmount);

      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const userData = {
            ...parsedData, 
            account_number1: accountNumber1,
            total_amount: totalAmount
         };
         const jsonData = JSON.stringify(userData, null, 2);

         await fs.writeFile(filePath, jsonData);  // Use fs.promises.writeFile
         console.log('✅ Account Number details have been saved to fixtures/data.json');
         } catch (err) {
         console.error('❌ Error reading or writing to file:', err);
      }  
   }

   async validateAccountNumber1(page) {
      
      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const accountNumber1 = parsedData.account_number1;

         await page.locator('a[href="overview.htm"]').click();
         await page.waitForSelector(`a[href^="activity.htm?id="]`);
         await expect(page.locator(`a[href^="activity.htm?id=${accountNumber1}"]`)).toHaveText(accountNumber1);
     
       } catch (err) {
         console.error('❌ Error reading JSON file or validating account number:', err);
       }  
   }

   async validateTotalAmount(page) {
      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const totalAmount = parsedData.total_amount;
     
         await expect(page.locator('b', { hasText: '$' })).toHaveText(totalAmount);
      } catch (err) {
         console.error('❌ Error reading JSON file or validating account number:', err);
      }
   }

   async validateAccountNumber2(page) {
      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const accountNumber2 = parsedData.account_number2;
     
         await page.locator('a[href="overview.htm"]').click();
         await expect(page.locator(`a[href^="activity.htm?id=${accountNumber2}"]`)).toHaveText(accountNumber2);
      } catch (err) {
         console.error('❌ Error reading JSON file or validating account number:', err);
      }
   }

   async validateMinimumAmount(page) {
      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const accountNumber2 = parsedData.account_number2;
         const minAmount = parsedData.minimum_amount;
     
         await expect(page.locator('tr', { has: page.locator(`a[href^="activity.htm?id=${accountNumber2}"]`) }).locator('td').nth(1)).toHaveText(minAmount);
      } catch (err) {
         console.error('❌ Error reading JSON file or validating account number:', err);
      }
   }

   async validateBalance(page) {
      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const totalAmount = parsedData.total_amount;
         const minAmount = parsedData.minimum_amount;
         const accountNumber1 = parsedData.account_number1;
     
         //to check the difference of 1st and 2nd account
         const totalAmt = parseFloat(totalAmount.replace('$', ''));
         const minimumAmt = parseFloat(minAmount.replace('$', ''));
         const diffAmount = '$' + (totalAmt - minimumAmt).toFixed(2);
         console.log('Amount Difference:', diffAmount);

         //to check that the difference amount is correct
         const amountLocator = page.locator('tr', { has: page.locator(`a[href^="activity.htm?id=${accountNumber1}"]`) }).locator('td').nth(1);
         const actualBal = await amountLocator.innerText(); 
         const expectedBal = diffAmount;

         console.log('Expected Balance of first account:', expectedBal);
         console.log('Actual Balance of first account:', actualBal);

         const diffAmountCorrect = actualBal === expectedBal;
         console.log('Is CORRECT:', diffAmountCorrect);
      } catch (err) {
         console.error('❌ Error reading JSON file or validating account number:', err);
      }
   }


 } 
 export { accountsOverviewPage };