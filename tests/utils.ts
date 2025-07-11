import { Page, expect } from "@playwright/test"

export interface TestUser {
  name: string
  email: string
  password: string
}

// Generate unique test users to avoid conflicts
export function generateTestUser(): TestUser {
  const timestamp = Date.now()
  const randomId = Math.floor(Math.random() * 10000)

  return {
    name: `Test User ${randomId}`,
    email: `test${timestamp}${randomId}@example.com`,
    password: "TestPassword123!",
  }
}

// Clean up test user from database (helper for cleanup)
export async function cleanupTestUser(email: string) {
  // This would typically make an API call to delete the test user
  // For now, we'll rely on database resets between test runs
  console.log(`Would cleanup user: ${email}`)
}

// Fill out the sign-up form
export async function fillSignUpForm(page: Page, user: TestUser) {
  await page.fill('input[name="name"]', user.name)
  await page.fill('input[name="email"]', user.email)
  await page.fill('input[name="password"]', user.password)
  await page.fill('input[name="confirmPassword"]', user.password)
}

// Fill out the sign-in form
export async function fillSignInForm(
  page: Page,
  user: Pick<TestUser, "email" | "password">
) {
  await page.fill('input[name="email"]', user.email)
  await page.fill('input[name="password"]', user.password)
}

// Wait for navigation and verify we're on the expected page
export async function verifyNavigation(page: Page, expectedPath: string) {
  await page.waitForURL(expectedPath)
  expect(page.url()).toContain(expectedPath)
}

// Check if user is authenticated (e.g., by looking for sign-out button or user info)
export async function verifyAuthenticated(page: Page) {
  // Look for sign-out button or authenticated state indicators
  await expect(page.locator("text=Sign Out")).toBeVisible({ timeout: 10000 })
}

// Check if user is not authenticated (e.g., by looking for sign-in link)
export async function verifyNotAuthenticated(page: Page) {
  // Wait a bit for the page to load and check for unauthenticated state
  await page.waitForTimeout(1000)
  // Look for sign-in button in the auth-buttons component
  const signInButton = page.locator("text=Sign In")
  await expect(signInButton).toBeVisible({ timeout: 5000 })
}

// Navigate to sign-up page and verify it loaded
export async function navigateToSignUp(page: Page) {
  await page.goto("/sign-up")
  await expect(page.locator("text=Create Account")).toBeVisible()
}

// Navigate to sign-in page and verify it loaded
export async function navigateToSignIn(page: Page) {
  await page.goto("/sign-in")
  await expect(page.locator('input[name="email"]')).toBeVisible()
}

// Wait for form submission to complete
export async function waitForFormSubmission(page: Page) {
  // Wait for loading states to disappear
  await page.waitForSelector('[data-loading="true"]', {
    state: "hidden",
    timeout: 10000,
  })
}

// Check for error messages
export async function checkForErrors(page: Page, expectedError?: string) {
  if (expectedError) {
    await expect(page.getByText(expectedError, { exact: false })).toBeVisible({
      timeout: 5000,
    })
    return true
  } else {
    // Check for any error indicators
    const errorElements = page.locator(
      '[role="alert"], .error, .text-red-500, [data-error="true"]'
    )
    const errorCount = await errorElements.count()
    return errorCount > 0
  }
}

// Check for success messages
export async function checkForSuccess(page: Page, expectedMessage?: string) {
  if (expectedMessage) {
    await expect(page.getByText(expectedMessage, { exact: false })).toBeVisible(
      {
        timeout: 5000,
      }
    )
    return true
  } else {
    // Look for success indicators like toast messages
    const successElements = page.locator("[data-sonner-toast], .sonner-toast")
    const successCount = await successElements.count()
    return successCount > 0
  }
}
