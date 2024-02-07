const { test, expect, chromium } = require('@playwright/test');
const { MyPOM } = require('../page_model/pom');

test.describe.configure({ mode: 'serial' });

let AccountNum = '';
let AAccount = '';
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

test('PMX Payments with Deposit Directly set to No: Pending > Assign_1', async () => {
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
    page.waitForResponse(responsePending => responsePending.url().includes('/services/transaction/list/status/PENDING?') && responsePending.status() === 200),
    await UsePOM.FilterShow.selectOption({label: 'PENDING'}),
  ]);
  
  await page.waitForTimeout(1000);
    
  await UsePOM.TranTable1stRowAssignIcon.waitFor({state: "visible"});
  
  const [responseAssignIcon] = await Promise.all([
    page.waitForResponse(responseAssignIcon => responseAssignIcon.url().includes('/services/group?clientPk') && responseAssignIcon.status() === 200),
    //https://www.tabnine.com/code/javascript/functions/puppeteer/Response/url
    await UsePOM.TranTable1stRowAssignIcon.click(),
  ]);
  
  //await UsePOM.TranTable1stRowAssignIcon.click();
  //await page.waitForResponse(/services\/transaction/);  
  await UsePOM.RecAssignBtn.nth(1).waitFor({state: "visible"});
  await UsePOM.RecCopyBtn.waitFor({state: "visible"});
  
  //await page.waitForTimeout(1000);
  
  await UsePOM.RecCopyBtn.click();
  
  AccountNum = await UsePOM.TranTable1stRowAccNumber.innerText();
  
  AAccount = await UsePOM.RecAssignedAccount.inputValue();
  
  expect(AccountNum).toMatch(AAccount);
  
  await UsePOM.RecGroupDD.selectOption({index: 2});

  AGroup = await UsePOM.RecGroupDD.locator('option').nth(2).textContent();
  
  const [responseAssignBtn] = await Promise.all([
    page.waitForResponse(responseAssignBtn => responseAssignBtn.url().endsWith('/services/transaction/assign') && responseAssignBtn.status() === 200),
    await UsePOM.RecAssignBtn.nth(1).click(),
  ]);
  
  //await UsePOM.RecAssignBtn.click();
  //await page.waitForRequest(/transaction/);
  //await page.waitForTimeout(3000);
  //await UsePOM.RecCrossIcon.click();
  //await page.waitForResponse(/PENDING/);

  await UsePOM.RecCrossIcon.nth(0).waitFor({state: "visible"});

  const [responseCrossIcon] = await Promise.all([
    page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/PENDING?clientPk') && responseCrossIcon.status() === 200),
    await UsePOM.RecCrossIcon.nth(0).click(),
  ]);

});

test('PMX Payments with Deposit Directly set to No: Pending > Assign_1 - Values Validation', async () => {
    const UsePOM = new MyPOM(page);
    const [responseAssigned] = await Promise.all([
        page.waitForResponse(responseAssigned => responseAssigned.url().includes('/services/transaction/list/status/ASSIGNED?') && responseAssigned.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'ASSIGNED'}),
      ]);
    
    await UsePOM.FilterSearchAcct.fill(AccountNum);
    
    const [responseSearchAccount] = await Promise.all([
        page.waitForResponse(responseSearchAccount => responseSearchAccount.url().includes('/services/transaction/list/status/ASSIGNED?') && responseSearchAccount.status() === 200),
        await page.keyboard.press('Enter')
      ]);

    const [responseDetails] = await Promise.all([
        page.waitForResponse(responseDetails => responseDetails.url().includes('/services/transaction/') && responseDetails.status() === 200),
        await UsePOM.TranTable1stRowDetailsIcon.click(),
      ]);

    //through locator.first(), locator.last(), and locator.nth(). These methods are not recommended because when your page changes, 
    //Playwright may click on an element you did not intend. Instead, follow best practices above to create a locator that uniquely
    //identifies the target element.
    
    expect(await page.getByTitle(AAccount).nth(1).innerText()).toMatch(AccountNum);

    FindDash = AGroup.indexOf(' -')
    AGroupSubstring = AGroup.substring(0,FindDash)

    expect(await page.getByText(AGroupSubstring).nth(0).innerText()).toMatch(AGroupSubstring);
});

