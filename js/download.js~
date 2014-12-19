// given a url,
alert("hello");
chrome.runtime.sendMessage({greeting: "getState"}, function(response) {setState(response.data1);});
function httpGet(url)
{
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

// Given a list of urls, download their html source
function getPages(urls) {
  var pages = {};
  for (var i = 0, ie = urls.length; i < ie; ++i) {
    var html = httpGet(urls[i]);
    pages[urls[i]] = html;
  }; 
  chrome.storage.local.set(pages);
}

// Search history to find up to ten links that a user has typed in,
// and show those linksin a popup.
function historyRetrieve() {
  // To look for history items visited in the last week,
  // subtract a week of microseconds from the current time.
  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

  chrome.history.search({
      'text': '',              // Return every history item....
      'startTime': oneWeekAgo  // that was accessed less than one week ago.
    },
    function(historyItems) {
      var urls = [];
      for (var i = 0, ie = historyItems.length; i < ie, ++i) {
        url.push(historyItems[i].url);
      }
      getPages(urls.slice(0,10));
    }
  });
}
historyRetrieve();
