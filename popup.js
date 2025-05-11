document.getElementById("saveBtn").addEventListener("click", () => {
  const currency = document.getElementById("targetCurrency").value;
  chrome.storage.sync.set({ targetCurrency: currency }, () => {
    document.getElementById("status").innerText = "Currency saved!";
  });
});
