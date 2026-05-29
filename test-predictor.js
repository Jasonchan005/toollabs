const { chromium } = require('playwright');
let pass = 0, fail = 0;
const t = async (name, fn) => { try { await fn(); console.log('  ✅ ' + name); pass++; } catch(e) { console.log('  ❌ ' + name + ': ' + e.message); fail++; } };

(async () => {
  const browser = await chromium.launch({ headless: true, proxy: { server: 'http://127.0.0.1:27580' } });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);

  console.log('=== Predictor 功能测试 ===\n');

  await t('页面加载', async () => {
    const r = await page.goto('https://predictor.vercel.app/', { waitUntil: 'networkidle' });
    if (r.status() !== 200) throw new Error('HTTP ' + r.status());
  });

  await t('标题正确', async () => {
    const title = await page.title();
    if (!title.includes('Prediction Simulator')) throw new Error('Wrong: ' + title);
    console.log('  标题: ' + title.substring(0, 60));
  });

  await t('GA 存在', async () => {
    const el = await page.$('script[src*="googletagmanager"]');
    if (!el) throw new Error('GA missing');
  });

  await t('场景按钮存在', async () => {
    const btns = await page.$$('.scenario-btn');
    if (btns.length < 4) throw new Error('Only ' + btns.length + ' scenarios');
    console.log('  场景数: ' + btns.length);
  });

  await t('模拟按钮存在', async () => {
    const btn = await page.$('#simBtn');
    if (!btn) throw new Error('Sim btn missing');
  });

  await t('人口滑块可调', async () => {
    const slider = await page.$('#popSlider');
    if (!slider) throw new Error('Slider missing');
    const val = await slider.getAttribute('value');
    console.log('  默认人口: ' + val);
  });

  await t('运行模拟 (Product Launch)', async () => {
    await page.click('#simBtn');
    await page.waitForTimeout(2000);
    // Check result screen appeared
    const resultTitle = await page.$('#resultTitle');
    if (!resultTitle) throw new Error('Result not shown');
    const text = await resultTitle.textContent();
    console.log('  结果标题: ' + text);
  });

  await t('结果显示图表', async () => {
    const canvas = await page.$('#resultChart');
    if (!canvas) throw new Error('Chart missing');
  });

  await t('结果显示百分比', async () => {
    const pos = await page.$eval('#rPositive', el => el.textContent);
    const neg = await page.$eval('#rNegative', el => el.textContent);
    console.log('  正面: ' + pos.trim() + ' | 负面: ' + neg.trim());
    if (!pos.includes('%')) throw new Error('No percentage');
  });

  await t('详情条形图存在', async () => {
    const bars = await page.$$('.detail-bar');
    if (bars.length < 3) throw new Error('Only ' + bars.length + ' detail bars');
    console.log('  详情分组: ' + bars.length);
  });

  await t('切换场景 (PR Crisis)', async () => {
    await page.click('#newBtn');
    await page.waitForTimeout(500);
    const setup = await page.$('#setupScreen');
    if (!setup) throw new Error('Setup not showing');
    // Click PR Crisis
    const crisisBtn = await page.evaluate(() => {
      const btns = document.querySelectorAll('.scenario-btn');
      for (const b of btns) { if (b.textContent.includes('Crisis')) { b.click(); return true; } }
      return false;
    });
    if (!crisisBtn) throw new Error('Crisis btn not found');
    await page.waitForTimeout(300);
    await page.click('#simBtn');
    await page.waitForTimeout(2000);
    const title2 = await page.$eval('#resultTitle', el => el.textContent);
    if (!title2.includes('Crisis')) throw new Error('Wrong scenario: ' + title2);
    console.log('  场景切换: ' + title2);
  });

  await t('切换人口到5000', async () => {
    await page.click('#newBtn');
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const slider = document.getElementById('popSlider');
      slider.value = '5000';
      slider.dispatchEvent(new Event('input'));
    });
    await page.waitForTimeout(300);
    const val = await page.$eval('#popVal', el => el.textContent);
    if (val !== '5,000') throw new Error('Wrong pop: ' + val);
    console.log('  人口: ' + val);
    await page.click('#simBtn');
    await page.waitForTimeout(2000);
    const pos2 = await page.$eval('#rPositive', el => el.textContent);
    console.log('  5000人模拟结果: 正面 ' + pos2.trim());
  });

  await t('分享按钮存在', async () => {
    const btn = await page.$('#shareBtn');
    if (!btn) throw new Error('Share btn missing');
  });

  await browser.close();
  console.log('\n========== 结果 ==========');
  console.log('通过: ' + pass + ' / ' + (pass+fail));
  if (fail === 0) console.log('🎉 全部通过！');
  else console.log('⚠️ ' + fail + ' 失败');
})();
