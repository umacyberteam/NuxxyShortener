const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Bikin folder buat nyimpen link
if (!fs.existsSync('links')) fs.mkdirSync('links');

// Halaman utama - TAMPILAN WEBSITE KEREN
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuxxy Shortener</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Arial', sans-serif; }
        body { 
          background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
        }
        h1 {
          color: #fff;
          font-size: 28px;
          text-align: center;
          margin-bottom: 10px;
        }
        h1 span { color: #ff6b6b; }
        p {
          color: #aaa;
          text-align: center;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        input[type="url"] {
          padding: 15px 20px;
          border-radius: 12px;
          border: none;
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-size: 16px;
          outline: none;
          transition: 0.3s;
        }
        input[type="url"]:focus {
          background: rgba(255,255,255,0.2);
          box-shadow: 0 0 20px rgba(255,107,107,0.3);
        }
        input[type="url"]::placeholder {
          color: #888;
        }
        button {
          padding: 15px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }
        button:hover {
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(255,107,107,0.5);
        }
        .result {
          margin-top: 25px;
          padding: 15px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          text-align: center;
          display: none;
        }
        .result a {
          color: #ff6b6b;
          font-size: 18px;
          word-break: break-all;
          text-decoration: none;
        }
        .result a:hover {
          text-decoration: underline;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔗 Nuxxy <span>Shortener</span></h1>
        <p>Pendekin link panjang jadi pendek!</p>
        <form method="POST" class="input-group">
          <input type="url" name="url" placeholder="https://contoh.com/..." required>
          <button type="submit">🚀 Pendekkan!</button>
        </form>
        <div class="result" id="result"></div>
        <div class="footer">Powered by Random Anime Lovers©</div>
      </div>
      <script>
        const urlParams = new URLSearchParams(window.location.search);
        const short = urlParams.get('short');
        if(short) {
          document.getElementById('result').innerHTML = 
            '<a href="' + short + '" target="_blank">' + short + '</a>';
          document.getElementById('result').style.display = 'block';
        }
      </script>
    </body>
    </html>
  `);
});

// Proses shorten
app.post('/', (req, res) => {
  const url = req.body.url;
  const kode = Date.now().toString(36);
  fs.writeFileSync(`links/${kode}.txt`, url);
  const short = `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost'}/${kode}`;
  res.redirect(`/?short=${encodeURIComponent(short)}`);
});

// Redirect
app.get('/:kode', (req, res) => {
  const kode = req.params.kode;
  try {
    const url = fs.readFileSync(`links/${kode}.txt`, 'utf8');
    res.redirect(url);
  } catch {
    res.send('<h2>Link Tidak Ada</h2>');
  }
});

app.listen(3000, () => console.log('Web jalan di port 3000'));