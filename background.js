// Initialize the extension
console.log('FindQC URL Converter background script initializing...');

// Function to extract item ID from various shopping URLs
function extractItemInfo(url) {
  try {
    const urlObj = new URL(url);
    console.log('Analyzing URL:', url);  // Debug log
    
    // Handle Weidian URLs
    if (url.includes('weidian.com')) {
      const itemId = urlObj.searchParams.get('itemId');
      return itemId ? { type: 'WD', id: itemId } : null;
    }
    
    // Handle 1688 URLs
    if (url.includes('1688.com')) {
      // Try to match both /offer/ and /detail/ patterns
      const match = url.match(/(?:offer|detail)\/(\d+)/);
      return match ? { type: 'T1688', id: match[1] } : null;
    }
    
    // Handle Taobao URLs
    if (url.includes('taobao.com') || url.includes('tmall.com')) {
      const itemId = urlObj.searchParams.get('id');
      return itemId ? { type: 'TB', id: itemId } : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting item info:', error);
    return null;
  }
}

// Function to convert URL to FindQC format
function convertToFindQC(itemInfo) {
  if (!itemInfo) return null;
  return `https://findqc.com/detail/${itemInfo.type}/${itemInfo.id}?frm=1`;
}

// Initialize webRequest listener
function initializeWebRequestListener() {
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      const url = new URL(details.url);
      
      // Only modify if the URL doesn't already have frm=1
      if (url.searchParams.get('frm') !== '1') {
        // Preserve existing parameters and add/update frm=1
        url.searchParams.set('frm', '1');
        return { redirectUrl: url.toString() };
      }
      
      // If frm=1 is already present, don't redirect
      return { cancel: false };
    },
    {
      urls: ["*://findqc.com/detail/*"],
      types: ["main_frame"]
    },
    ["blocking"]
  );
  console.log('WebRequest listener initialized');
}

// Initialize action click listener
function initializeActionListener() {
  chrome.action.onClicked.addListener(async (tab) => {
    try {
      let url = tab.url;
      console.log('Initial URL:', url);  // Debug log
      
      // Handle Superbuy URLs
      if (url.includes('superbuy.com')) {
        const urlObj = new URL(url);
        const encodedUrl = urlObj.searchParams.get('url');
        if (encodedUrl) {
          url = decodeURIComponent(encodedUrl);
          console.log('Decoded Superbuy URL:', url);  // Debug log
        } else {
          console.log('No encoded URL found in Superbuy link');  // Debug log
          return;
        }
      }
      
      const itemInfo = extractItemInfo(url);
      console.log('Extracted item info:', itemInfo);  // Debug log
      
      const findQcUrl = convertToFindQC(itemInfo);
      console.log('Converted FindQC URL:', findQcUrl);  // Debug log
      
      if (findQcUrl) {
        // Open in new tab instead of updating current tab
        await chrome.tabs.create({ url: findQcUrl, active: true });
        console.log('New tab created successfully');  // Debug log
      } else {
        console.log('No valid FindQC URL could be generated');  // Debug log
      }
    } catch (error) {
      console.error('Error processing URL:', error);
    }
  });
  console.log('Action click listener initialized');
}

// Initialize all listeners
function initialize() {
  initializeWebRequestListener();
  initializeActionListener();
  console.log('FindQC URL Converter initialization complete');
}

// Start the extension
initialize(); 