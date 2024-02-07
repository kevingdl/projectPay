const { test, expect, chromium } = require('@playwright/test');
const { MyPOM } = require('../page_model/pom');

test.describe.configure({ mode: 'serial' });

/** @type {import('@playwright/test').Page} */
let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  const UsePOM = new MyPOM(page);
  await UsePOM.OpenTheEnvrionment();
  await UsePOM.LoginPMX();
});

test.afterAll(async () => {
  const UsePOM = new MyPOM(page);
  await UsePOM.LogoutPMX();
  await page.close();
});

test('Client - Default Payment Status: Assigned', async () => {
    const UsePOM = new MyPOM(page);
    await UsePOM.ClientListField.fill('City of LaGrange');
    await UsePOM.ClientListDisplay.waitFor();
    await page.keyboard.press('Enter');
    await UsePOM.ProfileMenu.click();
    await UsePOM.ProfileSettings.click();
    //const prueba = await page.locator('label:has-text("Default Payment Status") + div>>nth=1').textContent();
    //console.log(prueba);
    expect(await page.innerText('label:has-text("Default Payment Status") + div>>nth=1')).toMatch('Assigned')
    //expect(page.locator('label:has-text("Default Payment Status") + div')).
    //expect(await page.innerText('.labelLogin>>nth=1')).toMatch("Password")
});
test('Client - Default Payment Status: Assigned > Add Group > Error', async () => {
  const UsePOM = new MyPOM(page);
  await UsePOM.TabGroups.click();
  await UsePOM.TabGroupAddNewButton.click();
  expect(await page.innerText('.modal-content')).toMatch('Unable to Add Group\nClient Default Payment Status is set to Assigned.\nOK');
  await page.getByRole('button',{name:'OK'}).click();

});
test('Client - Default Payment Status: Pending', async () => {
  const UsePOM = new MyPOM(page);
  //await UsePOM.ClientListField.fill(process.env.CLIENT_NAME);
  //await UsePOM.ClientListDisplay.waitFor();
  //await page.keyboard.press('Enter');
  await UsePOM.SearchClientList();
  const [responseSearchAccount] = await Promise.all([
    page.waitForResponse(responseSearchAccount => responseSearchAccount.url().includes('/services/contact') && responseSearchAccount.status() === 200),
    await page.keyboard.press('Enter')
  ]);

  await UsePOM.ProfileSettings.click();
  expect(await page.innerText('label:has-text("Default Payment Status") + div>>nth=1')).toMatch('Pending')
});
test('Client - Default Payment Status: Pending > Navigation Tab', async () => {
  expect(page.locator('.nav.nav-tabs')).toHaveText('\n\n\n   CONTACTS\n\n\n   USERS\n\n\n   BILLERS\n\n\n   GROUPS\n\n\n   HISTORY\n\n\n   FILE UPLOAD\n\n');
});
test('Client - Default Payment Status: Pending > Group Table Headers', async () => {
  const UsePOM = new MyPOM(page);
  await UsePOM.TabGroups.click();
  await page.locator('.list-header .row>>nth=3').waitFor();
  expect(page.locator('.list-header .row>>nth=3')).toHaveText('Group ID\nGroup Name\nDeposit Routing #\nDeposit Account #\nDeposit Directly\nAccount Type\nTask');
  await page.waitForTimeout(1000);
});
test('Client - Default Payment Status: Pending > Add Group > Group ID Empty', async () => {
  const UsePOM = new MyPOM(page);
  //await page.pause();
  await UsePOM.TabGroupAddNewButton.waitFor();
  await UsePOM.TabGroupAddNewButton.click();
  await page.locator('#groupId>>nth=0').fill('1919');
  //await page.locator('#groupId>>nth=0').focus();
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');
  await page.keyboard.press('Tab');
  await expect(page.locator('#groupId>>nth=0')).toHaveAttribute('class',/.*ng-empty.*/);
  await page.locator('#groupId>>nth=0').fill('1919');  
});
test('Client - Default Payment Status: Pending > Add Group > Group Name Empty', async () => {
  //const UsePOM = new MyPOM(page);
  await page.locator('#groupName>>nth=0').fill('delete me');  
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');
  await page.keyboard.press('Tab');
  await expect(page.locator('#groupName>>nth=0')).toHaveAttribute('class',/.*ng-empty.*/);
  await page.locator('#groupName>>nth=0').fill('delete me');
});
test('Client - Default Payment Status: Pending > Add Group > Deposit Routing Invalid', async () => {
  //const UsePOM = new MyPOM(page);
  await page.locator('#routingNumber>>nth=1').fill('123');
  await page.locator('a').filter({ hasText: 'SAVE' }).click();
  await expect(page.locator('#routingNumber').nth(1)).toHaveAttribute('class',/.*ng-invalid.*/);
  await expect(page.getByText('Invalid Routing Number').first()).toBeVisible();
});
test('Client - Default Payment Status: Pending > Add Group > Deposit Routing Empty', async () => {
  await page.locator('#routingNumber').nth(1).focus();
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');
  await page.keyboard.press('Tab');
  await expect(page.locator('#routingNumber').nth(1)).toHaveAttribute('class',/.*ng-empty.*/);
  await expect(page.getByText('Required').first()).toBeVisible();
  await page.locator('#routingNumber>>nth=1').fill('011000028');
});
test('Client - Default Payment Status: Pending > Add Group > Cancel', async () => {
  //await page.pause();
  await page.locator('a').filter({ hasText: 'CANCEL' }).waitFor();
  await page.locator('a').filter({ hasText: 'CANCEL' }).click();
  await expect(page.locator('a').filter({ hasText: 'CANCEL' })).not.toBeVisible();
  await page.waitForTimeout(1000);
});

