var RedirectURL =  "https://localtvwdaf.files.wordpress.com/2012/09/ikealogo.jpg?w=400";
var ServerBaseUrl = "http://bbhoi.com:8081";
var RecognitionAPI = "recognize";

var ClarifaiAccessToken = "gtJlEd2S3dbzQzOZDYZEkYtU14b9JM";

var keywords = ["food", "rice", "noodle", "nasi", "mee", "goreng", "curry", "steak", "meatball", "fishball"];
var useKeywords = true;
var useBlacklist = true;
var useRecognition = false;
var maxRecognizedImagesPerPage = 1;

var tabRecognizedImageCount = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	chrome.tabs.executeScript(tabId, {file: "contextfilter.js", runAt: "document_idle"});
});

// Filter food images
chrome.webRequest.onBeforeRequest.addListener(
	function(info) {
		// standard three-layer filtering starting with keywords, blacklist, and lastly image recognition
		if (filterKeyword(info.url) || filterBlacklist(info.url) || filterRecognition(info.url, info.tabId)) {
			console.log("intercepted: " + info.url);
			return {redirectUrl: RedirectURL};
		}

		return {redirectUrl: info.url};
	},
	// filters
	{
		urls: [
			"http://*/*",
			"https://*/*"
		],
		types: ["image"]
	},
	// extraInfoSpec
	["blocking"]
);

function filterKeyword(url) {
	if (!useKeywords) {
		return false;
	}

	url = url.toLowerCase();
	for (var i = 0; i < keywords.length; i++) {
		if (url.indexOf(keywords[i]) >= 0) {
			return true;
		}
	}

	return false;
}

function filterBlacklist(url) {
	if (!useBlacklist) {
		return false;
	}

	var xhr = new XMLHttpRequest();
	xhr.open("GET", ServerBaseUrl + "/blocked?url=" + url + "&key=" + "NzI2ZDQzOTlmM2IyYmQ1NDAwNDgyNWMw", false);
	xhr.send();

	return xhr.responseText == "blocked";
}

function filterRecognition(url, tabId) {
	if (!useRecognition || tabRecognizedImageCount[tabId] >= maxRecognizedImagesPerPage) {
		return false;
	}

	switch (RecognitionAPI) {
	case "clarifai":
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://api.clarifai.com/v1/tag/?url=" + url, false);
		xhr.setRequestHeader("Authorization", "Bearer " + ClarifaiAccessToken);
		xhr.send();

		if (xhr.status != 200) {
			return false;
		}

		var data = JSON.parse(xhr.responseText);
		if (typeof data.result !== "undefined" &&
		    typeof data.result.tag !== "undefined" &&
		    typeof data.result.tag.classes !== "undefined") {
			var tags = data.result.tag.classes;
			if (tags.indexOf("food") < 0) {
				return false;
			}
		}
		break;
	case "recognize":
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://vufind-vufind-recognize.p.mashape.com/vugraph/v175/recognize.php?app_key=dee1eb769deb1c7ed850fc2ab18c31e5&genre=food&token=3hbv1ionxeoyl9pzsy49e7bl5yh45i830nxuono4vzq309ii80whj9mu022rwgd3&url=" + encodeURI(url) + "&user_id=777999", false);
		xhr.setRequestHeader("X-Mashape-Key", "DMeV1KUQiumshSAEZsaQ9qlI0j3Mp14EDRbjsnSGliU9k0mxRE");
		xhr.setRequestHeader("Accept", "text/plain");
		xhr.send();

		if (xhr.status != 200 || xhr.responseText.indexOf("\"result\":false") >= 0) {
			return false;
		}

		break;
	}

	// block the food image URL
	block(url);

	// increment number of recognized image
	if (typeof tabRecognizedImageCount[tabId] !== "number") {
		tabRecognizedImageCount[tabId] = 0;
	}
	tabRecognizedImageCount[tabId]++;

	return true;
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		//console.log(sender.tab ? "from a content script: " + sender.tab.url : "from the extension");
		switch (request.action) {
		case "resetImageCount":
			tabRecognizedImageCount[sender.tab.id] = 0;
			break;
		case "loadOptions":
			keywords = request.keywords;
			useKeywords = request.useKeywords;
			useBlacklist = request.useBlacklist;
			useRecognition = request.useRecognition;
			maxRecognizedImagesPerPage = request.maxRecognizedImagesPerPage;
			console.log("Loaded " + keywords.length + " keywords");
			break;
		}
	}
);
