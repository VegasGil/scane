// Leer archivo
document.getElementById('fileInput').addEventListener('change', function () {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById('fileContent').value = reader.result;
  };
  reader.readAsText(file);
});

// Guardar archivo
document.getElementById('saveBtn').addEventListener('click', function () {
  const content = document.getElementById('fileContent').value;
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'modificado.txt';
  link.click();
});

// Escaneo de código de barras
document.getElementById('startScan').addEventListener('click', function () {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#scanner')
    },
    decoder: {
      readers: ["code_128_reader", "ean_reader", "ean_8_reader"]
    }
  }, function (err) {
    if (err) {
      console.error(err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(function (data) {
    const code = data.codeResult.code;
    const textarea = document.getElementById('fileContent');
    textarea.value += `\nCódigo escaneado: ${code}`;
  });
});