test('PMX Payments with Deposit Directly set to No: Assign_1 > Update', async () => {
    await page.pause();
    const UsePOM = new MyPOM(page);
    const [responseUpdate] = await Promise.all([
        page.waitForResponse(responseUpdate => responseUpdate.url().includes('/services/group?clientPk') && responseUpdate.status() === 200),
        await UsePOM.TranTable1stRowUpdateIcon.click(),
      ]);
    
    
    await UsePOM.RecAssignBtn.waitFor({state:'visible'});
    await UsePOM.RecAssignedAccount.fill(AAccount+'abc');
    //await UsePOM.RecAssignedAccount.fill('123456');
    await UsePOM.RecGroupDD.selectOption({index: 3});
    
    AGroup = await UsePOM.RecGroupDD.locator('option').nth(3).textContent();

    await UsePOM.RecAlwaysUseDD.nth(1).selectOption({label:'No'});

    const [responseAssign] = await Promise.all([
        page.waitForResponse(responseAssign => responseAssign.url().includes('/services/transaction/list/status/ASSIGNED?clientPk') && responseAssign.status() === 200),
        await UsePOM.RecAssignBtn.click()
      ]);
});

test('PMX Payments with Deposit Directly set to No: Assign_1 > Update - Values Validation', async () => {
    const UsePOM = new MyPOM(page);
    await page.pause();
    await page.waitForTimeout(3000);
    const [responseDetails] = await Promise.all([
        page.waitForResponse(responseDetails => responseDetails.url().includes('/services/transaction/') && responseDetails.status() === 200),
        await page.getByRole('button',{name: 'v Details'}).click(),
      ]);

    await page.getByRole('button',{name:'PRINT'}).waitFor({state:'visible'});

    expect(await page.getByTitle(AAccount+'abc').innerText()).toMatch(AAccount+'abc');

    FindDash = AGroup.indexOf(' -')
    AGroupSubstring = AGroup.substring(0,FindDash)

    expect(await page.getByText(AGroupSubstring).nth(0).innerText()).toMatch(AGroupSubstring);

    const [responseCrossIcon] = await Promise.all([
        page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/ASSIGNED?clientPk') && responseCrossIcon.status() === 200),
        await page.getByRole('button',{name:'n'}).nth(1).click(),
      ]);
});

test('PMX Payments with Deposit Directly set to No: Assig_1 > Update - Required Fields Validation', async () => {
    const UsePOM = new MyPOM(page);
    const [responseUpdate] = await Promise.all([
        page.waitForResponse(responseUpdate => responseUpdate.url().includes('/services/group?clientPk') && responseUpdate.status() === 200),
        await UsePOM.TranTable1stRowUpdateIcon.click(),
      ]);

    await UsePOM.RecAssignBtn.waitFor({state:'visible'});
    
    await UsePOM.RecGroupDD.selectOption({index: 0});
    await UsePOM.RecAssignBtn.click()
    expect(await page.locator('.gridErrorMsg>>nth=1').innerText()).toMatch('Required')
    await UsePOM.RecGroupDD.selectOption({index: 2});

    await UsePOM.RecAssignedAccount.fill('');
    expect(await page.locator('.gridErrorMsg>>nth=0').innerText()).toMatch('Required')
    
    await UsePOM.RecCrossIcon.nth(1).waitFor({state: "visible"});
    const [responseCrossIcon] = await Promise.all([
        page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/ASSIGNED?') && responseCrossIcon.status() === 200),
        await UsePOM.RecCrossIcon.nth(1).click(),
    ]);
});

