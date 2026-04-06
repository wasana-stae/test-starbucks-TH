import { test, expect, Page } from '@playwright/test';

test('Starbucks Menu - Perfect Scroll without Resize Artifacts', async ({ page }) => {
    // 1. เพิ่มเวลา Timeout สำหรับการโหลดรูปจำนวนมาก
    test.setTimeout(240000);

    // 2. บังคับขนาดหน้าจอมาตรฐาน 1920 เพื่อให้แสดงผลเต็มหน้า (ไม่มีแถบเทาด้านข้าง)
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 3. ไปที่หน้าเมนู
    await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });
    console.log('Page loaded. Starting smart scroll...');

    // 4. ฟังก์ชันการเลื่อน (คงเดิมเพราะถูกต้องแล้ว)
    // แต่ปรับเงื่อนไขให้ไหลลื่นรอบเดียว ไม่มีการย้อนกลับไปมา
    async function smartScroll(page: Page) {
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
        let currentPos = 0;
        const step = 600; // เลื่อนทีละ 600px

        while (currentPos < bodyHeight) {
            currentPos += step;
            await page.mouse.wheel(0, step); 
            
            // แช่รอเพื่อให้ระบบ Lazy Load เปลี่ยนภาพเทาเป็นรูปสินค้า
            await page.waitForTimeout(1500); 

            // ตรวจสอบความสูงเผื่อเว็บโหลดของเพิ่ม
            const newHeight = await page.evaluate(() => document.body.scrollHeight);
            if (currentPos > newHeight) break;
        }
    }

    // สั่งเริ่มเลื่อนจนจบหน้า
    await smartScroll(page);

    // 5. รอ Network นิ่งสนิทครั้งสุดท้าย
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); 

    // 6. --- ส่วนที่แก้ไข: ตัดการ Resize และ Scroll ซ้ำออก ---
    // ถ่ายรูปหน้าจอแบบ Full Page ทันที
    // การใช้ fullPage: true ตรงนี้จะทำให้ไฟล์รูปยาวสวยงาม 
    // และวิดีโอจะตัดจบที่ตำแหน่ง Footer โดยไม่หดแว็บกลับไปมาครับ
    const screenshotPath = `test-results/starbucks-perfect-scroll.png`;
    await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
    });

    console.log(`✅ Done! Screenshot saved at: ${screenshotPath}`);
});