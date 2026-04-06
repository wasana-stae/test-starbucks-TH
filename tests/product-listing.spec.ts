import { test, expect } from '@playwright/test';

test('Test Scroll Menu - Human Version', async ({ page }) => {
    test.setTimeout(240000); // เพิ่มเวลาเป็น 4 นาทีสำหรับรูปเยอะๆ

    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });

    console.log('Starting Human-like scroll...');

    // 1. ค่อยๆ ไถหน้าจอลงแบบ Random จังหวะ (เหมือนคนเลื่อนดูเมนูจริงๆ)
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    let currentPos = 0;
    
    while (currentPos < bodyHeight) {
        // แรนดอมระยะเลื่อน 300 - 600px เพื่อให้ระบบ Lazy Load ตื่นตัว
        const step = Math.floor(Math.random() * (600 - 300 + 1) + 300);
        currentPos += step;
        
        await page.mouse.wheel(0, step);
        
        // แรนดอมเวลารอ 0.5 - 1.2 วินาที
        const waitTime = Math.floor(Math.random() * (1200 - 500 + 1) + 500);
        await page.waitForTimeout(waitTime);
        
        // อัปเดตความสูงเผื่อของโหลดเพิ่ม
        const dynamicHeight = await page.evaluate(() => document.body.scrollHeight);
        if (currentPos > dynamicHeight) break;
    }

    // 2. บังคับโหลดภาพที่อาจตกหล่นด้วยการสั่ง Scroll ทีละกล่อง
    console.log('Verifying all product cards...');
    const cards = page.locator('.product-item, .card, img[loading="lazy"]');
    const count = await cards.count();
    
    // สุ่มเช็กภาพเป็นระยะๆ เพื่อประหยัดเวลาแต่ภาพมาครบ
    for (let i = 0; i < count; i += 3) {
        await cards.nth(i).scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(100);
    }

    // 3. ทริคสำคัญ: เลื่อนขึ้นไปนิดนึงแล้วลงไปใหม่ (สะกิด UI)
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, 500);

    // 4. รอ Network และภาพนิ่งจริงๆ
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000); 

    // 5. ถ่ายรูปหน้าจอ
    const screenshotPath = `test-results/starbucks-final-success.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`✅ Completed! Images should be fully loaded now.`);
});