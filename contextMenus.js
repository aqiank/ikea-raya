chrome.contextMenus.create({
	"title": "Block",
	"contexts": ["image"],
	"onclick": onBlock,
});

chrome.contextMenus.create({
	"title": "Unblock",
	"contexts": ["image"],
	"onclick": onUnblock,
});

function onBlock(info, tab) {
	if (typeof info.srcUrl == "string") {
		console.log(info.srcUrl);
		block(info.srcUrl);
	} else if (typeof info.linkUrl == "string") {
		console.log(info.linkUrl);
		block(info.linkUrl);
	}
}

function onUnblock(info, tab) {
	if (typeof info.srcUrl == "string") {
		unblock(info.srcUrl);
	} else if (typeof info.linkUrl == "string") {
		unblock(info.linkUrl);
	}
}

function block(url) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		//console.log(url);
		console.log("Blocked image with url: " + url);
	};

	xhr.open("POST", "http://bbhoi.com:8081/block?url=" + url + "&key=" + "NzI2ZDQzOTlmM2IyYmQ1NDAwNDgyNWMw", true);
	xhr.send();
}

function unblock(url) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		console.log("Unblocked image with url: " + url);
	};

	xhr.open("POST", "http://bbhoi.com:8081/unblock?url=" + url + "&key=" + "NzI2ZDQzOTlmM2IyYmQ1NDAwNDgyNWMw", true);
	xhr.send();
}
