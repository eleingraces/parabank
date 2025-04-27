# Para Bank
Sample test automation for the Para Bank website
 
# 📝 Project Overview
This repository is for test automation (using Javascript) for the Para Bank demo website: (https://parabank.parasoft.com/).
 
# 🚀 Get Started
Clone the repository: https://github.com/eleingraces/parabank.git
 
📜 Install dependencies: 
  - npm init playwright@latest/npx playwright install
  - npm install --save-dev @faker-js/faker
 
Run End to End Test: **npx playwright test endToEnd.spec.js --ui**
 
# 📙 Test Coverage
End to End test that includes:
- Navigate to parabank website
- Do Registration ( username is unique for every test execution )
- Do Login using the created account
- Check all global navigation menu in homepage.
- Create New Savings account.
   - Validate Accounts overview after savings account creation.
   - Do Transfer fund using the created savings account to another account ( default account ).  
   - Pay bills using the created savings account.
- Validate Find Transactions by Amount API response.
