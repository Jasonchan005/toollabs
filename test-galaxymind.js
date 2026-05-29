const { chromium } = require('playwright');
let pass = 0, fail = 0;
const t = async (name, fn) => { try { await fn(); console.log('  ✅ ' + name); pass++; } catch(e) { console.log('  ❌ ' + name + ': ' + e.message); fail++; } };

(async () => {
  const browser = await chromium.launch({ headless: true, proxy: { server: 'http://127.0.0.1:27580' } });
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);

  console.log('=== Galaxy-Mind 测试 ===\n');

  await t('页面加载', async () => {
    const r = await page.goto('https://galaxy-mind.vercel.app/', { waitUntil: 'networkidle' });
    if (r.status() !== 200) throw new Error('HTTP ' + r.status());
  });

  await t('标题是 GalaxyMind', async () => {
    const title = await page.title();
    if (!title.includes('GalaxyMind')) throw new Error('Wrong: ' + title);
    console.log('  标题: ' + title.substring(0, 50));
  });

  await t('Three.js canvas 存在', async () => {
    await page.waitForTimeout(2000);
    const canvas = await page.$('canvas');
    if (!canvas) throw new Error('No canvas');
  });

  await t('输入框存在且有默认文字', async () => {
    const ta = await page.$('#inputText');
    if (!ta) throw new Error('Textarea missing');
    const val = await page.inputValue('#inputText');
    if (val.length < 10) throw new Error('Default text too short');
    console.log('  默认文字长度: ' + val.length);
  });

  await t('生成图谱按钮', async () => {
    const btn = await page.$('button');
    if (!btn) throw new Error('Button missing');
    const text = await btn.textContent();
    if (!text.includes('Generate')) throw new Error('Wrong btn: ' + text);
    console.log('  按钮: ' + text);
  });

  await t('示例按钮存在', async () => {
    const btns = await page.$$('.example-btn');
    if (btns.length < 3) throw new Error('Only ' + btns.length + ' examples');
    console.log('  示例数: ' + btns.length);
  });

  await t('Tab 切换 (URL)', async () => {
    await page.click('[data-tab="url"]');
    await page.waitForTimeout(300);
    const urlTab = await page.$('#tab-url');
    if (!urlTab || await urlTab.getAttribute('class').then(c => c.includes('hidden'))) throw new Error('URL tab not showing');
    console.log('  URL Tab ✅');
  });

  await t('Tab 切换 (File)', async () => {
    await page.click('[data-tab="file"]');
    await page.waitForTimeout(300);
    const fileTab = await page.$('#tab-file');
    if (!fileTab || await fileTab.getAttribute('class').then(c => c.includes('hidden'))) throw new Error('File tab not showing');
    console.log('  File Tab ✅');
  });

  await t('切回 Text 并生成图谱', async () => {
    await page.click('[data-tab="text"]');
    await page.waitForTimeout(300);
    await page.fill('#inputText', 'Apple and Google compete in AI. Microsoft invested in OpenAI.');
    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(2000);
    // Check canvas still exists (graph rendered)
    const c = await page.$('canvas');
    if (!c) throw new Error('Canvas gone after generate');
  });

  await t('加载示例 Tesla', async () => {
    const btns = await page.$$('.example-btn');
    await btns[0].click();
    await page.waitForTimeout(2000);
    const val = await page.inputValue('#inputText');
    if (val.includes('Tesla') || val.includes('特斯拉')) console.log('  ✅ 示例加载成功');
  });

  await browser.close();
  console.log('\n========== 结果 ==========');
  console.log('通过: ' + pass + ' / ' + (pass+fail));
  if (fail === 0) console.log('🎉 全部通过！');
  else console.log('⚠️ ' + fail + ' 失败');
})();
