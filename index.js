export default {
  async fetch(request) {
    const { searchParams } = new URL(request.url);

    if (request.method === 'POST') {
      const formData = await request.formData();
      const address = formData.get('address');

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return new Response(renderPage('❌ Invalid EVM address', '', '', address), {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      try {
        // 1️⃣ Get live mining info
        const liveRes = await fetch('https://api.v2.netrumlabs.com/api/node/mining/live-log/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodeAddress: address }),
        });

        const liveData = await liveRes.json();

        let liveStatus = '';
        if (!liveData.success || !liveData.liveInfo) {
          liveStatus = `❌ API Error: ${liveData.error || liveData.message}`;
        } else {
          const info = liveData.liveInfo;
          liveStatus = [
            `Avail to claim: ${formatTokens(info.minedTokens)} NPT`,
            `Speed: ${formatTokens(info.speedPerSec)}/s`
          ].join(' | ');
        }

        // 2️⃣ Check mining activity via /claim minedTokens delta
        const beforeRes = await fetch('https://api.v2.netrumlabs.com/api/node/mining/claim/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodeAddress: address }),
        });
        const beforeData = await beforeRes.json();
        const before = BigInt(beforeData?.claimData?.minedTokens || '0');

        await new Promise(r => setTimeout(r, 30000));

        const afterRes = await fetch('https://api.v2.netrumlabs.com/api/node/mining/claim/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodeAddress: address }),
        });
        const afterData = await afterRes.json();
        const after = BigInt(afterData?.claimData?.minedTokens || '0');

        const isMining = after > before;
        const miningFlag = isMining.toString();

        // ✅ Render both results
        return new Response(renderPage(liveStatus, miningFlag, address), {
          headers: { 'Content-Type': 'text/html' },
        });

      } catch (err) {
        return new Response(renderPage(`❌ Error: ${err.message}`, '', '', address), {
          headers: { 'Content-Type': 'text/html' },
        });
      }
    }

    // Default GET page
    return new Response(renderPage('', '', ''), {
      headers: { 'Content-Type': 'text/html' },
    });
  },
};

function renderPage(liveStatus, miningFlag, address) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Netrum Mining Monitor</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 2rem;
      max-width: 700px;
      margin: auto;
    }
    input[type="text"] {
      width: 100%;
      padding: 0.5rem;
      font-size: 1rem;
    }
    button {
      margin-top: 1rem;
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
    }
    .status {
      margin-top: 2rem;
      font-family: monospace;
      font-size: 1.2rem;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <h1>📡 Netrum Node Mining Monitor</h1>
  <p style="color: orange; font-weight: bold;">
  ⏳ Please wait ~30 seconds after submitting. The data may take some time to load.
</p>
  <form method="POST">
    <label for="address">Enter your EVM node address:</label><br />
    <input type="text" id="address" name="address" required value="${address || ''}" />
    <button type="submit">Check Mining</button>
  </form>

  <div class="status">
  ${(liveStatus || miningFlag !== '') ? `
  📊 <b>Mining Status:</b><br/>
  ${liveStatus ? `${liveStatus}<br/><br/>` : ''}
  ⛏ <b>Mining Activity:</b> ${miningFlag ? 'active' : 'stopped'}
  ` : ''}
</div>
</body>
</html>
`;
}

function formatTime(seconds = 0) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

function formatTokens(wei = '0') {
  return (Number(wei) / 1e18).toFixed(6);
}
