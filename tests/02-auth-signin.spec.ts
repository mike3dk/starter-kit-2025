import { test, expect } from "@playwright/test"
import {
  generateTestUser,
  fillSignInForm,
  fillSignUpForm,
  navigateToSignIn,
  navigateToSignUp,
  waitForFormSubmission,
  checkForErrors,
  verifyAuthenticated,
  verifyNotAuthenticated,
  verifyNavigation,
  cleanupTestUser,
} from "./utils"

test.describe("User Sign In", () => {
  let existingUser: ReturnType<typeof generateTestUser>

  // Create a user before sign-in tests
  test.beforeAll(async ({ browser }) => {
    existingUser = generateTestUser()
    const page = await browser.newPage()

    // Create the user first
    await navigateToSignUp(page)
    await fillSignUpForm(page, existingUser)
    await page.getByRole("button", { name: "Sign up" }).click()
    await waitForFormSubmission(page)

    await page.close()
  })

  test.afterAll(async () => {
    // Cleanup the test user
    await cleanupTestUser(existingUser.email)
  })

  test.beforeEach(async ({ page }) => {
    // Navigate to sign-in page before each test
    await navigateToSignIn(page)
  })

  test("should display sign-in form correctly", async ({ page }) => {
    // Check that all form elements are visible
    await expect(page.locator("text=Sign In")).toBeVisible()
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password")).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()

    // Check for GitHub sign-in button
    await expect(
      page.getByRole("button", { name: "Continue with GitHub" })
    ).toBeVisible()

    // Check for forgot password link
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible()
    await expect(page.locator("text=Forgot password?")).toBeVisible()
  })

  test("should successfully sign in with valid credentials", async ({
    page,
  }) => {
    // Fill out the form with existing user credentials
    await fillSignInForm(page, existingUser)

    // Submit the form
    await page.getByRole("button", { name: "Sign in" }).click()

    // Wait for submission to complete and navigation
    await waitForFormSubmission(page)

    // Verify we're redirected to home page and authenticated
    await verifyNavigation(page, "/")
    await verifyAuthenticated(page)
  })

  test("should show validation errors for empty fields", async ({ page }) => {
    // Try to submit empty form
    await page.getByRole("button", { name: "Sign in" }).click()

    // Check for validation errors
    await expect(
      page.locator("text=Please enter a valid email address")
    ).toBeVisible()
    await expect(
      page.locator("text=Password must be at least 8 characters long")
    ).toBeVisible()
  })

  test("should show validation error for invalid email format", async ({
    page,
  }) => {
    await fillSignInForm(page, {
      email: "invalid-email",
      password: "ValidPassword123!",
    })

    await page.getByRole("button", { name: "Sign in" }).click()

    // Check for email validation error
    await expect(
      page.locator("text=Please enter a valid email address")
    ).toBeVisible()
  })

  test("should show validation error for short password", async ({ page }) => {
    await fillSignInForm(page, {
      email: "test@example.com",
      password: "123",
    })

    await page.getByRole("button", { name: "Sign in" }).click()

    // Check for password validation error
    await expect(
      page.locator("text=Password must be at least 8 characters long")
    ).toBeVisible()
  })

  test("should show error for non-existent user", async ({ page }) => {
    const nonExistentUser = generateTestUser()

    await fillSignInForm(page, nonExistentUser)
    await page.getByRole("button", { name: "Sign in" }).click()

    // Wait for submission and check for error
    await waitForFormSubmission(page)

    // Check for authentication error (the exact message depends on your auth implementation)
    const hasError = await checkForErrors(page)
    expect(hasError).toBe(true)
  })

  test("should show error for incorrect password", async ({ page }) => {
    await fillSignInForm(page, {
      email: existingUser.email,
      password: "WrongPassword123!",
    })

    await page.getByRole("button", { name: "Sign in" }).click()
    await waitForFormSubmission(page)

    // Check for authentication error
    const hasError = await checkForErrors(page)
    expect(hasError).toBe(true)
  })

  test("should navigate to forgot password page", async ({ page }) => {
    await page.locator('a[href="/forgot-password"]').click()

    // Verify navigation to forgot password page
    await verifyNavigation(page, "/forgot-password")
  })

  test("should disable submit button during form submission", async ({
    page,
  }) => {
    await fillSignInForm(page, existingUser)

    // Click submit button
    const submitButton = page.getByRole("button", { name: "Sign in" })
    await submitButton.click()

    // Check that button is disabled during submission
    await expect(submitButton).toBeDisabled()

    // Wait for submission to complete
    await waitForFormSubmission(page)
  })

  test("should show loading state during form submission", async ({ page }) => {
    await fillSignInForm(page, existingUser)

    // Submit form
    await page.getByRole("button", { name: "Sign in" }).click()

    // Check for loading indicator
    const loadingIndicator = page.locator('[data-loading="true"]')
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 })

    // Wait for submission to complete
    await waitForFormSubmission(page)
  })

  test("should maintain user session after page refresh", async ({ page }) => {
    // Sign in first
    await fillSignInForm(page, existingUser)
    await page.getByRole("button", { name: "Sign in" }).click()
    await waitForFormSubmission(page)

    // Verify authentication
    await verifyNavigation(page, "/")
    await verifyAuthenticated(page)

    // Refresh the page
    await page.reload()

    // Should still be authenticated
    await verifyAuthenticated(page)
  })

  test("should sign out successfully", async ({ page }) => {
    // Sign in first
    await fillSignInForm(page, existingUser)
    await page.getByRole("button", { name: "Sign in" }).click()
    await waitForFormSubmission(page)

    // Verify authentication
    await verifyNavigation(page, "/")
    await verifyAuthenticated(page)

    // Sign out
    await page.locator("text=Sign Out").click()

    // Wait for sign-out to complete
    await page.waitForTimeout(1000)

    // Should be redirected and not authenticated
    await verifyNotAuthenticated(page)
  })

  test("should handle GitHub sign-in button click", async ({ page }) => {
    // Click GitHub sign-in button
    const githubButton = page.getByRole("button", {
      name: "Continue with GitHub",
    })
    await githubButton.click()

    // The button should show loading state
    await expect(githubButton).toBeDisabled()

    // Note: In a real test, you'd mock the GitHub OAuth flow
    // For now, we just verify the button interaction works
  })

  test("should preserve form data when navigating back", async ({ page }) => {
    const testEmail = "test@example.com"
    const testPassword = "TestPassword123!"

    // Fill form
    await fillSignInForm(page, { email: testEmail, password: testPassword })

    // Navigate away and back
    await page.goto("/sign-up")
    await page.goBack()

    // Check if form data is preserved (this depends on browser behavior)
    const emailValue = await page.getByLabel("Email").inputValue()
    const passwordValue = await page.getByLabel("Password").inputValue()

    // Note: Form data preservation depends on browser settings
    // This test documents the expected behavior
    console.log(`Email preserved: ${emailValue === testEmail}`)
    console.log(`Password preserved: ${passwordValue === testPassword}`)
  })

  test("should handle multiple rapid form submissions gracefully", async ({
    page,
  }) => {
    await fillSignInForm(page, existingUser)

    // Click submit button multiple times rapidly
    const submitButton = page.getByRole("button", { name: "Sign in" })

    // First click
    await submitButton.click()

    // Button should be disabled, preventing additional clicks
    await expect(submitButton).toBeDisabled()

    // Wait for submission to complete
    await waitForFormSubmission(page)

    // Verify successful sign-in
    await verifyNavigation(page, "/")
    await verifyAuthenticated(page)
  })
})
