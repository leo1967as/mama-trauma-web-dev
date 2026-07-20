import os

from playwright.sync_api import sync_playwright


SEED = """
const birth = new Date();
birth.setDate(birth.getDate() - 7);
const ymd = `${birth.getFullYear()}-${String(birth.getMonth() + 1).padStart(2, '0')}-${String(birth.getDate()).padStart(2, '0')}`;
localStorage.setItem('afterbloom_onboarding', JSON.stringify({ complete: true, mother_name: 'QA', baby_birth_date: ymd }));
localStorage.setItem('afterbloom_epds_history', '[]');
localStorage.setItem('afterbloom_lang', 'th');
localStorage.setItem('afterbloom_device_id', 'device-care-journey-qa');
localStorage.setItem('afterbloom_active_uid', 'device-care-journey-qa');
"""
BASE_URL = os.environ.get("AFTERBLOOM_BASE_URL", "http://127.0.0.1:4180")


def open_journey(browser, width, height):
    context = browser.new_context(viewport={"width": width, "height": height})
    context.add_init_script(SEED)
    page = context.new_page()
    page.goto(BASE_URL, wait_until="networkidle")
    page.wait_for_timeout(500)
    for label in ["หน้าแรก", "เช็กอิน", "เส้นทางดูแล", "วงดูแลใจ", "EPDS", "โปรไฟล์"]:
        assert page.get_by_role("button", name=label, exact=True).first.is_visible(), label
    page.get_by_role("button", name="เส้นทางดูแล", exact=True).click()
    page.wait_for_function("document.querySelectorAll('button[aria-expanded]').length >= 8")
    assert "1323" in page.locator("footer").inner_text()
    assert "แหล่งอ้างอิง" not in page.locator("body").inner_text()
    return context, page


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    mobile_context, mobile = open_journey(browser, 390, 844)
    assert mobile.get_by_role("heading", level=1).is_visible()
    mobile.get_by_role("button", name="💗 ขอความช่วยเหลือ").first.click()
    assert mobile.get_by_role("dialog", name="I Need Help").is_visible()
    mobile.keyboard.press("Escape")
    mobile.get_by_role("button", name="โปรไฟล์", exact=True).last.click()
    mobile.get_by_role("button", name="English").click()
    mobile.get_by_role("button", name="Journey").click()
    assert mobile.get_by_role("heading", level=1).is_visible()
    assert "Sources" not in mobile.locator("body").inner_text()
    mobile_context.close()

    desktop_context, _ = open_journey(browser, 1280, 900)
    desktop_context.close()
    browser.close()

print("Care Journey Playwright QA passed at 390px and 1280px")
