import { test, expect } from "@playwright/test"
import {
  generateTestUser,
  fillSignUpForm,
  navigateToSignUp,
  waitForFormSubmission,
  checkForErrors,
  checkForSuccess,
  cleanupTestUser,
} from "./utils"

test.describe("User Sign Up", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sign-up page before each test
    await navigateToSignUp(page)
  })

  test("should display sign-up form correctly", async ({ page }) => {
    // Check that all form elements are visible
    await expect(page.locator("text=Create Account")).toBeVisible()
    await expect(page.getByLabel("Name")).toBeVisible()
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password")).toBeVisible()
    await expect(page.getByLabel("Confirmpassword")).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible()

    // Check for link to sign-in page
    await expect(page.locator('a[href="/sign-in"]')).toBeVisible()
    await expect(
      page.locator("text=Already have an account? Sign in")
    ).toBeVisible()
  })

  test("should successfully sign up a new user", async ({ page }) => {
    const testUser = generateTestUser()

    // Fill out the form
    await fillSignUpForm(page, testUser)

    // Submit the form
    await page.getByRole("button", { name: "Sign up" }).click()

    // Wait for submission to complete
    await waitForFormSubmission(page)

    // Check for success message or redirect
    const hasSuccess = await checkForSuccess(
      page,
      "Your account has been created"
    )
    expect(hasSuccess).toBe(true)

    // Cleanup
    await cleanupTestUser(testUser.email)
  })

  test("should show validation errors for empty fields", async ({ page }) => {
    // Try to submit empty form
    await page.getByRole("button", { name: "Sign up" }).click()

    // Check for validation errors
    await expect(
      page.locator("text=Name must be at least 2 characters long")
    ).toBeVisible()
    await expect(
      page.locator("text=Please enter a valid email address")
    ).toBeVisible()
    await expect(
      page.locator("text=Password must be at least 8 characters long")
    ).toBeVisible()
  })

  test("should show validation error for invalid email", async ({ page }) => {
    const testUser = generateTestUser()
    testUser.email = "invalid-email"

    await fillSignUpForm(page, testUser)
    await page.getByRole("button", { name: "Sign up" }).click()

    // Check for email validation error
    await expect(
      page.locator("text=Please enter a valid email address")
    ).toBeVisible()
  })

  test("should show validation error for short password", async ({ page }) => {
    const testUser = generateTestUser()
    testUser.password = "123"

    await fillSignUpForm(page, testUser)
    await page.getByRole("button", { name: "Sign up" }).click()

    // Check for password validation error
    await expect(
      page.locator("text=Password must be at least 8 characters long")
    ).toBeVisible()
  })

  test("should show validation error for mismatched passwords", async ({
    page,
  }) => {
    const testUser = generateTestUser()

    // Fill form with mismatched passwords
    await page.fill('input[type="text"]', testUser.name)
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]:nth-of-type(1)', testUser.password)
    await page.fill(
      'input[type="password"]:nth-of-type(2)',
      "DifferentPassword123!"
    )

    await page.getByRole("button", { name: "Sign up" }).click()

    // Check for password mismatch error
    await expect(page.locator("text=Passwords don't match")).toBeVisible()
  })

  test("should show validation error for short name", async ({ page }) => {
    const testUser = generateTestUser()
    testUser.name = "A"

    await fillSignUpForm(page, testUser)
    await page.getByRole("button", { name: "Sign up" }).click()

    // Check for name validation error
    await expect(
      page.locator("text=Name must be at least 2 characters long")
    ).toBeVisible()
  })

  test("should show error for duplicate email", async ({ page }) => {
    const testUser = generateTestUser()

    // First signup
    await fillSignUpForm(page, testUser)
    await page.getByRole("button", { name: "Sign up" }).click()
    await waitForFormSubmission(page)

    // Navigate back to sign-up
    await navigateToSignUp(page)

    // Try to sign up with same email
    await fillSignUpForm(page, testUser)
    await page.getByRole("button", { name: "Sign up" }).click()

    // Check for duplicate email error
    const hasError = await checkForErrors(page, "already exists")
    expect(hasError).toBe(true)

    // Cleanup
    await cleanupTestUser(testUser.email)
  })

  test("should navigate to sign-in page when clicking sign-in link", async ({
    page,
  }) => {
    await page.locator('a[href="/sign-in"]').click()

    // Verify navigation to sign-in page
    await expect(page.locator("text=Sign In")).toBeVisible()
    expect(page.url()).toContain("/sign-in")
  })

  test("should disable submit button during form submission", async ({
    page,
  }) => {
    const testUser = generateTestUser()

    await fillSignUpForm(page, testUser)

    // Click submit button
    const submitButton = page.getByRole("button", { name: "Sign up" })
    await submitButton.click()

    // Check that button is disabled during submission
    await expect(submitButton).toBeDisabled()

    // Wait for submission to complete
    await waitForFormSubmission(page)

    // Cleanup
    await cleanupTestUser(testUser.email)
  })

  test("should show loading state during form submission", async ({ page }) => {
    const testUser = generateTestUser()

    await fillSignUpForm(page, testUser)

    // Submit form
    await page.getByRole("button", { name: "Sign up" }).click()

    // Check for loading indicator (this might be a spinner or text change)
    // The LoadingButton component likely shows some loading state
    const loadingIndicator = page.locator('[data-loading="true"]')
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 })

    // Wait for submission to complete
    await waitForFormSubmission(page)

    // Cleanup
    await cleanupTestUser(testUser.email)
  })
})