test('Client - Default Payment Status: Pending > Add Group > Save Empty', async () => {
  const UsePOM = new MyPOM(page);
  await UsePOM.TabGroupAddNewButton.waitFor();
  await UsePOM.TabGroupAddNewButton.click();
  await page.locator('a').filter({ hasText: 'SAVE' }).waitFor();
  //await page.pause();
  await page.locator('a').filter({ hasText: 'SAVE' }).click();
  expect(await page.innerText('[name="form0"] > div>>nth=0')).toMatch('Required\nRequired\nRequired\nRequired');
});
test('Client - Default Payment Status: Pending > Add Group > Deposit Directly values', async () => {
  expect (await page.innerText('#directDeposit>>nth=1')).toMatch('YesNo');
  expect(page.locator('#directDeposit>>nth=1')).toHaveText('YesNo');
});
test('Client - Default Payment Status: Pending > Add Group > Account Type values', async () => {
  expect (await page.innerText('#accountType>>nth=1')).toMatch('Choose One\nChecking\nSavings\nLedger\nLoan');
  expect(page.locator('#accountType>>nth=1')).toHaveText('Choose OneCheckingSavingsLedgerLoan');
});
test('Client - Default Payment Status: Pending > Add Group > Create', async () => {
  await page.locator('#groupId>>nth=0').fill('1919');
  await page.locator('#groupName>>nth=0').fill('delete me');
  await page.locator('#routingNumber>>nth=1').fill('011000028');
  await page.locator('#accountNumber>>nth=1').fill('123');
  //await page.locator('#accountType').nth(1).click();
  await page.locator('#accountType').nth(1).selectOption({label: 'Savings'});
  await page.locator('a').filter({ hasText: 'SAVE' }).waitFor();
  await page.waitForTimeout(1000);
  await page.locator('a').filter({ hasText: 'SAVE' }).click();
});
test('Client - Default Payment Status: Pending > Add Group > Created & Delete > Cancel', async () => {
  //await page.pause();
  await page.getByText('1919').waitFor();
  await page.locator('a').filter({ hasText: 'DELETE' }).nth(0).click();
  expect(await page.innerText('.modal-content')).toMatch('You Are About to Delete a Group\nAre you sure you want to delete this Group?\nYes Cancel');
  await page.getByRole('button',{name:'Cancel'}).click();
});

test('Client - Default Payment Status: Pending > Add Group > Created & Delete > Yes', async () => {
  await page.locator('a').filter({ hasText: 'DELETE' }).nth(0).click();
  await page.locator('a').filter({ hasText: 'DELETE' }).nth(0).click();
  await page.getByRole('button',{name:'Yes'}).click();
});
