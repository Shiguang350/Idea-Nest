const STYLE_HINT = '清新自然的插画风格，简洁，高完成度';

export async function onRequestPost(context) {
  const env = context.env || {};
  const IMAGE_API_BASE = env.IMAGE_API_BASE || 'https://image.pollinations.ai';

  try {
    const body = await context.request.json();
    const title = String(body.title || '').trim();
    const content = String(body.content || '').trim();
    const rawPrompt = `${title} ${content}`.trim();

    if (!rawPrompt) {
      return jsonResponse({ error: '缺少想法标题或内容' }, 400);
    }

    const prompt = `${rawPrompt.slice(0, 500)}，${STYLE_HINT}`;
    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const seed = Math.floor(Math.random() * 2147483646) + 1;
        const url = `${IMAGE_API_BASE}/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;
        const response = await fetch(url, { signal: timeoutSignal(90000) });

        if (!response.ok) {
          lastError = new Error(`图像生成服务返回 ${response.status}`);
          await sleep(1500 * attempt);
          continue;
        }

        const buffer = await response.arrayBuffer();
        if (!buffer.byteLength) {
          lastError = new Error('图像生成服务返回空内容');
          await sleep(1500 * attempt);
          continue;
        }

        return jsonResponse({
          imageBase64: arrayBufferToBase64(buffer),
          mimeType: response.headers.get('content-type') || 'image/jpeg',
        }, 200);
      } catch (e) {
        lastError = e;
        await sleep(1500 * attempt);
      }
    }

    return jsonResponse({ error: lastError ? lastError.message : '图像生成失败' }, 502);
  } catch (e) {
    return jsonResponse({ error: e.message || '图像生成失败' }, 500);
  }
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function timeoutSignal(ms) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}
