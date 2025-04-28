import { faker } from '@faker-js/faker';
import fs from 'fs/promises'; 
import path from 'path';
const filePath = path.resolve(__dirname, '../../fixtures/data.json');

class registerUserPage {
  constructor() {
    this.firstName = faker.person.firstName();
    this.password = faker.internet.password();
    this.username = `${this.firstName.toLowerCase()}${faker.string.alphanumeric(6)}`;
  }

  async goToRegistrationPage(page){
    await page.locator('a[href="register.htm"]').click();
  }

  async register(page) {
    let maxAttempts = 10;
    let attempts = 0;
    let registered = false;
    let username = this.username;
    let firstName = this.firstName;
    let password = this.password;

    while (!registered && attempts < maxAttempts) {
      attempts++;
      username = `${firstName.toLowerCase()}${faker.string.alphanumeric(6)}`;

      await page.fill('input[name="customer.firstName"]', firstName);
      await page.fill('input[name="customer.lastName"]', faker.person.lastName());
      await page.fill('input[name="customer.address.street"]', faker.location.streetAddress());
      await page.fill('input[name="customer.address.city"]', faker.location.city());
      await page.fill('input[name="customer.address.state"]', faker.location.state());
      await page.fill('input[name="customer.address.zipCode"]', faker.location.zipCode());
      await page.fill('input[name="customer.phoneNumber"]', faker.phone.number());
      await page.fill('input[name="customer.ssn"]', faker.string.numeric(9));
      await page.fill('input[name="customer.username"]', username);
      await page.fill('input[name="customer.password"]', password);
      await page.fill('#repeatedPassword', password);

      await Promise.all([
        page.waitForTimeout(5000),
        page.click('input[type="submit"][value="Register"]'),
      ]);

      const errorVisible = await page.locator('text=This username already exists.').isVisible();

      if (errorVisible) {
        console.log(`❌ Attempt ${attempts}: Username already exists → ${username}`);
      } else {
        console.log(`✅ Registered with username: ${username}`);
        registered = true;
      }
      
      
      try {
        const data = await fs.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(data);
 
        const updatedData = {
          ...parsedData, 
          username: username, 
          password: password, 
        };
    
        const jsonData = JSON.stringify(updatedData, null, 2);
    
        await fs.writeFile(filePath, jsonData);
        console.log('✅ User data has been saved to fixtures/data.json');
      } catch (err) {
        console.error('❌ Error reading or writing to file:', err);
      }
    }

    if (!registered) throw new Error('Failed to register after multiple attempts');
    return { username, password, firstName };
  }
 } 
 export { registerUserPage };