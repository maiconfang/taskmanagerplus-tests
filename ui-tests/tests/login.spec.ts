import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Test when user provides valid credentials
test.only('should login successfully and redirect to app page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('luna.moon@maif.com', '123');
    await loginPage.expectWelcomeMessage('Welcome'); // Adjust the message if necessary
});

// Test when user provides invalid credentials
test('should show error message for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('invalidUser', 'invalidPassword');
    await loginPage.expectLoginError('Invalid username or password'); // Adjust the message if necessary
});

// Test when user provides empty credentials
test('should show validation message for empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('', '');
    await loginPage.expectValidationMessage('Username and password are required'); // Adjust the message if necessary
});

// Test when user provides only username
test('should show validation message for empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.fillUsername('validUser');
    await loginPage.submit();
    await loginPage.expectValidationMessage('Password is required'); // Adjust the message if necessary
});

// Test when user provides only password
test('should show validation message for empty username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.fillPassword('validPassword');
    await loginPage.submit();
    await loginPage.expectValidationMessage('Username is required'); // Adjust the message if necessary
});

// Test when user navigates to login page
test('should be on login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.expectOnLoginPage();
    // Checks if the URL is as expected
    await loginPage.expectWelcomeMessage('Please log in'); // Adjust the message if necessary
});

// Test when user tries to access app page without logging in
test('should redirect to login page when accessing app page without login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.expectOnLoginPage();
});

// Test when user logs out
test('should log out successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('validUser', 'validPassword');
    await loginPage.expectWelcomeMessage('Welcome'); // Adjust the message if necessary
    // Simulates logout, if there is a method for it
    // await loginPage.logout(); // Uncomment if there is a logout method
    await loginPage.expectOnLoginPage(); // Checks if it returned to login page
    await loginPage.expectWelcomeMessage('Please log in'); // Adjust the message if necessary
});

// Test when user tries to access login page while already logged in
test('should not allow access to login page when already logged in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('validUser', 'validPassword');
    await loginPage.expectWelcomeMessage('Welcome'); // Adjust the message if necessary
    // Tries to access login page again
    await loginPage.navigate();
    await loginPage.expectWelcomeMessage('Welcome'); // Checks if still on the app page
});


// create a test to fill the username and password with maicon fang and password 123456

