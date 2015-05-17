var Keywords = [
	"food",
	"rice",
	"noodle",
	"nasi",
	"mee",
	"goreng",
	"curry",
	"steak",
	"meatball",
];

function saveOptions() {
	var keywords = document.getElementById("keywords").value;
	var useKeywords = document.getElementById("useKeywords").checked;
	var useBlacklist = document.getElementById("useBlacklist").checked;
	var useRecognition = document.getElementById("useRecognition").checked;
	var maxRecognizedImagesPerPage = document.getElementById("maxRecognizedImagesPerPage").value;

	chrome.storage.sync.set({
		keywords: keywords,
		useKeywords: useKeywords,
		useBlacklist: useBlacklist,
		useRecognition: useRecognition,
		maxRecognizedImagesPerPage: maxRecognizedImagesPerPage,
	}, function() {
		var status = document.getElementById("status");
		status.textContent = "Options saved.";
		setTimeout(function() {
			status.textContent = "";
		}, 750);

		loadOptions();
	});
}

function loadOptions() {
	var maxRecognizedImagesPerPage = document.getElementById("maxRecognizedImagesPerPage");
	maxRecognizedImagesPerPage.addEventListener("change", onMaxRecognizedImagesPerPageChange);
	maxRecognizedImagesPerPage.addEventListener("input", onMaxRecognizedImagesPerPageChange);

	chrome.storage.sync.get({
		keywords: Keywords.join(),
		useKeywords: true,
		useBlacklist: true,
		useRecognition: false,
		maxRecognizedImagesPerPage: 1,
	}, function(items) {
		document.getElementById("keywords").textContent = items.keywords;
		document.getElementById("useKeywords").checked = items.useKeywords;
		document.getElementById("useBlacklist").checked = items.useBlacklist;
		document.getElementById("useRecognition").checked = items.useRecognition;
		document.getElementById("maxRecognizedImagesPerPage").value = items.maxRecognizedImagesPerPage;
		document.getElementById("maxRecognizedImagesPerPageLabel").textContent = items.maxRecognizedImagesPerPage;

		chrome.runtime.sendMessage({
			action: "loadOptions",
			keywords: items.keywords.split(","),
			useKeywords: items.useKeywords,
			useBlacklist: items.useBlacklist,
			useRecognition: items.useRecognition,
			maxRecognizedImagesPerPage: items.maxRecognizedImagesPerPage,
		}, function(response) {
			// TODO
		});
	});

	console.log("loaded options");
}

function onMaxRecognizedImagesPerPageChange(evt) {
	document.getElementById("maxRecognizedImagesPerPageLabel").textContent = evt.target.value;
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.getElementById("save").addEventListener("click", saveOptions);
