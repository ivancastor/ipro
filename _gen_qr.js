const fs = require('fs');
fetch('https://evolution.cosmosomsoc.lat/instance/connect/sv%20distribuidora', {
  headers: { 'apikey': 'D3CAE83B749A-4871-AD6A-52D92D228C46' }
})
.then(r => r.json())
.then(d => {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Conectar WhatsApp - iPro</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 40px; background: #f5f5f5; }
    img { border: 3px solid #1a6cff; border-radius: 12px; width: 300px; height: 300px; }
    h2 { color: #1a1a1a; }
    p { color: #555; max-width: 440px; margin: 10px auto; }
    .box { background: #fff; border-radius: 12px; padding: 20px; max-width: 440px; margin: 20px auto; text-align: left; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
    li { margin: 8px 0; font-size: 14px; }
  </style>
</head>
<body>
  <h2>Conectar WhatsApp - iPro</h2>
  <p>Escaneie com o numero <b>(11) 97260-4416</b></p>
  <br>
  <img src="${d.base64}" alt="QR Code WhatsApp">
  <div class="box">
    <b>Como escanear:</b>
    <ol>
      <li>Abra o WhatsApp no celular com o numero <b>(11) 97260-4416</b></li>
      <li>Toque nos 3 pontinhos (menu)</li>
      <li>Toque em <b>Dispositivos conectados</b></li>
      <li>Toque em <b>Conectar dispositivo</b></li>
      <li>Aponte a camera para o QR code acima</li>
    </ol>
  </div>
  <p style="color:#aaa;font-size:12px">O QR expira em aproximadamente 60 segundos. Recarregue a pagina se necessario.</p>
</body>
</html>`;
  fs.writeFileSync('conectar-whatsapp.html', html);
  console.log('Arquivo conectar-whatsapp.html criado! Abra no navegador para escanear.');
});
