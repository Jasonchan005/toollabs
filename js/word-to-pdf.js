(function() {
  'use strict';

  var dropZone = document.getElementById('dropZone');
  var fileInfo = document.getElementById('fileInfo');
  var fileName = document.getElementById('fileName');
  var fileSize = document.getElementById('fileSize');
  var convertBtn = document.getElementById('convertBtn');
  var progressContainer = document.getElementById('progressContainer');
  var progressBarFill = document.getElementById('progressBarFill');
  var progressText = document.getElementById('progressText');
  var resultContainer = document.getElementById('resultContainer');
  var downloadBtn = document.getElementById('downloadBtn');
  var statusMsg = document.getElementById('statusMsg');

  var selectedFile = null;

  function showStatus(msg, isErr) { statusMsg.style.display = 'block'; statusMsg.style.background = isErr ? '#fee2e2' : '#dbeafe'; statusMsg.style.color = isErr ? '#b91c1c' : '#1e40af'; statusMsg.textContent = msg; }
  function hideStatus() { statusMsg.style.display = 'none'; }
  function formatSize(bytes) { if (bytes < 1024) return bytes + ' B'; if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'; return (bytes / (1024 * 1024)).toFixed(1) + ' MB'; }

  function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.docx')) { showStatus('Please select a .docx file.', true); return; }
    if (file.size > 50 * 1024 * 1024) { showStatus('File exceeds 50MB limit.', true); return; }
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatSize(file.size);
    fileInfo.classList.add('show'); dropZone.style.display = 'none'; convertBtn.disabled = false; hideStatus(); resultContainer.classList.remove('show');
  }

  dropZone.addEventListener('click', function() {
    var input = document.createElement('input'); input.type = 'file'; input.accept = '.docx'; input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', function() { if (this.files && this.files.length > 0) handleFile(this.files[0]); document.body.removeChild(input); });
    input.click();
  });
  dropZone.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function(e) { e.preventDefault(); this.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault(); this.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  });

  convertBtn.addEventListener('click', async function() {
    if (!selectedFile) return;

    convertBtn.disabled = true;
    progressContainer.classList.add('show'); resultContainer.classList.remove('show');
    progressBarFill.style.width = '0%'; progressText.textContent = 'Reading Word document...';

    try {
      // Load Chinese font
      progressText.textContent = 'Loading Chinese font...';
      var fontResponse = await fetch('/lib/NotoSansSC.otf');
      var fontBytes = await fontResponse.arrayBuffer();
      progressBarFill.style.width = '15%';

      var arrayBuffer = await selectedFile.arrayBuffer();
      progressBarFill.style.width = '30%';
      progressText.textContent = 'Converting to PDF...';

      // Convert DOCX to HTML using mammoth
      var result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      var html = result.value;

      progressBarFill.style.width = '60%';
      progressText.textContent = 'Generating PDF...';

      // Create PDF with pdf-lib
      var pdfDoc = await PDFLib.PDFDocument.create();
      var font = await pdfDoc.embedFont(fontBytes);
      var fontSize = 11;
      var pageWidth = 595; // A4
      var pageHeight = 842;
      var margin = 50;
      var maxWidth = pageWidth - margin * 2;
      var lineHeight = fontSize * 1.5;

      // Parse HTML text content
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      var text = tempDiv.textContent || '';
      var paragraphs = text.split('\n').filter(function(p) { return p.trim(); });

      var page = pdfDoc.addPage([pageWidth, pageHeight]);
      var y = pageHeight - margin;

      for (var i = 0; i < paragraphs.length; i++) {
        var para = paragraphs[i].trim();
        if (!para) continue;

        // Word wrap
        var words = para.split(' ');
        var line = '';

        for (var w = 0; w < words.length; w++) {
          var testLine = line + (line ? ' ' : '') + words[w];
          var tw = font.widthOfTextAtSize(testLine, fontSize);
          if (tw > maxWidth && line) {
            // Check if we need a new page
            if (y < margin + lineHeight) {
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              y = pageHeight - margin;
            }
            page.drawText(line, { x: margin, y: y, size: fontSize, font: font });
            y -= lineHeight;
            line = words[w];
          } else {
            line = testLine;
          }
        }

        if (line) {
          if (y < margin + lineHeight) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
          // Try to detect headings (short lines)
          var isBold = para.length < 60 && para.length > 5 && !/[.!?:]$/.test(para);
          page.drawText(line, { x: margin, y: y, size: isBold ? 14 : fontSize, font: font });
          y -= lineHeight + (isBold ? 6 : 0);
        }
      }

      progressBarFill.style.width = '90%';

      var pdfBytes = await pdfDoc.save();
      var blob = new Blob([pdfBytes], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      downloadBtn.href = url;
      downloadBtn.download = selectedFile.name.replace(/\.docx$/i, '') + '.pdf';

      progressBarFill.style.width = '100%';
      progressText.textContent = 'Done!';
      setTimeout(function() { progressContainer.classList.remove('show'); resultContainer.classList.add('show'); }, 500);

    } catch (err) {
      showStatus('Error: ' + (err.message || 'Conversion failed'), true);
      progressContainer.classList.remove('show'); convertBtn.disabled = false;
    }
  });

})();
