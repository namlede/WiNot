
function pushBlacklist() {
  var txtbox = document.getElementById('blacklisturl');
  var value = txtbox.value;
  alert(value);
  chrome.runtime.sendMessage({greeting: "newblacklist", item:value}, function(response) {console.log(response.data1);});
  alert('here1');
}
document.getElementById('blacklistbutton').onclick = pushBlacklist;
