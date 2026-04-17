import { test, expect, Page } from '@playwright/test';

test('Starbucks Menu - Smooth End without Resize', async ({ page }) => {
    // 1. ตั้งค่าพื้นฐาน (เพิ่ม Timeout และขนาดจอที่กว้างเพื่อไม่มีแถบเทา)
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 2. ไปที่หน้าเมนู
    await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });
    console.log('Page loaded. Starting scroll...');

    // 3. ฟังก์ชันการเลื่อน (คงเดิมเพราะถูกต้องแล้ว)
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    let currentPos = 0;
    const step = 600; 

    while (currentPos < bodyHeight) {
        currentPos += step;
        await page.mouse.wheel(0, step); 
        
        // แช่รอเพื่อให้ Lazy Load ทำงาน (ภาพสินค้าจะปรากฏแทนสีเทา)
        await page.waitForTimeout(1500); 

        // ตรวจสอบความสูงเผื่อกรณีหน้าเว็บโหลดเนื้อหาเพิ่ม
        const dynamicHeight = await page.evaluate(() => document.body.scrollHeight);
        if (currentPos > dynamicHeight) break;
    }

    // 4. รอ Network และ UI ครั้งสุดท้ายให้ภาพนิ่งสนิท
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); 

    // 5. --- ส่วนแก้ไข: ตัดนาทีที่ 36-41 ออก (ตัดการ Resize และ Full Page ออก) ---
    // ถ่ายรูปเฉพาะหน้าจอปัจจุบัน (ตำแหน่ง Footer) 
    // การตั้ง fullPage: false จะทำให้วิดีโอไม่หดแว็บ และไม่มีการเลื่อนซ้ำ
    const screenshotPath = `test-results/starbucks-clean-end.png`;
    await page.screenshot({ 
        path: screenshotPath, 
        fullPage: false // ใช้ false เพื่อวิดีโอที่นิ่งที่สุด
    });

    console.log(`✅ Finished! Video ends smoothly at Footer without artifacts.`);
});