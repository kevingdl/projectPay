const { test, expect, chromium } = require('@playwright/test');
const { MyPOM } = require('../page_model/pom');
const { Credentials } = require('../helpers/users');
const { PMXenv, PMXCred } = require('../helpers/urls');



//https://playwright.dev/docs/test-parallel#serial-mode
//You can annotate inter-dependent tests as serial. If one of the serial tests fails, all subsequent tests are skipped. All tests in a group are retried together.
//Using serial is not recommended. It is usually better to make your tests isolated, so they can be run independently.
//test.describe.configure({ mode: 'serial' });

/** @type {import('@playwright/test').Page} */
let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  const UsePOM = new MyPOM(page);
  await UsePOM.OpenTheEnvrionment();

  /*
  const ambiente = PMXenv();
  console.log(PMXenv());
  await page.goto(PMXenv());
  */
});

test.afterAll(async () => {
  await page.close();
});


test('Logo', async () => {
  //https://playwright.dev/docs/locators
  //https://www.cuketest.com/playwright/docs/api/class-locator/

  //await expect(page.locator('img.Vancologo.inline')).toHaveCount(2);
  //await expect(page.locator('img[src=data:image3]')).toBeTruthy();
  //await expect(page.locator('img')).toHaveAttribute('src',/^data/);
  await expect(page.locator('img')).toBeVisible()
  
});


test('Header', async () => {
  //await page.goto(env)
  //console.log((await page.locator('h3').innerText()).valueOf());
  //console.log(await page.innerText("h3"));
  //console.log(await page.locator('h3').textContent());
  //expect((await page.locator('h3').innerText()).valueOf()).toMatch("Payment Exchange123");
  
  expect(await page.innerText("h3")).toMatch("Payment Exchange");
  //await expect(page.getByRole('heading', { name: 'Payment Exchange' } )).toBeHidden();
  //.expect(Selector('h3').withExactText('Payment Exchange').exists).ok()
  await page.pause();
  
});

test('Login Title', async () => {
  //await page.goto(env)
  //await page.pause();
  //console.log(await page.innerText('.loginBox > div>>nth=0'));
  expect(await page.innerText('.loginBox > div>>nth=0')).toMatch("Login");
  //.expect(Selector('.loginBox').child('div').nth(0).innerText).eql('login')

});

test('User ID Label', async () => {
  
  //expect(page.getByLabel('User ID1')).toBeVisible();
  expect(page.getByLabel('User ID')).toBeTruthy();
  expect(await page.innerText('.labelLogin')).toMatch("User ID")


 // .expect(Selector('label').withExactText("User ID").exists).ok()
 // .expect(ObjRef.UserField.exists).ok()
  
});

test('User ID Field', async () => {
  const UsePOM = new MyPOM(page);
  expect(UsePOM.user).toBeTruthy();

});

test('Password Label', async () => {
  expect(page.getByLabel('Password')).toBeTruthy();
  expect(page.getByRole('label',{name: 'Password'})).toBeTruthy();
  expect(await page.innerText('.labelLogin>>nth=1')).toMatch("Password")

});
test('Password Field', async () => {
  const UsePOM = new MyPOM(page);
  expect(UsePOM.pass).toBeTruthy();

});

test('Login Button', async () => {
  const UsePOM = new MyPOM(page);
  expect(UsePOM.LoginButton).toBeTruthy();

});

test('Reset Button', async () => {
  expect(page.getByRole('div',{name: 'Reset Password'})).toBeTruthy();

});

test('Reset Link', async () => {
  await expect(page.getByRole('link',{name: 'Reset Password'})).toHaveAttribute('href','#/vanco/reset');

});
test('Privacy & Security', async () => {
  expect(page.getByRole('div',{name: 'Privacy & Security'})).toBeTruthy();

});

test('Privacy & Security Link', async () => {
  await expect(page.getByRole('link',{name: 'Privacy & Security'})).toHaveAttribute('href','pmx_online_security.html');

});

test('Login User', async () => {
 
  const UsePOM = new MyPOM(page);
  await UsePOM.LoginPMX();

});

test('Logout User', async () => {
 
  const UsePOM = new MyPOM(page);
  await UsePOM.LogoutPMX();
  expect(UsePOM.LoginButton).toBeTruthy();

});
