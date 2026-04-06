import { test, expect, Page } from '@playwright/test';

test('Test Starbucks Menu - Full Clear Version', async ({ page }) => {
    // 1. เพิ่มเวลา Timeout ให้เหลือเฟือ
    test.setTimeout(240000);

    // 2. บังคับขนาดหน้าจอมาตรฐาน 1920x1080 (Desktop Full HD)
    // วิธีนี้จะแก้ปัญหา "แถบสีเทาด้านข้าง" เพราะบอทจะเปิดหน้ากว้างสุด
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 3. ไปที่หน้าเมนู
    await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });
    console.log('Page loaded. Starting smart scroll...');

    // 4. ฟังก์ชันการเลื่อนที่ถูกต้องของคุณ (ปรับให้นิ่งขึ้น)
    async function smartScroll(page: Page) {
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
        let currentPos = 0;
        const step = 600; // เลื่อนทีละ 600px

        while (currentPos < bodyHeight) {
            currentPos += step;
            await page.mouse.wheel(0, step); // ใช้ mouse wheel เพื่อความสมูท
            
            // **จุดสำคัญ:** รอ 1.5 วินาทีเพื่อให้ระบบ Lazy Load เปลี่ยนกล่องเทาเป็นรูป
            await page.waitForTimeout(1500); 

            // เทคนิคพิเศษ: เลื่อนขึ้นนิดนึงแล้วลงใหม่ เพื่อ "สะกิด" ให้รูปที่ค้างอยู่โหลด
            await page.mouse.wheel(0, -100);
            await page.waitForTimeout(100);
            await page.mouse.wheel(0, 100);
        }
    }

    await smartScroll(page);

    // 5. เก็บตก: บังคับให้ Browser เข้าใจว่า "เห็นรูปครบแล้ว"
    console.log('Final verification for images...');
    const images = page.locator('main img');
    const count = await images.count();
    
    // สะกิดรูปภาพท้ายหน้าจออีกครั้ง
    for (let i = Math.max(0, count - 10); i < count; i++) {
        await images.nth(i).scrollIntoViewIfNeeded().catch(() => {});
    }

    // 6. รอให้นิ่งสนิทจริงๆ
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000); 

    // 7. ถ่ายรูปหน้าจอ (Full Page)
    const screenshotPath = `test-results/starbucks-final-perfect.png`;
    await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true // ต่อภาพยาวๆ ให้อัตโนมัติ
    });

    console.log(`✅ Done! Check your full image at: ${screenshotPath}`);
});