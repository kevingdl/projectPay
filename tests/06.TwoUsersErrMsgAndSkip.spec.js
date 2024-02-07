const { test, expect, chromium } = require('@playwright/test');
const { MyPOM } = require('../page_model/pom');

test.describe.configure({ mode: 'serial' });

let AccountNum = '';

/** @type {import('@playwright/test').Page} */
let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  const UsePOM = new MyPOM(page);
  await UsePOM.OpenTheEnvrionment();
  await UsePOM.LoginPMX2();

});

test.afterAll(async () => {
  const UsePOM = new MyPOM(page);
  await UsePOM.LogoutPMX();
  await page.close();
});

test('User1 Login', async () => {
  const UsePOM = new MyPOM(page);
  //await page.pause();
  const [responseClientField] = await Promise.all([
    page.waitForResponse(responseClientField => responseClientField.url().endsWith('/services/client/list') && responseClientField.status() === 200)
  ]);
  
  await UsePOM.SearchClientList();
  
  const [responseClient] = await Promise.all([
    page.waitForResponse(responseClient => responseClient.url().includes('/services/transaction/metrics/Today?history') && responseClient.status() === 200),
    await page.keyboard.press('Enter'),
  ]);
  const [responsePending] = await Promise.all([
    page.waitForResponse(responsePending => responsePending.url().includes('/services/transaction/list/status/PENDING') && responsePending.status() === 200),
    await UsePOM.FilterShow.selectOption({label: 'PENDING'}),
  ]);
  
  await page.waitForTimeout(2000);
    
  await UsePOM.TranTable1stRowAssignIcon.waitFor({state: "visible"});
  
  const [responseAssignIcon] = await Promise.all([
    page.waitForResponse(responseAssignIcon => responseAssignIcon.url().includes('/services/group?clientPk') && responseAssignIcon.status() === 200),
    await UsePOM.TranTable1stRowAssignIcon.click(),
  ]);
});

test('User2 Login - Error Messages for Assign, Reject and Details', async ({browser}) => {
  const context  = await browser.newContext();
  const page2 = await context.newPage();
  const UsePOM = new MyPOM(page2);
  await UsePOM.OpenTheEnvrionment();
  await UsePOM.LoginPMX();

  const [responseClientField] = await Promise.all([
    page2.waitForResponse(responseClientField => responseClientField.url().endsWith('/services/client/list') && responseClientField.status() === 200)
  ]);
  
  await UsePOM.SearchClientList();
  
  const [responseClient] = await Promise.all([
    page2.waitForResponse(responseClient => responseClient.url().includes('/services/transaction/metrics/Today?history') && responseClient.status() === 200),
    await page2.keyboard.press('Enter'),
  ]);

  const [responsePending] = await Promise.all([
    page2.waitForResponse(responsePending => responsePending.url().includes('/services/transaction/list/status/PENDING') && responsePending.status() === 200),
    await UsePOM.FilterShow.selectOption({label: 'PENDING'}),
  ]);
    
  await UsePOM.TranTable1stRowAssignIcon.waitFor({state: "visible"});

  const [responseAssignIcon] = await Promise.all([
    page2.waitForResponse(responseAssignIcon => responseAssignIcon.url().includes('/services/transaction/lock/') && responseAssignIcon.status() === 200),
    await UsePOM.TranTable1stRowAssignIcon.click(),
  ]);

  expect(await page2.locator('.modal-content').innerText()).toMatch('Payment Temporarily Locked\nThis payment is under review by another user. Please choose a different payment to review or try again in 10 minutes.\nOK');
  await page2.getByText('OK',{ exact: true }).click();

  const [responseRejectIcon] = await Promise.all([
    page2.waitForResponse(responseRejectIcon => responseRejectIcon.url().includes('/services/group?clientPk') && responseRejectIcon.status() === 200),
    await UsePOM.TranTable1stRowRejectIcon.click(),
  ]);

  expect(await page2.locator('.modal-content').innerText()).toMatch('Payment Temporarily Locked\nThis payment is under review by another user. Please choose a different payment to review or try again in 10 minutes.\nOK');
  await page2.getByText('OK',{ exact: true }).click();

  const [responseDetails] = await Promise.all([
    page2.waitForResponse(responseDetails => responseDetails.url().includes('/services/transaction/') && responseDetails.status() === 200),
    await UsePOM.TranTable1stRowDetailsIcon.click(),
  ]);

  expect(await page2.locator('.modal-content').innerText()).toMatch('Payment Temporarily Locked\nThis payment is under review by another user. Please choose a different payment to review or try again in 10 minutes.\nOK');
  await page2.getByText('OK',{ exact: true }).click();


  await UsePOM.LogoutPMX();
  await context.close();

});

test('User1 Skip', async () => {
  const UsePOM = new MyPOM(page);
  AccountNum = await UsePOM.TranTable1stRowAccNumber.innerText();
  
  await UsePOM.RecSkipBtn.click();

  expect(await page.locator('#gridrecord').nth(1).locator('td').nth(0).innerText()).not.toMatch(AccountNum);

  const [responseCrossIcon] = await Promise.all([
    page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/PENDING?') && responseCrossIcon.status() === 200),
    await UsePOM.RecCrossIcon.nth(0).click(),
  ]);
  
  await page.waitForTimeout(1000);

});