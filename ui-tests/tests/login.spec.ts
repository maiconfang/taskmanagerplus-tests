import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Test when user provides valid credentials
test('should login successfully and redirect to app page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.login('luna.moon@maif.com', '123');

    await loginPage.expectWelcomeMessage('Welcome');
});

// Test when user provides invalid credentials
test('should show error message for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.login('invalidUser', 'invalidPassword');

    await loginPage.expectLoginError('Invalid username or password');
});

// Test when user provides only username
test('should show validation message for empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.fillLogin('validUser');

    await loginPage.clickOnPasswordField();

    await loginPage.blurInputs();

    await loginPage.expectValidationMessage('Password is required');
});

// Test when user provides only password
test('should show validation message for empty login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.fillPassword('validPassword');

    await loginPage.clickOnLoginField();

    await loginPage.blurInputs();

    await loginPage.expectValidationMessage('The login is required');
});

// Test when user navigates to login page
test('should be on login page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.expectTitleVisible();
});

// Test when user tries to access app page without logging in
test('should redirect to login page when accessing app page without login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.expectLoginPageReady();
});

// Test when user logs out
test('should log out successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('luna.moon@maif.com', '123');

  await loginPage.expectWelcomeMessage('Welcome to the System!');

  await loginPage.logout();

  await loginPage.expectLoginPageReady();
});


// Custom test: fill username and password with Maicon Fang
test('should login with Maicon Fang credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.login('maicon.fang', '123456');

    await loginPage.expectWelcomeMessage('Welcome');
});
