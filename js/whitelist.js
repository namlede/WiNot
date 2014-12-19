
function pushWhitelist() {
  var txtbox = document.getElementById('whitelisturl');
  var value = txtbox.value;
  alert(value);
  chrome.runtime.sendMessage({greeting: "newwhitelist", item:value}, function(response) {console.log(response.data1);});
  alert('here1');
}
document.getElementById('whitelistbutton').onclick = pushWhitelist;
