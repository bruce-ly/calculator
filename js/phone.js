(function(doc, win) {
	var docEl = doc.documentElement, resizeEvt = "orientationchange" in window ? "orientationchange"
			: "resize", recalc = function() {
		var clientWidth = docEl.clientWidth;
		if (clientWidth) {
			if (clientWidth >= 720) {
				docEl.style.fontSize = "10px";
			} else {
				docEl.style.fontSize = (clientWidth / 72) + "px";
			}
		}
	};
	if (doc.addEventListener) {
		win.addEventListener(resizeEvt, recalc, false);
		doc.addEventListener("DOMContentLoaded", recalc, false);
	}
})(document, window);