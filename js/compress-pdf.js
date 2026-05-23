(function() {
  'use strict';

  var dropZone = document.getElementById('dropZone');
  var fileInfo = document.getElementById('fileInfo');
  var fileName = document.getElementById('fileName');
  var fileSize = document.getElementById('fileSize');
  var compressBtn = document.getElementById('compressBtn');
  var compressLevel = document.getElementById('compressLevel');
  var progressContainer = document.getElementById('progressContainer');
  var progressBarFill = document.getElementById('progressBarFill');
  var progressText = document.getElementById('progressText');
  var resultContainer = document.getElementById('resultContainer');
  var downloadBtn = document.getElementById('downloadBtn');
  var compressResultText = document.getElementById('compressResultText');
  var statusMsg = document.getElementById('statusMsg');

  var selectedFile = null;

  function showStatus(msg, isErr) {
    statusMsg.style.display = 'block';
    statusMsg.style.background = isErr ? '#fee2e2' : '#dbeafe';
    statusMsg.style.color = isErr ? '#b91c1c' : '#1e40af';
    statusMsg.textContent = msg;
  }
  function hideStatus() { statusMsg.style.display = 'none'; }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }

  function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.pdf')) { showStatus('Please select a PDF file.', true); return; }
    if (file.size > 1024 * 1024 * 1024) { showStatus('File exceeds 1GB limit.', true); return; }
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatSize(file.size);
    fileInfo.classList.add('show');
    dropZone.style.display = 'none';
    compressBtn.disabled = false;
    hideStatus();
    resultContainer.classList.remove('show');
  }

  dropZone.addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file'; input.accept = '.pdf'; input.style.display = 'none';
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

  // === Split-compress-merge for large PDFs ===
  async function compressPDF(arrayBuffer, level, fileSize) {
    var useObjStreams = level !== 'low';

    // Load original
    var srcDoc = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    var totalPages = srcDoc.getPageCount();

    // Clean metadata
    srcDoc.setTitle(''); srcDoc.setAuthor(''); srcDoc.setSubject('');
    srcDoc.setKeywords([]); srcDoc.setProducer('ToolLabs Compressor'); srcDoc.setCreator('ToolLabs');

    // Files under 500MB: direct compression (proven, safe)
    if (fileSize < 500 * 1024 * 1024) {
      progressText.textContent = 'Compressing (' + totalPages + ' pages)...';
      return await srcDoc.save({ useObjectStreams: useObjStreams });
    }

    // Files over 500MB: split into chunks, compress each, merge back
    var chunkPageSize = level === 'high' ? 30 : 50;
    var chunks = [];
    var numChunks = Math.ceil(totalPages / chunkPageSize);

    for (var c = 0; c < numChunks; c++) {
      var start = c * chunkPageSize;
      var end = Math.min(start + chunkPageSize, totalPages);
      var pageIndices = [];
      for (var p = start; p < end; p++) pageIndices.push(p);

      progressText.textContent = 'Splitting & compressing part ' + (c + 1) + ' of ' + numChunks + '...';
      progressBarFill.style.width = Math.round((c / numChunks) * 70) + '%';

      var subDoc = await PDFLib.PDFDocument.create();
      var copiedPages = await subDoc.copyPages(srcDoc, pageIndices);
      for (var pi = 0; pi < copiedPages.length; pi++) subDoc.addPage(copiedPages[pi]);

      var subBytes = await subDoc.save({ useObjectStreams: useObjStreams });
      chunks.push(subBytes);

      // Free memory hint: let subDoc go out of scope
    }

    // Merge all compressed chunks
    progressText.textContent = 'Merging ' + numChunks + ' parts...';
    progressBarFill.style.width = '80%';

    var finalDoc = await PDFLib.PDFDocument.create();
    for (var ci = 0; ci < chunks.length; ci++) {
      var chunkDoc = await PDFLib.PDFDocument.load(chunks[ci]);
      var chunkPages = await finalDoc.copyPages(chunkDoc, chunkDoc.getPageIndices());
      for (var pi2 = 0; pi2 < chunkPages.length; pi2++) finalDoc.addPage(chunkPages[pi2]);
    }

    return await finalDoc.save({ useObjectStreams: useObjStreams });
  }

  // === Compress Button ===
  compressBtn.addEventListener('click', async function() {
    if (!selectedFile) return;

    compressBtn.disabled = true;
    progressContainer.classList.add('show');
    resultContainer.classList.remove('show');
    progressBarFill.style.width = '0%';
    progressText.textContent = 'Reading PDF...';

    try {
      var originalSize = selectedFile.size;
      var arrayBuffer = await selectedFile.arrayBuffer();
      progressBarFill.style.width = '10%';

      var level = compressLevel.value;
      var compressedBytes = await compressPDF(arrayBuffer, level, originalSize);

      progressBarFill.style.width = '95%';
      progressText.textContent = 'Finalizing...';

      var compressedSize = compressedBytes.length;
      var savings = Math.round((1 - compressedSize / originalSize) * 100);

      var blob = new Blob([compressedBytes], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      downloadBtn.href = url;
      downloadBtn.download = selectedFile.name.replace(/\.pdf$/i, '') + '-compressed.pdf';

      compressResultText.textContent = 'Reduced from ' + formatSize(originalSize) + ' to ' + formatSize(compressedSize) + ' (' + savings + '% reduction)';

      progressBarFill.style.width = '100%';
      progressText.textContent = 'Done!';
      setTimeout(function() { progressContainer.classList.remove('show'); resultContainer.classList.add('show'); }, 500);

    } catch (err) {
      showStatus('Error: ' + (err.message || 'Compression failed'), true);
      progressContainer.classList.remove('show');
      compressBtn.disabled = false;
    }
  });

})();
