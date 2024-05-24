function countLines() {
  let files = 0;
  let addedLines = 0;
  let removedLines = 0;

  document.querySelectorAll('.repos-summary-header').forEach((element) => {
    files += 1;
  });

  document.querySelectorAll('.repos-compare-added-lines').forEach((element) => {
    addedLines += parseInt(element.textContent.replace('+', ''));
  });

  document
    .querySelectorAll('.repos-compare-removed-lines')
    .forEach((element) => {
      removedLines += parseInt(element.textContent.replace('-', ''));
    });

  return { addedLines, files, removedLines };
}

function displayCounts(files, addedLines, removedLines) {
  let summaryDiv = document.createElement('div');
  summaryDiv.style.position = 'fixed';
  summaryDiv.style.bottom = '10px';
  summaryDiv.style.right = '10px';
  summaryDiv.style.padding = '10px';
  summaryDiv.style.backgroundColor = '#fff';
  summaryDiv.style.border = '1px solid #ccc';
  summaryDiv.style.zIndex = 1000;

  summaryDiv.innerHTML = `
    <strong>Total files: ${files}</strong><br>
    <strong style="color:green;">Total lines added: ${addedLines}</strong><br>
    <strong style="color:red;">Total lines removed: ${removedLines}</strong>
  `;

  document.body.appendChild(summaryDiv);
}

// function scrollToBottom(callback) {
//   let scrollHeight = document.body.scrollHeight;
//   let scrollPosition = window.innerHeight + window.scrollY;

//   if (scrollHeight > scrollPosition) {
//     window.scrollBy(0, window.innerHeight);
//     setTimeout(() => scrollToBottom(callback), 1000);
//   } else {
//     callback();
//   }
// }

function scrollToBottom(callback) {
  let scrollHeight = document.body.scrollHeight;
  let scrollPosition = window.innerHeight + window.scrollY;

  // Add a limit to prevent infinite scrolling in case of errors
  let maxScrollAttempts = 100;
  let scrollAttempts = 0;

  function scrollStep() {
    if (scrollHeight > scrollPosition && scrollAttempts < maxScrollAttempts) {
      window.scrollBy(0, window.innerHeight);
      scrollHeight = document.body.scrollHeight;
      scrollPosition = window.innerHeight + window.scrollY;
      scrollAttempts++;
      setTimeout(scrollStep, 1000);
    } else {
      callback();
    }
  }

  scrollStep();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'countLines') {
    scrollToBottom(() => {
      const { addedLines, files, removedLines } = countLines();
      displayCounts(files, addedLines, removedLines);
      sendResponse({ addedLines, files, removedLines });
    });
    return true;
  }
});
