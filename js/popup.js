

var url=document.URL;

var importantPartOfUrl= url.substring(url.indexOf("?")+1);
if(importantPartOfUrl!=url){
chrome.runtime.sendMessage({greeting: "savedContentCheck", url:importantPartOfUrl}, 
	function(response) {
		setTimeout(function(){
			chrome.runtime.sendMessage({greeting: "getContent", url:importantPartOfUrl}
				,function(response){
					document.getElementsByTagName("html")[0].innerHTML=response.data1;
				})
			}
		,100)
	}
);
}else{
function setState(enabled){
	if(enabled) {
    document.getElementById('button1').innerHTML="Turn <span>Off</span>";
	} else {
    document.getElementById('button1').innerHTML="Turn <span>On</span>";
  }
}

function buttonFunc() {
	chrome.runtime.sendMessage({greeting: "changedState"}, function(response) {console.log(response.data1);});
	if(document.getElementById('button1').innerHTML=="Turn <span>Off</span>") {
 		document.getElementById('button1').innerHTML="Turn <span>On</span>";
	} else {
    document.getElementById('button1').innerHTML="Turn <span>Off</span>";
  }
}

chrome.runtime.sendMessage({greeting: "getState"}, function(response) {setState(response.data1);});
document.getElementById('button1').onclick = buttonFunc;
}