test('PMX Payments with Deposit Directly set to No: Pending > Reject_1', async () => {
    const UsePOM = new MyPOM(page);
    await page.pause();
    await UsePOM.FilterSearchAcct.fill('');
    const [responseClient] = await Promise.all([
        page.waitForResponse(responseClient => responseClient.url().includes('/services/transaction/list/status/ASSIGNED?') && responseClient.status() === 200),
        await page.keyboard.press('Enter'),
    ]);
    
    const [responsePending] = await Promise.all([
        page.waitForResponse(responsePending => responsePending.url().includes('/services/transaction/list/status/PENDING?') && responsePending.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'PENDING'}),
    ]);
    
    await page.waitForTimeout(1000);
    await UsePOM.TranTable1stRowRejectIcon.waitFor({state: "visible"});
      
    const [responseRejectIcon] = await Promise.all([
        page.waitForResponse(responseRejectIcon => responseRejectIcon.url().includes('/services/group?clientPk') && responseRejectIcon.status() === 200),
        await UsePOM.TranTable1stRowRejectIcon.click(),
    ]);
    
    AccountNum = await UsePOM.TranTable1stRowAccNumber.innerText();
    
    await UsePOM.RecRejectReasonDD.selectOption({label:'Amount field error'});
    await UsePOM.RecRejectAlwaysDD.selectOption({label:'Yes'});

    const [responseSubmitReject] = await Promise.all([
        page.waitForResponse(responseSubmitReject => responseSubmitReject.url().endsWith('/services/transaction/reject') && responseSubmitReject.status() === 200),
        await UsePOM.RecSubmitBtn.click(),
    ]);
    
    await UsePOM.RecCrossIcon.nth(0).waitFor({state: "visible"});
    
    const [responseCrossIcon] = await Promise.all([
        page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/PENDING?') && responseCrossIcon.status() === 200),
        await UsePOM.RecCrossIcon.nth(0).click(),
    ]);

});

test('PMX Payments with Deposit Directly set to No: Reject_1 > Values Validation', async () => {
    const UsePOM = new MyPOM(page);
    const [responseRejected] = await Promise.all([
        page.waitForResponse(responseRejected => responseRejected.url().includes('/services/transaction/list/status/REJECTED?') && responseRejected.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'REJECTED'}),
    ]);
    
    await UsePOM.FilterSearchAcct.fill(AccountNum);
    const [responseSearchAccount] = await Promise.all([
        page.waitForResponse(responseSearchAccount => responseSearchAccount.url().includes('/services/transaction/list/status/REJECTED?') && responseSearchAccount.status() === 200),
        await page.keyboard.press('Enter')
    ]);
    await page.waitForTimeout(1000);
    await UsePOM.TranTable1stRowDetailsIcon.waitFor({state: "visible"});
    const [responseDetails] = await Promise.all([
        page.waitForResponse(responseDetails => responseDetails.url().includes('/services/transaction/') && responseDetails.status() === 200),
        await page.getByRole('button',{name: 'v Details'}).click(),
      ]);

    await page.getByRole('button',{name:'PRINT'}).waitFor({state:'visible'});

    //expect(await page.getByTitle(AccountNum).innerText()).toMatch(AccountNum+'123');
    expect(page.getByTitle(AccountNum,{exact:true})).toBeVisible();
    expect(page.getByText('Amount field error',{exact:true}).nth(1)).toBeVisible();
    
    await UsePOM.RecCrossIcon.nth(1).waitFor({state: "visible"});
    const [responseCrossIcon] = await Promise.all([
        page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/REJECTED?clientPk') && responseCrossIcon.status() === 200),
        await UsePOM.RecCrossIcon.nth(1).click(),
    ]);
    
    //await UsePOM.RecCrossIcon.nth(1).click();
});

