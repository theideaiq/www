from playwright.sync_api import sync_playwright

def verify_button():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # ID pattern: component-title-slug--story-name-slug
        # Title: UI/Button -> ui-button
        # Story: Primary -> primary
        url = "http://localhost:6006/iframe.html?id=ui-button--primary&viewMode=story"
        print(f"Navigating to {url}")
        page.goto(url)

        # Wait for button
        # It should say "Primary Button" based on args
        button = page.get_by_role("button", name="Primary Button")
        button.wait_for()

        # Screenshot
        page.screenshot(path="verification/button.png")
        print("Screenshot saved to verification/button.png")
        browser.close()

if __name__ == "__main__":
    verify_button()
