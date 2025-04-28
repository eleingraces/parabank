import { expect } from '@playwright/test';
import fs from 'fs/promises'; 
import path from 'path';
const filePath = path.resolve(__dirname, '../../fixtures/data.json');

class findTransactionsPage {
   async findTransactionsByAmount(request){
      try {
         const data = await fs.readFile(filePath, 'utf8');
         const parsedData = JSON.parse(data);
         const username = parsedData.username;
         const password = parsedData.password;
         const transferredAccount = parsedData.account_number2;  
         const transfer = parseFloat(parsedData.amount_transferred.replace('$', ''));
   
         const loginRes = await request.post('/parabank/login.htm', {
            form: {
               username,
               password,
            }
         });
   
         const apiresponse = await request.get(
            `/parabank/services_proxy/bank/accounts/${transferredAccount}/transactions/amount/${transfer}?timeout=30000`
          );
      
         // Parse response once
         const responseBody = await apiresponse.json();
      
         // Log the actual response data for debugging
         console.log(await apiresponse.text());
         console.log(responseBody);            
      
         expect(apiresponse.ok()).toBeTruthy();
         expect(apiresponse.status()).toBe(200);
      
         expect(Array.isArray(responseBody)).toBeTruthy();
         expect(responseBody.length).toBeGreaterThan(0);
      
         const firstTransaction = responseBody[0];
      
         expect(firstTransaction).toHaveProperty('accountId', Number(transferredAccount));
         expect(firstTransaction).toHaveProperty('type', 'Debit');
         expect(firstTransaction).toHaveProperty('amount', transfer);
   
         } catch (err) {
         console.error('❌ Error reading JSON file or validating account number:', err);
       }  
   }


 } 
 export { findTransactionsPage };