test('PMX Payments with Deposit Directly set to No: Reject_1 > Update', async () => {
    const UsePOM = new MyPOM(page);
    const [responseUpdate] = await Promise.all([
        page.waitForResponse(responseUpdate => responseUpdate.url().includes('/services/group?clientPk') && responseUpdate.status() === 200),
        await UsePOM.TranTable1stRowUpdateIcon.click(),
      ]);
    await UsePOM.RecSubmitRejectionBtn.waitFor({state:'visible'});
    await UsePOM.RecRejectReasonDD.selectOption({label:'No account'});
    await UsePOM.RecRejectAlwaysDD.selectOption({label:'No'});
    
    const [responseRejected] = await Promise.all([
        page.waitForResponse(responseRejected => responseRejected.url().endsWith('/services/transaction/reject') && responseRejected.status() === 200),
        await UsePOM.RecSubmitRejectionBtn.click(),
    ]);
    await UsePOM.RecCrossIcon.nth(1).waitFor({state: "visible"});
    
    const [responseCrossIcon] = await Promise.all([
        page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/REJECTED?clientPk') && responseCrossIcon.status() === 200),
        await UsePOM.RecCrossIcon.nth(1).click(),
    ]);
    
    //await UsePOM.RecCrossIcon.nth(1).click();
});

test('PMX Payments with Deposit Directly set to No: Reject_1 > Update - Values Validation', async () => {
    const UsePOM = new MyPOM(page);
    const [responseDetails] = await Promise.all([
        page.waitForResponse(responseDetails => responseDetails.url().includes('/services/transaction/') && responseDetails.status() === 200),
        await page.getByRole('button',{name: 'v Details'}).click(),
    ]);
    
    const [responseUpdate] = await Promise.all([
        page.waitForResponse(responseUpdate => responseUpdate.url().includes('/services/group?clientPk') && responseUpdate.status() === 200),
        await UsePOM.TranTable1stRowUpdateIcon.click(),
    ]);
    await UsePOM.RecSubmitRejectionBtn.waitFor({state:'visible'});
    //await page.waitForTimeout(1000);
    expect(await UsePOM.RecRejectReasonDD.locator('[selected="selected"]').innerText()).toMatch('No account');
    expect(await UsePOM.RecRejectAlwaysDD.locator('[selected="selected"]').innerText()).toMatch('No');
    
    await UsePOM.RecCrossIcon.nth(1).waitFor({state: "visible"});
    
    const [responseCrossIcon] = await Promise.all([
        page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/REJECTED?clientPk') && responseCrossIcon.status() === 200),
        await UsePOM.RecCrossIcon.nth(1).click(),
    ]);
    
    //await UsePOM.RecCrossIcon.nth(1).click();
});

test('PMX Payments with Deposit Directly set to No: Pending > Reject_2', async () => {
    const UsePOM = new MyPOM(page);
    
    await UsePOM.FilterSearchAcct.fill('');
    const [responseClient] = await Promise.all([
        page.waitForResponse(responseClient => responseClient.url().includes('/services/transaction/list/status/REJECTED?') && responseClient.status() === 200),
        await page.keyboard.press('Enter'),
    ]);
    
    const [responsePending] = await Promise.all([
        page.waitForResponse(responsePending => responsePending.url().includes('/services/transaction/list/status/PENDING?') && responsePending.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'PENDING'}),
    ]);
    
    await page.waitForTimeout(1000);
    await UsePOM.TranTable1stRowRejectIcon.waitFor({state: "visible"});
      
    const [responseRejectIcon] = await Promise.all([
        page.waitForResponse(responseRejectIcon => responseRejectIcon.url().includes('/services/group?clientPk') && responseRejectIcon.status() === 200),
        await UsePOM.TranTable1stRowRejectIcon.click(),
    ]);
    await UsePOM.RecSubmitBtn.waitFor({state:'visible'});

    AccountNum = await UsePOM.TranTable1stRowAccNumber.innerText();
    
    await UsePOM.RecRejectReasonDD.selectOption({label:'Multiple Errors'});
    await UsePOM.RecRejectAlwaysDD.selectOption({label:'No'});

    const [responseSubmitReject] = await Promise.all([
        page.waitForResponse(responseSubmitReject => responseSubmitReject.url().endsWith('/services/transaction/reject') && responseSubmitReject.status() === 200),
        await UsePOM.RecSubmitBtn.click(),
    ]);
    
    await UsePOM.RecCrossIcon.nth(0).waitFor({state: "visible"});
    const [responseCrossIcon] = await Promise.all([
        page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/PENDING?clientPk') && responseCrossIcon.status() === 200),
        await UsePOM.RecCrossIcon.nth(0).click(),
    ]);

});

