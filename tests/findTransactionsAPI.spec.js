import { test } from '@playwright/test';

import { findTransactionsPage } from '../support/account-services/findTransactions';

const findTransactions = new findTransactionsPage();

test('find transactions by amount', async ({ request }) => {
      await findTransactions.findTransactionsByAmount(request);
});