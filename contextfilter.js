var googleRegExp = new RegExp(/.*google\..*\/search\?.*/);
var googleInputRegExp = new RegExp(/food|nasi|mee|noodle|rice|steak|meatball|fried|burger/);

function googleFilter() {
	if (window.location.href.search(googleRegExp) >= 0) {
		var input = document.getElementById("lst-ib");
		console.log(input.value);
		if (input != null && input.value.search(googleInputRegExp) >= 0) {
			$(".rg_di.rg_el img").attr("src", "https://localtvwdaf.files.wordpress.com/2012/09/ikealogo.jpg");
			$(".rg_bb.rg_fb img").attr("src", "https://localtvwdaf.files.wordpress.com/2012/09/ikealogo.jpg");
		}
	}
}

googleFilter();
