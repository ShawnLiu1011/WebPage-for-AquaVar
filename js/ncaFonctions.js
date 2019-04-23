function trigger() {
	var ifr = document.getElementById('ncamap_js');
	if (ifr.style.visibility == "hidden") {
		// Contenu cachï¿½, le montrer
		ifr.style.visibility = "visible";

		var _wait = document.getElementById('wait');
		_wait.style.display = "none";
	}
}

function getMessage(e) {
	var obj = jQuery.parseJSON(e.data);
	console.log(e.data);
	if ("alert" in obj) {
		document.getElementById("alert").value = obj.alert;
	}
	if ("message" in obj) {
		document.getElementById("message").value = obj.message;
		var json = { "codeAction": obj.code, "desc": obj.desc };
		treatSIGReturn(JSON.stringify(json));
	}
	if ("returnValue" in obj) {
		var json = { "returnValue": obj.returnValue };
		treatSIGReturn(JSON.stringify(json));
	}
	if ("mapLoaded" in obj) {
		var json = { "mapLoaded": obj.mapLoaded };
		treatSIGReturn(JSON.stringify(json));
	}
}

jQuery(function () {
	if (window.addEventListener) { // W3C DOM
		window.addEventListener("message", getMessage, false);
	}
	else if (window.attachEvent) { // IE DOM
		window.attachEvent("onmessage", getMessage);
	}
	else { // No much to do
		window[message] = getMessage;
	}
});
