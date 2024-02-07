// playwright-dev-page.js
  const { expect } = require('@playwright/test');

exports.MyPOM = class MyPOM {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
//LOGIN PAGE
    this.page = page;
    this.user = page.locator('[name="username"]');
    this.pass = page.locator('[name="password"]');
    this.LoginButton = page.locator('[value="Login"]');

//MAIN PAGE
    this.ProfileMenu = page.getByRole('link',{name:'PROFILE'});  
    this.UserDropdownMenu = page.locator('.headerUrlStyle.superDropdown >a>>nth=0');
    
    this.ClientListField = page.locator('[placeholder="Enter Client Name or ID"]>>nth=0');
    this.ClientListDisplay = page.locator('[role="listbox"]>>nth=0');
    this.CashManagement = page.getByText('$ CASH MANAGEMENT');
    this.ManagePayments = page.getByText('K MANAGE PAYMENTS');
    
    this.cashMgt            = page.getByRole('link',{name:'Cash Management'});
    this.processingReports  = page.getByRole('link',{name:'Processing Reports'});
    this.fileTracking       = page.getByRole('link',{name:'File Tracking'});
    this.billerReports      = page.getByRole('link',{name:'Biller Reports'});
    this.rppsFileUpload     = page.getByRole('link',{name:'RPPS File Upload'});
    this.offsetReturns      = page.getByRole('link',{name:'Offset Returns'});
    this.ManualReturns      = page.getByRole('link',{name:'Manual Returns'});
    
    this.ProfileSettings = page.locator('a').filter({ hasText: 'SETTINGS' });

    this.TabGroups = page.getByRole('link',{name:'GROUPS'});
    this.TabGroupAddNewButton = page.locator('.addNewBtn>>nth=3');
  
//NAVIGATION MENU
    this.NavMenuManagePay = page.locator('span').filter({hasText: 'MANAGE PAYMENTS'});
    this.NavMenuPending = page.getByRole('link',{name: 'PENDING TRANSACTIONS'});
    this.NavMenuPosted = page.getByRole('link',{name: 'POSTED TRANSACTIONS'}) 


//TRANSACTION TABLE FILTERS
    this.FilterSearchAcct = page.locator('[placeholder="Account"]');
    this.FilterShow = page.locator('select>>nth=1');
    //this.FilterShowPending = page.locator('select>>nth=1').selectOption({label: 'PENDING'});
    //this.FilterShowAssigned = page.locator('select>>nth=1').selectOption({label: 'ASSIGNED'});

//TRANSACTION TABLE
//We recommend using text locators to find non interactive elements like div, span, p, etc. 
//For interactive elements like button, a, input, etc. use role locators.
  this.TranTable1stRowAccNumber  = page.locator('#gridrecord').nth(0).locator('td').nth(0);
  this.TranTable1stRowAssignIcon = page.getByRole('button',{name: 's Assign'}).nth(0);
  this.TranTable1stRowDetailsIcon = page.getByRole('button',{name: 'v Details'}).nth(0);
  this.TranTable1stRowUpdateIcon = page.getByRole('button',{name: 's Update'}).nth(0);
  this.TranTable1stRowRejectIcon = page.getByRole('button',{name: 'n Reject'}).nth(0);
  this.TranTable1stRowReturnIcon = page.getByRole('button',{name: 'D Return'}).nth(0);
  


//TRANSACTIONS RECORDS
  this.RecSkipBtn = page.getByRole('button',{name:'SKIP', exact:true});
  this.RecCopyBtn = page.getByRole('button',{name:'B Copy'}).nth(0);
  this.RecAssignBtn = page.getByRole('button',{name:'ASSIGN'});
  this.RecSubmitBtn = page.getByRole('button',{name: 'SUBMIT',exact:true});
  this.RecSubmitRejectionBtn = page.getByRole('button',{name: 'SUBMIT REJECTION', exact:true});
  this.RecReturnFundsBtn = page.getByRole('button',{name:'RETURN FUNDS', exact:true});
  this.RecReturnUpdateBtn = page.getByRole('button',{name: 'UPDATE RETURN', exact:true});
  this.RecReturnCancelBtn = page.getByRole('button',{name: 'CANCEL RETURN', exact:true});

  this.RecCrossIcon = page.getByRole('button',{name:'n',exact:true});
  
  this.RecAssignedAccount = page.locator('[name="assignedAcctInput"]').nth(0);
  
  this.RecGroupDD = page.locator('[name="groups"]').nth(0);
  this.RecAlwaysUseDD = page.locator('.gridLabels + select');
  this.RecRejectReasonDD = page.locator('[name="rejectReasonOps"]').nth(0);
  this.RecRejectAlwaysDD = page.locator('[data-ng-if="currentClient.alwaysReject"] + select').nth(0);
  this.RecReturnDD = page.locator('[name="returnReasonOps"]').nth(0);
  
  
  
    
    /*    
    this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
    this.pomLink = page.locator('li', { hasText: 'Guides' }).locator('a', { hasText: 'Page Object Model' });
    this.tocList = page.locator('article div.markdown ul > li > a');
*/
  }
  async OpenTheEnvrionment(){
    await this.page.goto(process.env.BASE_URL)
  }
  
  async LoginPMX(){
    await this.user.fill(process.env.USERNAME)
    await this.pass.fill(process.env.PASSWORD)
    await this.LoginButton.click()
  }
  async LoginPMX2(){
    await this.user.fill(process.env.USERNAME2)
    await this.pass.fill(process.env.PASSWORD2)
    await this.LoginButton.click()
  }
  async LogoutPMX(){
    
    //await this.page.locator('#SKey a>>nth=1').hover()
    await this.UserDropdownMenu.hover()
    const [responseLogOut] = await Promise.all([
      this.page.waitForResponse(responseLogOut => responseLogOut.url().endsWith('/services/security/authenticate/logout') && responseLogOut.status() === 200),
      await this.page.getByText('Log out').click(),
    ]); 
  }
  async SearchClientList(){

    await this.ClientListField.fill(process.env.CLIENT_NAME)
    await this.ClientListDisplay.waitFor()
    //await this.page.keyboard.press('Enter')
  }

/*
  async goto() {
    await this.page.goto('https://playwright.dev');
  }

  async getStarted() {
    await this.getStartedLink.first().click();
    await expect(this.gettingStartedHeader).toBeVisible();
  }

  async pageObjectModel() {
    await this.getStarted();
    await this.pomLink.click();
  }
  */
}