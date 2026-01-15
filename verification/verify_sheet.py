from playwright.sync_api import sync_playwright, expect

def test_sheet_overlay(page):
    # 1. Arrange: Go to the admin app.
    page.goto("http://localhost:3001")

    # Set viewport to mobile to trigger the mobile header
    page.set_viewport_size({"width": 375, "height": 667})

    # 2. Act: Find the menu button and click it.
    # The button has sr-only "Toggle navigation menu"
    menu_button = page.get_by_role("button", name="Toggle navigation menu")

    # Wait for button to be visible
    expect(menu_button).to_be_visible()
    menu_button.click()

    # 3. Assert: Wait for the Sheet to open.
    # The SheetContent has "Admin Console" text inside the Sidebar which is inside the Sheet.
    # Or we can look for the close button.
    # We want to capture the overlay style.

    # Wait for a bit for animation
    page.wait_for_timeout(1000)

    # 4. Screenshot
    page.screenshot(path="verification/sheet_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_sheet_overlay(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
