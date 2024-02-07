const { test, expect, chromium } = require('@playwright/test');
const { MyPOM } = require('../page_model/pom');

test.describe.configure({ mode: 'serial' });

let AccountNum = '';
let ReturnReason = '';
let AGroup = '';
let AGroupSubstring = '';
let FindDash = 0;

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

test('PMX Processed > Returned_1', async () => {
  const UsePOM = new MyPOM(page);
  await page.pause();
  const [responseClientField] = await Promise.all([
    page.waitForResponse(responseClientField => responseClientField.url().endsWith('/services/client/list') && responseClientField.status() === 200)
  ]);
  
  await UsePOM.SearchClientList();
  
  const [responseClient] = await Promise.all([
    page.waitForResponse(responseClient => responseClient.url().includes('/services/transaction/metrics/Today?history') && responseClient.status() === 200),
    await page.keyboard.press('Enter'),
  ]);
    
  const [responsePosted] = await Promise.all([
    page.waitForResponse(responsePosted => responsePosted.url().includes('/services/transaction/history/status/ALL') && responsePosted.status() === 200),
    await UsePOM.NavMenuPosted.click(),
  ]);
  
  await UsePOM.TranTable1stRowDetailsIcon.waitFor({state: "visible"});
 
  const [responseAssignIcon] = await Promise.all([
    page.waitForResponse(responseAssignIcon => responseAssignIcon.url().includes('/services/transaction/history/status/PROCESSED?clientPk') && responseAssignIcon.status() === 200),
    await UsePOM.FilterShow.selectOption({label: 'PROCESSED'}),
  ]);
  await UsePOM.TranTable1stRowDetailsIcon.waitFor({state: "visible"});
  await page.locator('[ng-model="paging.currentPage"]').waitFor({state: "visible"});
  
  let LastPage = await page.locator('[ng-model="paging.currentPage"] >> li').count();
  
  const [responseLastPage] = await Promise.all([
    page.waitForResponse(responseLastPage => responseLastPage.url().includes('/services/transaction/history/status/PROCESSED?clientPk') && responseLastPage.status() === 200),
    await page.locator('[ng-model="paging.currentPage"] >> li').nth(LastPage-2).locator('a').click(),
  ]);
  
  const [responseReturn] = await Promise.all([
    page.waitForResponse(responseReturn => responseReturn.url().endsWith('/managePayments/partials/returnOptions.html') && responseReturn.status() === 200),
    await UsePOM.TranTable1stRowReturnIcon.click(),
  ]);

  AccountNum = await UsePOM.TranTable1stRowAccNumber.innerText();
  
  await UsePOM.RecReturnFundsBtn.waitFor({state: "visible"});
  await UsePOM.RecReturnDD.selectOption({label:'Multiple Errors'});

  await page.pause();

  const [responseReturned] = await Promise.all([
    page.waitForResponse(responseReturned => responseReturned.url().endsWith('/services/transaction/return') && responseReturned.status() === 200),
    await UsePOM.RecReturnFundsBtn.click(),
  ]);
});

test('PMX Returned_1 - Values Validation', async () => {
    const UsePOM = new MyPOM(page);
    const [responseReturn] = await Promise.all([
        page.waitForResponse(responseReturn => responseReturn.url().includes('/services/transaction/history/status/RETURNED?') && responseReturn.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'RETURNED'}),
      ]);
    
    await UsePOM.FilterSearchAcct.fill(AccountNum);
    
    const [responseSearchAccount] = await Promise.all([
        page.waitForResponse(responseSearchAccount => responseSearchAccount.url().includes('/services/transaction/history/status/RETURNED?') && responseSearchAccount.status() === 200),
        await page.keyboard.press('Enter')
      ]);
    
    
    const [responseDetails] = await Promise.all([
        page.waitForResponse(responseDetails => responseDetails.url().includes('/services/transaction/') && responseDetails.status() === 200),
        await UsePOM.TranTable1stRowDetailsIcon.click(),
      ]);
    await page.waitForTimeout(3000);
    await page.getByRole('button',{name:'n'}).nth(1).waitFor({state:'visible'});

    expect(page.getByText('Multiple Errors').locator('nth=1')).toBeVisible();
    
    const [responseCrossIcon] = await Promise.all([
        page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/history/status/RETURNED?') && responseCrossIcon.status() === 200),
        await page.getByRole('button',{name:'n', exact:true}).nth(1).click(),
      ]);
    
});

test('PMX Returned_1 > Update', async () => {
    const UsePOM = new MyPOM(page);
    const [responseUpdate] = await Promise.all([
        page.waitForResponse(responseUpdate => responseUpdate.url().endsWith('/managePayments/partials/updateOptions.html') && responseUpdate.status() === 200),
        await UsePOM.TranTable1stRowUpdateIcon.click(),
      ]);
    await UsePOM.RecReturnUpdateBtn.waitFor({state: "visible"});
    await UsePOM.RecReturnDD.selectOption({label:'Account frozen'});

});

test('PMX Returned_1 > Update - Values Validation', async () => {
    console.log('................Well known bug, after the update, details display old values')
});

test('PMX Returned_1 > Cancel Return', async () => {
    const UsePOM = new MyPOM(page);
    const [responseUpdate] = await Promise.all([
        page.waitForResponse(responseUpdate => responseUpdate.url().includes('/services/transaction') && responseUpdate.status() === 200),
        await UsePOM.TranTable1stRowUpdateIcon.click(),
      ]);
    await UsePOM.RecReturnCancelBtn.waitFor({state: "visible"});

    const [responseCancel] = await Promise.all([
        page.waitForResponse(responseCancel => responseCancel.url().endsWith('/services/transaction/cancelReturn') && responseCancel.status() === 200),
        await UsePOM.RecReturnCancelBtn.click(),
      ]);
});

test('PMX Returned_1 > Cancel Return - Validation', async () => {
    const UsePOM = new MyPOM(page); 
    const [responseProcessed] = await Promise.all([
        page.waitForResponse(responseProcessed => responseProcessed.url().includes('/services/transaction/history/status/PROCESSED?') && responseProcessed.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'PROCESSED'}),
    ]);
    
    await UsePOM.TranTable1stRowReturnIcon.waitFor({state: "visible"});
});
