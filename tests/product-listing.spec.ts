import { test, expect } from '@playwright/test';

test('Fix Grey Sidebar and Full Page Screenshot', async ({ page }) => {
    test.setTimeout(180000);

    // 1. ตั้ง Viewport ให้กว้างมาตรฐาน (เช่น 1920) เพื่อลดโอกาสเกิดแถบข้าง
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });

    // 2. ขั้นตอนการ Scroll (ใช้แบบที่เราคุยกันว่าสำเร็จ)
    console.log('Scrolling to trigger images...');
    for (let i = 0; i < 15; i++) {
        await page.mouse.wheel(0, 1000);
        await page.waitForTimeout(800);
    }

    // 3. --- ไม้ตายแก้แถบสีเทา: บังคับให้บอทคำนวณขนาดหน้าจอใหม่ ---
    console.log('Resizing viewport to match content...');
    const width = 1920;
    const height = await page.evaluate(() => {
        return Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
    });
    
    // ปรับขนาดหน้าจอให้เท่ากับความสูงจริงของหน้าเว็บทั้งหมดก่อนถ่าย
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(1000); // รอให้ระบบ UI ปรับตัวตามขนาดใหม่

    // 4. ถ่ายรูปหน้าจอ (ตอนนี้ไม่ต้องใช้ fullPage: true แล้ว เพราะเราขยาย Viewport คลุมทั้งหน้าไปแล้ว)
    const screenshotPath = `test-results/starbucks-full-clean.png`;
    await page.screenshot({ 
        path: screenshotPath, 
        fullPage: false // ใช้ false เพราะเราตั้ง height ไว้ครอบคลุมแล้ว
    });

    console.log(`✅ Success! Screenshot is full and clean at: ${screenshotPath}`);
});