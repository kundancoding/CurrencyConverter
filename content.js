(async () => {
  // Fetch exchange rates
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const data = await response.json();
  const rates = data.rates;

  // Currency symbols mapping
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    INR: "₹",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
    SEK: "kr",
    NZD: "NZ$"
    // Add more if needed
  };

  chrome.storage.sync.get("targetCurrency", ({ targetCurrency }) => {
    if (!targetCurrency || !rates[targetCurrency]) return;

    const rate = rates[targetCurrency];
    const symbol = currencySymbols[targetCurrency] || targetCurrency;

    const regex = /\$\s?(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)/g;

    // DOM walker to safely replace text in text nodes
    function walk(node) {
      const excludedTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE'];

      if (node.nodeType === 3) {
        const originalText = node.nodeValue;
        const newText = originalText.replace(regex, (match, numberStr) => {
          const cleanNumber = parseFloat(numberStr.replace(/,/g, ''));
          if (isNaN(cleanNumber)) return match;
          const converted = (cleanNumber * rate).toFixed(2);
          return `${match} (${symbol} ${converted})`;
        });

        if (newText !== originalText) {
          node.nodeValue = newText;
        }
      } else if (!excludedTags.includes(node.nodeName)) {
        node.childNodes.forEach(walk);
      }
    }

    walk(document.body);
  });
})();
