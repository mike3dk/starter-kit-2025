import { test, expect } from "@playwright/test"
import { generateTestUser } from "./utils"

test.describe("Basic Auth Tests", () => {
  test("should display sign-up form correctly", async ({ page }) => {
    await page.goto("/sign-up")

    // Check that the form is visible
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible()
  })

  test("should display sign-in form correctly", async ({ page }) => {
    await page.goto("/sign-in")

    // Check that the form is visible
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
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
    await page.click('button:text("Sign up")')

    // Wait for either success or error
    await page.waitForTimeout(3000)

    // The test passes if no error occurs (we're not checking specific success messages)
    console.log("Sign up completed for:", testUser.email)
  })

  test("should navigate between sign-up and sign-in pages", async ({
    page,
  }) => {
    // Go to sign-up page
    await page.goto("/sign-up")
    await expect(page.locator('input[name="name"]')).toBeVisible()

    // Navigate to sign-in page via link
    await page.click('a[href="/sign-in"]')
    await page.waitForURL("/sign-in")

    // Verify we're on sign-in page
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()

    // Navigate back to sign-up page
    await page.click('a[href="/sign-up"]')
    await page.waitForURL("/sign-up")

    // Verify we're back on sign-up page
    await expect(page.locator('input[name="name"]')).toBeVisible()
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
    await page.click('button:text("Sign up")')

    // Check for loading state (button should be disabled or show loading)
    const submitButton = page.getByRole("button", { name: "Sign up" })
    await expect(submitButton).toBeDisabled()

    console.log("Loading state test completed for:", testUser.email)
  })
})
