import { test } from '@playwright/test';
import { SearchPage } from '../../src/pages/SearchPage';
import searchData from '../testData/search.json';

test('Search for "locator" shows relevant results', async ({ page }) => {
  const searchPage = new SearchPage(page);
  await searchPage.goto();
  await searchPage.searchFor('locator');
  await searchPage.assertResultsContain('locator');
});
for (const term of searchData.validTerms) {
  test(`Search for "${term}" returns results`, async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await searchPage.searchFor(term);
    await searchPage.assertResultsContain(term);
  });
}

for (const term of searchData.invalidTerms) {
  test(`Search for "${term}" shows no results`, async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await searchPage.searchFor(term);
    await searchPage.assertNoResults(); // You’ll define this in SearchPage
  });
}
