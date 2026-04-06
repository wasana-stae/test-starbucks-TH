import { test, expect } from '@playwright/test';

test('Test Scroll Menu and Load All Images - Safe Version', async ({ page }) => {
    // 1. เพิ่มเวลา Timeout เป็น 3 นาที
    test.setTimeout(180000);

    // 2. ตั้งขนาดหน้าจอให้คงที่
    await page.setViewportSize({ width: 1280, height: 1000 });

    // 3. ไปที่หน้าเมนู
    await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });
    console.log('Page loaded.');

    // 4. วิธีแก้การเลื่อนรวน: ใช้ Mouse Wheel (เลียนแบบการใช้นิ้วถูหรือหมุนลูกกลิ้งเมาส์)
    // วิธีนี้จะนิ่งกว่าการสั่ง window.scrollTo เพราะมันเป็น Action ระดับ Browser
    console.log('Scrolling down slowly with mouse wheel...');
    for (let i = 0; i < 20; i++) {
        await page.mouse.wheel(0, 800); // เลื่อนลงทีละ 800px
        await page.waitForTimeout(1000); // หยุดรอ 1 วินาทีเต็มๆ ให้รูปโหลด
    }

    // 5. วิธีแก้ภาพสีเทา: วนลูปเฉพาะ "กล่องสินค้า" แล้วสะกิดทีละอัน
    console.log('Checking each product item to trigger images...');
    
    // หา 'div' หรือ 'section' ที่ห่อหุ้มสินค้าแต่ละตัว (มักจะได้ผลดีกว่า img ตรงๆ)
    const productItems = page.locator('.product-item, .product-card, main img'); 
    const count = await productItems.count();

    for (let i = 0; i < count; i += 2) { // เลื่อนทีละ 2 รูปเพื่อความเร็วแต่ยังนิ่งอยู่
        const item = productItems.nth(i);
        
        // เลื่อนให้มาอยู่บนหน้าจอ
        await item.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
        
        // ถ้าเลื่อนมาแล้วยังไม่ขึ้น ให้ "แช่" รออีกนิด
        await page.waitForTimeout(200); 
    }

    // 6. เลื่อนกลับไปบนสุดแล้วลงมาล่างสุดอีกรอบแบบช้าๆ เพื่อเก็บตก
    await page.keyboard.press('Home');
    await page.waitForTimeout(1000);
    await page.keyboard.press('End');
    await page.waitForTimeout(3000); // รอให้นิ่งสนิทจริงๆ

    // 7. ถ่ายรูปหน้าจอ
    const screenshotPath = `test-results/starbucks-final-fix.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`✅ Finished! Screenshot saved at: ${screenshotPath}`);
});