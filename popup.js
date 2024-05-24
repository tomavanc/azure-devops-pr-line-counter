document.getElementById('countLines').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'countLines' },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        }
        if (response) {
          console.log('Response received from content script', response);
          document.getElementById('result').innerHTML = `
          <strong>Total files: ${response.files}</strong><br>
          <strong style="color:green;">Total lines added: ${response.addedLines}</strong><br>
          <strong style="color:red;">Total lines removed: ${response.removedLines}</strong>
        `;
        } else {
          console.log('No response received');
          document.getElementById('result').innerHTML = `
          <strong>Error: Could not count lines. Please try again.</strong>
        `;
        }
      }
    );
  });
});