test('PMX Payments with Deposit Directly set to No: Reject_2 > Assign_2', async () => {
    const UsePOM = new MyPOM(page);
    const [responseRejected] = await Promise.all([
        page.waitForResponse(responseRejected => responseRejected.url().includes('/services/transaction/list/status/REJECTED?') && responseRejected.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'REJECTED'}),
    ]);
    await UsePOM.FilterSearchAcct.fill(AccountNum);
    const [responseSearchAccount] = await Promise.all([
        page.waitForResponse(responseSearchAccount => responseSearchAccount.url().includes('/services/transaction/list/status/REJECTED?') && responseSearchAccount.status() === 200),
        await page.keyboard.press('Enter')
    ]);
    await page.waitForTimeout(1000);
    const [responseUpdate] = await Promise.all([
        page.waitForResponse(responseUpdate => responseUpdate.url().includes('/services/group?clientPk') && responseUpdate.status() === 200),
        await UsePOM.TranTable1stRowUpdateIcon.click(),
    ]);
    await UsePOM.RecAssignBtn.nth(0).waitFor({state: "visible"});
    await UsePOM.RecCopyBtn.waitFor({state: "visible"});
    await UsePOM.RecCopyBtn.click();
    await UsePOM.RecGroupDD.selectOption({index: 2});

    AGroup = await UsePOM.RecGroupDD.locator('option').nth(2).textContent();
      
    const [responseAssignBtn] = await Promise.all([
        page.waitForResponse(responseAssignBtn => responseAssignBtn.url().endsWith('/services/transaction/assign') && responseAssignBtn.status() === 200),
        await UsePOM.RecAssignBtn.nth(0).click(),
    ]);

    const [responseCrossIcon] = await Promise.all([
        page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/REJECTED?clientPk') && responseCrossIcon.status() === 200),
    ]);
});

test('PMX Payments with Deposit Directly set to No: Reject_2 > Assing_2 - Values Validation', async () => {
    const UsePOM = new MyPOM(page);
    const [responseAssigned] = await Promise.all([
        page.waitForResponse(responseAssigned => responseAssigned.url().includes('/services/transaction/list/status/ASSIGNED?clientPk') && responseAssigned.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'ASSIGNED'}),
    ]);
    
    const [responseDetails] = await Promise.all([
        page.waitForResponse(responseDetails => responseDetails.url().includes('/services/transaction/') && responseDetails.status() === 200),
        await page.getByRole('button',{name: 'v Details'}).click(),
    ]);
    
    await UsePOM.RecCrossIcon.nth(1).waitFor({state: "visible"});
    await page.waitForTimeout(1000);
    FindDash = AGroup.indexOf(' -')
    AGroupSubstring = AGroup.substring(0,FindDash)
    
    expect(page.getByTitle(AccountNum).nth(1)).toBeVisible();
    expect(page.getByText(AGroupSubstring).nth(1)).toBeVisible();
    
    const [responseCrossIcon] = await Promise.all([
        page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/ASSIGNED?clientPk') && responseCrossIcon.status() === 200),
        await UsePOM.RecCrossIcon.nth(1).click(),
    ]);
});

