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

test('Cash Management - Menu Navigation', async () => {
  const UsePOM = new MyPOM(page);

  await page.pause();

  const [responseClientField] = await Promise.all([
    page.waitForResponse(responseClientField => responseClientField.url().endsWith('/services/client/list') && responseClientField.status() === 200)
  ]);
  
  const [responseCM] = await Promise.all([
    page.waitForResponse(responseCM => responseCM.url().endsWith('services/client/list') && responseCM.status() === 200),
    await UsePOM.CashManagement.click(),
  ]);

  const [responsePR] = await Promise.all([
    page.waitForResponse(responsePR => responsePR.url().endsWith('/services/document/types?clientDocument=false') && responsePR.status() === 200),
    await UsePOM.processingReports.click(),
  ]);

  const [responseFT] = await Promise.all([
    page.waitForResponse(responseFT => responseFT.url().endsWith('/services/transaction/ACHFile') && responseFT.status() === 200),
    await UsePOM.fileTracking.click(),
  ]);

  const [responseBR] = await Promise.all([
    page.waitForResponse(responseBR => responseBR.url().endsWith('/services/transaction/billerReports') && responseBR.status() === 200),
    await UsePOM.billerReports.click(),
  ]);

  await UsePOM.rppsFileUpload.click();
  expect(page.locator('#mainInput')).toBeTruthy();

  const [responseOR] = await Promise.all([
    page.waitForResponse(responseOR => responseOR.url().endsWith('/services/transaction/history/status/OFFSETRETURNED?noOffsetPk=true') && responseOR.status() === 200),
    await UsePOM.offsetReturns.click(),
  ]);

  const [responseMR] = await Promise.all([
    page.waitForResponse(responseMR => responseMR.url().endsWith('services/client/list') && responseMR.status() === 200),
    await UsePOM.ManualReturns.click(),
  ]);

});

