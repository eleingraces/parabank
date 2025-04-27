import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import fs from 'fs/promises'; 
import path from 'path';

const filePath = path.resolve(__dirname, '../../fixtures/data.json');

class billPayPage {

   async goToBillPayPage(page){
      await page.locator('a[href="billpay.htm"]').click();
   }

   async fillOutForm(page) {
      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const minimumAmt = parseFloat(parsedData.minimum_amount.replace('$', ''));
         const transferAmount = parsedData.amount_transferred;
         const billAmount = (minimumAmt - transferAmount).toString();
         const payAccountNum = faker.string.numeric(5);
   
         await page.fill('input[name="payee.name"]', faker.person.firstName());
         await page.fill('input[name="payee.address.street"]', faker.location.street())
         await page.fill('input[name="payee.address.city"]', faker.location.city());
         await page.fill('input[name="payee.address.state"]', faker.location.state());
         await page.fill('input[name="payee.address.zipCode"]', faker.location.zipCode());
         await page.fill('input[name="payee.phoneNumber"]', faker.phone.number());
         await page.fill('input[name="payee.accountNumber"]', payAccountNum);
         await page.fill('input[name="verifyAccount"]', payAccountNum);
         await page.fill('input[name="amount"]', billAmount);


         const userData = {
            ...parsedData, 
            amount_billed: '$' + billAmount,
         };

         const jsonData = JSON.stringify(userData, null, 2);

         await fs.writeFile(filePath, jsonData);  // Use fs.promises.writeFile
         console.log('✅ Account Number details have been saved to fixtures/data.json');
         } catch (err) {
         console.error('❌ Error reading or writing to file:', err);
      }  
   }

   async selectAccount(page) {
      let billFromAccount = page.locator('select[name="fromAccountId"]');
      await expect(billFromAccount).toBeVisible();
 
      let newAcc = await billFromAccount.locator('option').nth(0).getAttribute('value');
      await billFromAccount.selectOption(newAcc);
      console.log('Account Billed:', newAcc);
   }

   async sendPayment(page) {
      await expect(page.locator('input[value="Send Payment"]')).toBeVisible();
      await page.locator('input[value="Send Payment"]').click();

      //assertion if bill payment is successful
      const paymentComplete = page.locator('h1.title', { hasText: 'Bill Payment Complete' });
      await expect(paymentComplete).toBeVisible();
      await expect(paymentComplete).toContainText('Bill Payment Complete');

      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const billAmount = parsedData.amount_billed;
         const newAcc = parsedData.account_number2;

         //assertion if right amount is paid
         let paidAmount = page.locator('#amount');
         await expect(paidAmount).toContainText(billAmount)

         //assertion if paid from account number 2
         let acctPaidFrom = page.locator('#fromAccountId');
         await expect(acctPaidFrom).toContainText(newAcc);
         } catch (err) {
         console.error('❌ Error reading JSON file or validating account number:', err);
      }       
   }

 } 
 export { billPayPage };