test('PMX Payments with Deposit Directly set to No: Pending > Assign_3', async () => {
    const UsePOM = new MyPOM(page);
    
    await UsePOM.FilterSearchAcct.fill('');
    const [responseClient] = await Promise.all([
        page.waitForResponse(responseClient => responseClient.url().includes('/services/transaction/list/status/ASSIGNED?') && responseClient.status() === 200),
        await page.keyboard.press('Enter'),
    ]);
    
    const [responsePending] = await Promise.all([
        page.waitForResponse(responsePending => responsePending.url().includes('/services/transaction/list/status/PENDING?') && responsePending.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'PENDING'}),
    ]);

    await page.waitForTimeout(1000);
    await UsePOM.TranTable1stRowAssignIcon.waitFor({state: "visible"});
    
    const [responseAssignIcon] = await Promise.all([
      page.waitForResponse(responseAssignIcon => responseAssignIcon.url().includes('/services/group?clientPk') && responseAssignIcon.status() === 200),
      await UsePOM.TranTable1stRowAssignIcon.click(),
    ]);
    
    await UsePOM.RecAssignBtn.nth(1).waitFor({state: "visible"});
    await UsePOM.RecCopyBtn.waitFor({state: "visible"});
    await UsePOM.RecCopyBtn.click();
    
    AccountNum = await UsePOM.TranTable1stRowAccNumber.innerText();
    AAccount = await UsePOM.RecAssignedAccount.inputValue();

    await UsePOM.RecGroupDD.selectOption({index: 2});
  
    AGroup = await UsePOM.RecGroupDD.locator('option').nth(2).textContent();

    const [responseAssignBtn] = await Promise.all([
      page.waitForResponse(responseAssignBtn => responseAssignBtn.url().endsWith('/services/transaction/assign') && responseAssignBtn.status() === 200),
      await UsePOM.RecAssignBtn.nth(1).click(),
    ]);
    await UsePOM.RecCrossIcon.nth(0).waitFor({state: "visible"});
  
    const [responseCrossIcon] = await Promise.all([
      page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/PENDING?clientPk') && responseCrossIcon.status() === 200),
      await UsePOM.RecCrossIcon.nth(0).click(),
    ]);
  
});

test('PMX Payments with Deposit Directly set to No: Assign_3 > Reject_3', async () => {
    const UsePOM = new MyPOM(page);
    await UsePOM.FilterSearchAcct.fill(AccountNum);
    const [responseClient] = await Promise.all([
        page.waitForResponse(responseClient => responseClient.url().includes('/services/transaction/list/status/PENDING?') && responseClient.status() === 200),
        await page.keyboard.press('Enter'),
    ]);
      
    await page.waitForTimeout(1000);
    const [responsePending] = await Promise.all([
        page.waitForResponse(responsePending => responsePending.url().includes('/services/transaction/list/status/ASSIGNED?') && responsePending.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'ASSIGNED'}),
    ]);

    const [responseUpdate] = await Promise.all([
        page.waitForResponse(responseUpdate => responseUpdate.url().includes('/services/group?clientPk') && responseUpdate.status() === 200),
        await UsePOM.TranTable1stRowUpdateIcon.click(),
    ]);

    await UsePOM.RecSubmitRejectionBtn.waitFor({state:'visible'})
    
    await UsePOM.RecRejectReasonDD.selectOption({label:'Multiple Errors'});
    await UsePOM.RecRejectAlwaysDD.selectOption({label:'No'});

    const [responseSubmitReject] = await Promise.all([
        page.waitForResponse(responseSubmitReject => responseSubmitReject.url().endsWith('/services/transaction/reject') && responseSubmitReject.status() === 200),
        await UsePOM.RecSubmitRejectionBtn.click(),
    ]);
});

test('PMX Payments with Deposit Directly set to No: Assign_3 > Reject_3 - Values Validation', async () => {
    const UsePOM = new MyPOM(page);
    await page.waitForTimeout(2000);
    const [responseRejected] = await Promise.all([
        page.waitForResponse(responseRejected => responseRejected.url().includes('/services/transaction/list/status/REJECTED?') && responseRejected.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'REJECTED'}),
    ]);
    
    const [responseUpdate] = await Promise.all([
        page.waitForResponse(responseUpdate => responseUpdate.url().includes('/services/group?clientPk') && responseUpdate.status() === 200),
        await UsePOM.TranTable1stRowUpdateIcon.click(),
    ]);
    
    await UsePOM.RecSubmitRejectionBtn.waitFor({state:'visible'});
    expect(await UsePOM.RecRejectReasonDD.locator('[selected="selected"]').innerText()).toMatch('Multiple Errors');
    expect(await UsePOM.RecRejectAlwaysDD.locator('[selected="selected"]').innerText()).toMatch('No');
    
    const [responseCrossIcon] = await Promise.all([
        page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/REJECTED?clientPk') && responseCrossIcon.status() === 200),
        await UsePOM.RecCrossIcon.nth(1).click(),
    ]);
});

