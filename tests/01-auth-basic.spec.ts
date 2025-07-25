import { test, expect } from "@playwright/test"
import {
  generateTestUser,
  navigateToSignUp,
  navigateToSignIn,
  fillSignUpForm,
  fillSignInForm,
  waitForAlertDialog,
  clickAlertDialogAction,
  clickAlertDialogSecondaryAction,
  checkEmailVerificationStatus,
  completeSignUpWithVerification,
  setupTestMocks,
} from "./utils"

test.describe("Basic Auth Tests", () => {
  // Setup mocks before each test
  test.beforeEach(async ({ page }) => {
    await setupTestMocks(page)
  })

  test("should display sign-up form correctly", async ({ page }) => {
    await page.goto("/sign-up")

    // Check that the form is visible
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
    await expect(page.getByTestId("sign-up-button")).toBeVisible()
  })

  test("should display sign-in form correctly", async ({ page }) => {
    await page.goto("/sign-in")

    // Check that the form is visible
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.getByTestId("sign-in-button")).toBeVisible()
  })

  test("should successfully sign up a new user", async ({ page }) => {
    const testUser = generateTestUser()

    await page.goto("/sign-up")

    // Fill out the form
    await page.fill('input[name="name"]', testUser.name)
    await page.fill('input[name="email"]', testUser.email)
    await page.fill('input[name="password"]', testUser.password)
    await page.fill('input[name="confirmPassword"]', testUser.password)

    // Submit the form
    await page.getByTestId("sign-up-button").click()

    // Wait for success dialog to appear
    await waitForAlertDialog(page, "created")

    // Click OK to dismiss the dialog
    await clickAlertDialogAction(page, "OK")

    console.log("Sign up completed for:", testUser.email)
  })

  test("should navigate between sign-in and sign-up pages", async ({
    page,
  }) => {
    // Start on sign-in page
    await page.goto("/sign-in")
    await expect(page.locator('input[name="email"]')).toBeVisible()

    // Navigate to sign-up page using the new link
    await page.click('a[href="/sign-up"]:has-text("Sign up")')
    await page.waitForURL("/sign-up")

    // Verify we're on sign-up page
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()

    // Navigate back to sign-in page
    await page.click('a[href="/sign-in"]')
    await page.waitForURL("/sign-in")

    // Verify we're back on sign-in page
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test("should show loading state during form submission", async ({ page }) => {
    const testUser = generateTestUser()

    await page.goto("/sign-up")

    // Fill out the form
    await page.fill('input[name="name"]', testUser.name)
    await page.fill('input[name="email"]', testUser.email)
    await page.fill('input[name="password"]', testUser.password)
    await page.fill('input[name="confirmPassword"]', testUser.password)

    // Click submit button and check for loading state
    await page.getByTestId("sign-up-button").click()

    // Check for loading state (button should be disabled)
    const submitButton = page.getByTestId("sign-up-button")
    await expect(submitButton).toBeDisabled()

    console.log("Loading state test completed for:", testUser.email)
  })

  test("should complete full email verification workflow", async ({ page }) => {
    const testUser = generateTestUser()

    // Step 1: Sign up user
    await navigateToSignUp(page)
    await fillSignUpForm(page, testUser)
    await page.getByTestId("sign-up-button").click()

    // Step 2: Verify success dialog appears with verification message
    await waitForAlertDialog(page, "created")
    await clickAlertDialogAction(page, "OK")

    // Step 3: Try to sign in before verification - should fail
    const status = await checkEmailVerificationStatus(page, testUser)
    expect(status).toBe("not-verified")

    // Step 4: Verify "Resend verification email" button appears in error dialog
    await navigateToSignIn(page)
    await fillSignInForm(page, testUser)
    await page.getByTestId("sign-in-button").click()

    const errorDialog = await waitForAlertDialog(page, "not verified")
    const resendButton = errorDialog.getByRole("button", {
      name: "Resend verification email",
    })
    await expect(resendButton).toBeVisible()

    console.log(
      "Email verification workflow test completed for:",
      testUser.email
    )
  })

  test("should show resend verification email functionality", async ({
    page,
  }) => {
    const testUser = generateTestUser()

    // Sign up user first
    await completeSignUpWithVerification(page, testUser)

    // Try to sign in with unverified email
    await navigateToSignIn(page)
    await fillSignInForm(page, testUser)
    await page.getByTestId("sign-in-button").click()

    // Wait for error dialog with resend option
    await waitForAlertDialog(page, "not verified")

    // Click resend verification email button
    await clickAlertDialogSecondaryAction(page, "Resend verification email")

    // Should show success message
    await waitForAlertDialog(page, "sent")
    await clickAlertDialogAction(page, "OK")

    console.log("Resend verification email test completed for:", testUser.email)
  })

  test("should show proper email verification flow", async ({ page }) => {
    const testUser = generateTestUser()

    // Step 1: Complete sign up
    await completeSignUpWithVerification(page, testUser)

    // Step 2: Try to sign in without verification - should show error with resend button
    await navigateToSignIn(page)
    await fillSignInForm(page, testUser)
    await page.getByTestId("sign-in-button").click()

    // Step 3: Should show error dialog with resend verification option
    const errorDialog = await waitForAlertDialog(page)
    const resendButton = errorDialog.getByRole("button", {
      name: "Resend verification email",
    })
    await expect(resendButton).toBeVisible()

    // Step 4: Test that resend button works
    await clickAlertDialogSecondaryAction(page, "Resend verification email")

    // Step 5: Should show success message
    await waitForAlertDialog(page, "sent")
    await clickAlertDialogAction(page, "OK")

    console.log("Email verification flow test completed for:", testUser.email)
  })

  test("should handle form validation errors", async ({ page }) => {
    await navigateToSignUp(page)

    // Try to submit empty form
    await page.getByTestId("sign-up-button").click()

    // Should show validation errors (form should not submit)
    await page.waitForTimeout(1000)

    // Check that we're still on sign-up page
    expect(page.url()).toContain("/sign-up")

    // Fill in mismatched passwords
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "password123")
    await page.fill('input[name="confirmPassword"]', "differentpassword")

    await page.getByTestId("sign-up-button").click()

    // Should still be on sign-up page due to validation error
    await page.waitForTimeout(1000)
    expect(page.url()).toContain("/sign-up")

    console.log("Form validation test completed")
  })

  test("should navigate to forgot password page", async ({ page }) => {
    await navigateToSignIn(page)

    // Click forgot password link
    await page.click('a[href="/forgot-password"]')
    await page.waitForURL("/forgot-password")

    // Verify we're on forgot password page
    expect(page.url()).toContain("/forgot-password")

    console.log("Forgot password navigation test completed")
  })
})
