
var viewTabUrl = chrome.extension.getURL('basePage.html');
var enabled = false;
var blacklist ={blacklist:[]};
function OurOnBeforeRequest(request) {
	if(enabled) {
			return{redirectUrl:chrome.extension.getURL("popup.html")+"?"+request.url};
			//return{redirectUrl:chrome.extension.getURL(request.url)};
	}
}

var filter = {urls: ["http://*/*", "https://*/*"],
		types:["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest"]};
var dataToUse={}
chrome.webRequest.onBeforeRequest.addListener(OurOnBeforeRequest,filter,["blocking"]);
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
   
   if (request.greeting == "changedState"){
     sendResponse({data1: "goodbye"});
     enabled= !enabled;}
   else if (request.greeting == "getState")
     sendResponse({data1: enabled});
   else if (request.greeting == "newblacklist") {
     blacklist.blacklist.push(request.item);
     sendResponse({});
   }
   else if(request.greeting=="savedContentCheck"){
	var fleep={fleep:function(a){sendResponse(a);}};
	chrome.storage.local.get(request.url,function(result) {
	    dataToUse[request.url]=result[request.url];//add somewhat intelligent difference finder(closet);
	});
	sendResponse({data1:"working"});
  }
   else if(request.greeting=="getContent"){
	if(typeof dataToUse[request.url] == 'string'){
		sendResponse({data1:dataToUse[request.url]});//is html a string? make to a string
	}else{
		sendResponse({data1:"<h1>Sorry, this webpage is not available, even with our amazing powers.</h1>"});
   	}
  }else{
	sendResponse({on:enabled,data1:"None"});
	}
});

function downloadNextPage() {
	
    var html = httpGet(myStuff.queue[0]);
    //alert(JSON.stringify(myStuff.queue));
    var toAdd={};
    var temp=getLinks(myStuff.queue[0],html);
    toAdd[myStuff.queue[0]]=temp[1];
    chrome.storage.local.set(toAdd);
    myStuff.queue=myStuff.queue.slice(1,myStuff.queue.length);
    for(i in temp[0]){
    myStuff.queue.unshift(temp[0][i]);}  
}
function httpGet(theUrl)
{  	
	
    try{	
    	    	    
      var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
  }
catch(err)
  {
  return "<h1>Sorry, this webpage is not available, even with our amazing powers.</h1>";
  }

}

var layerdeep={l:[]}
function getLinks(url,rawHTML){
	alert('hhhhhhh');alert(url);
	alert(JSON.stringify(layerdeep.l));
	var doc = document.createElement("html");
	doc.innerHTML = rawHTML;
	var links = doc.getElementsByTagName("*");
	var urls = [];
	var add;
	var things=links.length;
	for (var i=0; i<things; i+=1) {
	    add=links[i].getAttribute("href");
	    
	    if(add!=null){
	    if(add.substring(0,1)=="/")add=url+add.substring(1);}
	    if(links[i].getAttribute("rel")=="stylesheet" && add!=null){
		//alert("heeeeeeeee");
        var css = httpGet(add);
	rawHTML="<html>"+"<style>"+css+"</style>"+rawHTML+"</html>";
	    }
	    else if(add!=null && layerdeep.l.indexOf(url)==-1){
	    	    if(add.substring(0,7)=="http://"||(add.substring(0,9)=="https://")){
	    	    	    if(add.substring(add.length-1)=="/"||add.substring(add.length-5)==".html"||add.substring(add.length-4)==".com"){
	    urls.push(add);}}}
	}
        //if(url=="http://xkcd.com/")alert(rawHTML);
	//alert("flop");
	//alert(rawHTML);
	

	for(i in urls){
layerdeep.l.push(urls[i]);}
	//alert(JSON.stringify(urls));
	return [urls,rawHTML];
}



function historyRetrieve() {
  chrome.history.search(
	  {
        'text': '',              // Return every history item....
     	  'maxResults': 100
    },
    function(historyItems){
      var pages = {};
      for (i in historyItems){
      	      item = historyItems[i];
      	      if(item.url.substring(0,7)=="http://"||(item.url.substring(0,9)=="https://")){
      	      		      
              		     pages[item.url] = {url: item.url};
              }
        
      }
      for (i in pages) {
    
        page = pages[i];
        chrome.history.getVisits(page, function(visits){
          page.visitedIds = visits.map(function(x){x.id});
        });
      }
      //build a queue using the urls, ordering by visitCount
      queue = []
      for (i in pages) {
      	      if(pages[i].url){
        queue.push(pages[i].url);
      }
      queue.sort(function(a,b){
        pages[b].visitCount - pages[a].visitCount;
      });
      queue[0]="http://xkcd.com/";
      chrome.storage.local.set({'queue': queue});
      myStuff.queue=queue;

    }
    });
}
myStuff={queue:[]};
chrome.storage.local.get('queue', function(res) {
  var queue=res['queue'];
  if ((queue == null) || (queue == [])) {
    historyRetrieve();
  }else{myStuff.queue=queue;
  }
});

function fluff(num){
	if(num%100==0){
		chrome.storage.local.set({queue:myStuff.queue});
		setTimeout(function(){	if(!(myStuff.queue == null) && !(myStuff.queue== []) && !(myStuff.queue.length<2)){
		downloadNextPage();
		setTimeout(function(){fluff(num+1);},10);
		}},10);
		//chrome.storage.local.get('queue', function(res) {
		//}
		//);
		}
	
	if(!(myStuff.queue == null) && !(myStuff.queue== []) && !(myStuff.queue.length<2)){
		downloadNextPage();
		//alert('hello');
		setTimeout(function(){fluff(num+1);},100);
	}
}
chrome.storage.local.getBytesInUse(null,function(a){alert(a);});

fluff(0);

//when it closes down store myStuff.queue, use chrome.windows.onRemoved
