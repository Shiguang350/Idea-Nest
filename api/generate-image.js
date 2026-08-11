const IMAGE_API_BASE = process.env.IMAGE_API_BASE || 'https://image.pollinations.ai';
const STYLE_HINT = '清新自然的插画风格，简洁，高完成度';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: '仅支持 POST 请求' });
    return;
  }

  try {
    const rawBody = typeof req.body === 'string' ? req.body.replace(/^\uFEFF/, '') : req.body;
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : (rawBody || {});
    const title = String(body.title || '').trim();
    const content = String(body.content || '').trim();
    const rawPrompt = `${title} ${content}`.trim();

    if (!rawPrompt) {
      res.status(400).json({ error: '缺少想法标题或内容' });
      return;
    }

    const prompt = `${rawPrompt.slice(0, 500)}，${STYLE_HINT}`;
    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const seed = Math.floor(Math.random() * 2147483646) + 1;
        const url = `${IMAGE_API_BASE}/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;
        const response = await fetch(url, { signal: AbortSignal.timeout(90000) });

        if (!response.ok) {
          lastError = new Error(`图像生成服务返回 ${response.status}`);
          await sleep(1500 * attempt);
          continue;
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length === 0) {
          lastError = new Error('图像生成服务返回空内容');
          await sleep(1500 * attempt);
          continue;
        }

        const mimeType = response.headers.get('content-type') || 'image/jpeg';
        res.status(200).json({
          imageBase64: buffer.toString('base64'),
          mimeType,
        });
        return;
      } catch (e) {
        lastError = e;
        await sleep(1500 * attempt);
      }
    }

    res.status(502).json({ error: lastError ? lastError.message : '图像生成失败' });
  } catch (e) {
    res.status(500).json({ error: e.message || '图像生成失败' });
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
