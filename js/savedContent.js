
var url=document.URL;
var importantPartOfUrl= url.substring(url.indexOf("?")+1);
if(importantPartOfUrl!=url){

alert(importantPartOfUrl);
chrome.runtime.sendMessage({greeting: "savedContentCheck", url:importantPartOfUrl}, 
	function(response) {
		document.getElementsByTagName("html")[0].innerHTML=response.data1;
		}
	}
);}