test('PMX Payments with Deposit Directly set to Yes: Pending > Assign_4 Always Use: Yes', async () => {
    const UsePOM = new MyPOM(page);
    
    await UsePOM.FilterSearchAcct.fill('');
    const [responseClient] = await Promise.all([
        page.waitForResponse(responseClient => responseClient.url().includes('/services/transaction/list/status/REJECTED?') && responseClient.status() === 200),
        await page.keyboard.press('Enter'),
    ]);
    
    const [responsePending] = await Promise.all([
        page.waitForResponse(responsePending => responsePending.url().includes('/services/transaction/list/status/PENDING?') && responsePending.status() === 200),
        await UsePOM.FilterShow.selectOption({label: 'PENDING'}),
    ]);

    await page.waitForTimeout(1000);
    await UsePOM.TranTable1stRowAssignIcon.waitFor({state: "visible"});
    
    const [responseAssignIcon] = await Promise.all([
      page.waitForResponse(responseAssignIcon => responseAssignIcon.url().includes('/services/group?clientPk') && responseAssignIcon.status() === 200),
      await UsePOM.TranTable1stRowAssignIcon.click(),
    ]);
    
    await UsePOM.RecAssignBtn.nth(1).waitFor({state: "visible"});
    await UsePOM.RecCopyBtn.waitFor({state: "visible"});
    await UsePOM.RecCopyBtn.click();
    
    AccountNum = await UsePOM.TranTable1stRowAccNumber.innerText();
    AAccount = await UsePOM.RecAssignedAccount.inputValue();

    await UsePOM.RecGroupDD.selectOption({index: 1});
  
    AGroup = await UsePOM.RecGroupDD.locator('option').nth(1).textContent();

    const [responseAssignBtn] = await Promise.all([
      page.waitForResponse(responseAssignBtn => responseAssignBtn.url().endsWith('/services/transaction/assign') && responseAssignBtn.status() === 200),
      await UsePOM.RecAssignBtn.nth(1).click(),
    ]);
    await UsePOM.RecCrossIcon.nth(0).waitFor({state: "visible"});
});

test('PMX Payments with Deposit Directly set to Yes: Pending > Assign_5 Always Use: No', async () => {
    const UsePOM = new MyPOM(page);

    await UsePOM.RecAssignBtn.nth(1).waitFor({state: "visible"});
    await UsePOM.RecCopyBtn.waitFor({state: "visible"});
    await UsePOM.RecCopyBtn.click();
    
    AccountNum = await UsePOM.TranTable1stRowAccNumber.innerText();
    AAccount = await UsePOM.RecAssignedAccount.inputValue();

    await UsePOM.RecGroupDD.selectOption({index: 1});
  
    AGroup = await UsePOM.RecGroupDD.locator('option').nth(1).textContent();
    
    await UsePOM.RecAlwaysUseDD.nth(1).selectOption({label:'No'});
    
    const [responseAssignBtn] = await Promise.all([
      page.waitForResponse(responseAssignBtn => responseAssignBtn.url().endsWith('/services/transaction/assign') && responseAssignBtn.status() === 200),
      await UsePOM.RecAssignBtn.nth(1).click(),
    ]);
    await UsePOM.RecCrossIcon.nth(0).waitFor({state: "visible"});
  
    const [responseCrossIcon] = await Promise.all([
      page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/list/status/PENDING?clientPk') && responseCrossIcon.status() === 200),
      await UsePOM.RecCrossIcon.nth(0).click(),
    ]);
    
});


