const { test, expect, chromium } = require('@playwright/test');
const { MyPOM } = require('../page_model/pom');

test.describe.configure({ mode: 'serial' });

let AccountNum = '';
let MR_ClientID = '';
let MR_Group = '';
let MR_Originator = '';
let MR_Amount ='';

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

test('PMX Manual Returns_1 - Debit', async () => {
  const UsePOM = new MyPOM(page);

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
    page.waitForResponse(responseReturn => responseReturn.url().includes('/services/transaction') && responseReturn.status() === 200),
    await UsePOM.TranTable1stRowDetailsIcon.click(),
  ]);
  
  AccountNum = await UsePOM.TranTable1stRowAccNumber.innerText();
  MR_ClientID = await page.locator(':text("Client ID:") + div>>nth=1').innerText();
  MR_Group = await page.locator(':text("Group:") + div>>nth=1').innerText();
  MR_Amount = await page.locator(':text("Amount:") + div>>nth=1').innerText();
  MR_Originator = await page.locator(':text("Originator:") + div>>nth=1').innerText();
  
  const [responseCrossIcon] = await Promise.all([
    page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/history/status/PROCESSED?') && responseCrossIcon.status() === 200),
    await page.getByRole('button',{name:'n', exact:true}).nth(0).click(),
  ]);

  const [responseCM] = await Promise.all([
    page.waitForResponse(responseCM => responseCM.url().endsWith('services/client/list') && responseCM.status() === 200),
    await UsePOM.CashManagement.click(),
  ]);

  const [responseMR] = await Promise.all([
    page.waitForResponse(responseMR => responseMR.url().endsWith('services/nextSettlementDate') && responseMR.status() === 200),
    await UsePOM.ManualReturns.click(),
  ]);

  await page.getByText('Save').waitFor({state:"visible"});
  await page.getByPlaceholder("Enter ID").fill(MR_ClientID);
  
  const [responseCI] = await Promise.all([
    page.waitForResponse(responseCI => responseCI.url().endsWith('services/group?clientId='+MR_ClientID) && responseCI.status() === 200),
    await page.keyboard.press('Tab'),
  ]);
  
  const MR_Group_Full = page.locator('option',{hasText:MR_Group, exact:true}).nth(0).textContent();
  await page.locator('[name="groupId"]').selectOption(MR_Group_Full);
  await page.locator('[name="payerClientId"]').selectOption({label:MR_Originator});
  await page.getByPlaceholder("Enter Amount").fill(MR_Amount.substring(1));
  
  const [responseCMR] = await Promise.all([
    page.waitForResponse(responseCMR => responseCMR.url().endsWith('services/transaction/createManualReturn') && responseCMR.status() === 200),
    await page.getByText('Save').click(),
  ]);
  
  expect(await page.locator('#modal-title').innerText()).toMatch("Transaction Added Successfully");
  await page.getByRole('button',{name:'OK'}).click();

  
});

test('PMX Manual Returns_2 - Credit', async () => {
  const UsePOM = new MyPOM(page);
  //await page.pause();
  const [responseMP] = await Promise.all([
    page.waitForResponse(responseMP => responseMP.url().includes('/services/transaction/metrics/Today') && responseMP.status() === 200),
    await UsePOM.ManagePayments.click(),
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
  
  const [responsePBLastPage] = await Promise.all([
    page.waitForResponse(responsePBLastPage => responsePBLastPage.url().includes('/services/transaction/history/status/PROCESSED?clientPk') && responsePBLastPage.status() === 200),
    await page.locator('[ng-model="paging.currentPage"] >> li').nth(0).locator('a').click(),
  ]);
  
  const [responseReturn] = await Promise.all([
    page.waitForResponse(responseReturn => responseReturn.url().includes('/services/transaction') && responseReturn.status() === 200),
    await UsePOM.TranTable1stRowDetailsIcon.click(),
  ]);
  
  AccountNum = await UsePOM.TranTable1stRowAccNumber.innerText();
  MR_ClientID = await page.locator(':text("Client ID:") + div>>nth=1').innerText();
  MR_Group = await page.locator(':text("Group:") + div>>nth=1').innerText();
  MR_Amount = await page.locator(':text("Amount:") + div>>nth=1').innerText();
  MR_Originator = await page.locator(':text("Originator:") + div>>nth=1').innerText();
  
  const [responseCrossIcon] = await Promise.all([
    page.waitForResponse(responseCrossIcon => responseCrossIcon.url().includes('services/transaction/history/status/PROCESSED?') && responseCrossIcon.status() === 200),
    await page.getByRole('button',{name:'n', exact:true}).nth(0).click(),
  ]);

  const [responseCM] = await Promise.all([
    page.waitForResponse(responseCM => responseCM.url().endsWith('services/client/list') && responseCM.status() === 200),
    await UsePOM.CashManagement.click(),
  ]);

  const [responseMR] = await Promise.all([
    page.waitForResponse(responseMR => responseMR.url().endsWith('services/nextSettlementDate') && responseMR.status() === 200),
    await UsePOM.ManualReturns.click(),
  ]);

  await page.getByText('Save').waitFor({state:"visible"});
  await page.getByPlaceholder("Enter ID").fill(MR_ClientID);
  
  const [responseCI] = await Promise.all([
    page.waitForResponse(responseCI => responseCI.url().endsWith('services/group?clientId='+MR_ClientID) && responseCI.status() === 200),
    await page.keyboard.press('Tab'),
  ]);
  
  
  const MR_Group_Full = page.locator('option',{hasText:MR_Group, exact:true}).nth(0).textContent();
  await page.locator('[name="groupId"]').selectOption(MR_Group_Full);
  await page.locator('[name="payerClientId"]').selectOption({label:MR_Originator});
  await page.getByPlaceholder("Enter Amount").fill(MR_Amount.substring(1));
  await page.locator('[name="credit"]').selectOption({label:'Credit'});
  
  const [responseCMR] = await Promise.all([
    page.waitForResponse(responseCMR => responseCMR.url().endsWith('services/transaction/createManualReturn') && responseCMR.status() === 200),
    await page.getByText('Save').click(),
  ]);
  
  expect(await page.locator('#modal-title').innerText()).toMatch("Transaction Added Successfully");
  await page.getByRole('button',{name:'OK'}).click();

  
});
