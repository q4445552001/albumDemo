var PageSize = 18; //每頁顯示項目數
var Page = 0; //初始化頁數
var ScrollHeight = 0; //初始化頁面總高度
var par = {};
var DevText = "";

$(init);

function init() {
	//若有直連
	par = hrefRequest();
	// if (location.href.indexOf("file:///") == -1 && par.title) {
	// 	for (var i in List) {
	// 		if (List[i].title == decodeURI(par.title)) {
	// 			console.log(List[i].productUrl)
	// 			location.href = List[i].productUrl;
	// 			return false;
	// 		}
	// 	}
	// }


	//要觸發增加的高度
	var ChangeHeight = 200;

	SetTouchFooter();

	$(window).off('scroll').on("scroll", function () {
		DevText = "";
		var self = window.pageYOffset + window.innerHeight;
		// if (par.dev === "true") {
		// 	$("test").show();
		// 	DevText += `${self}, ${ScrollHeight}`;
		// };

		//自動往下增加
		if (self >= ScrollHeight - ChangeHeight) {
			Page++;
			Get(Page);
			ScrollHeight = $(document).height() - ChangeHeight;
		}

		//scroll 在頂時隱藏置頂icon
		if (window.pageYOffset == 0)
			$('.backtop').hide();
		else
			$('.backtop').show();

		//scroll 在底時隱藏底icon
		if (window.pageYOffset + window.innerHeight == ScrollHeight + ChangeHeight)
			$('.nextdown').hide();
		else
			$('.nextdown').show();

		//頁數顯示
		var ListLen = List.length;
		$(".gallery").each(function () {
			var $this = $(this);
			var top = $this.offset().top;
			// if (par.dev === "true") {
			// 	DevText += `<br>top: ${top}, pageYOffset: ${window.pageYOffset}`;
			// }
			if (top > window.pageYOffset && top < self) {
				$("page").text(`${$this.index() + 1} / ${ListLen}`)
			}
		})

		// showDevText();
	});

	// $('#albums').empty();
	Get(Page);
	ScrollHeight = $(document).height() - ChangeHeight;
	$(window).scroll();
}

function Get(size) {
	var $obj = $('#albums');

	var data = List.filter(function (x, i) { return i >= size * PageSize && i < (size * PageSize + PageSize) });

	$.each(data, (i, item) => {
		if (par.dev) item.coverPhotoBaseUrl = "";
		var html = `
                <a class="gallery" title="${item.title}" target="_blank" ${isNULL(item.productUrl, null) ? "href=\"" + item.productUrl + "\"" : "disabled"}>
                    <div class="img">
                        <img src="${isNULL(item.coverPhotoBaseUrl, null) ?? "./icon/no-image-icon-23494-Windows.ico"}" loading="lazy">
                    </div>
                    <div class="desc">(${item.mediaItemsCount} 個項目)</div>
                    <div class="desc">${item.title}<br>${isNULL(item.Des, null) ?? ""}</div>
                </a>
		`;

		$obj.append(html);
	});
}

/** Set Touch Footer Event
*/
function SetTouchFooter() {
	//footer 內的連結縮起時阻擋touch觸發
	$(".footer a").on("click", function (e) {
		if (window.matchMedia('(hover: none)').matches && $(".footer").is('.j_top-0')) {
			e.preventDefault();
		}
	})

	//footer touch 時縮拉
	$(".footer").on("touchend", function () {
		var $this = $(this);
		if ($this.is('.j_top-0')) {
			footer_AddClass(false);
		}
		else {
			footer_AddClass(true);
		}
	})

	//window touch 時觸發
	$(window).on("touchend", function (e) {
		var $obj = $(e.target);

		//若touch的地方不是.footer，就執行此步驟
		if ($obj.closest(".footer").length == 0) {
			if ($(".footer").is('.j_top-0')) {
				e.preventDefault();
			}
			footer_AddClass(false);
		}

		//若touch的地方不是.gallery，就執行此步驟
		if ($obj.closest(".gallery").length == 0) {
			e.preventDefault();
			$obj[0].click();
		}
	})

	//window touchmove 時觸發
	$(window).on("touchmove", function () {
		footer_AddClass(false);
	})

	//window resize 時觸發
	$(window).resize(function () {
		footer_AddClass(false)
		ScrollHeight = $(document).height();
	})
}

/** touch 模式時配合使用的副程式
*/
function footer_AddClass(open = false) {
	var $footer = $(".footer");
	if (open) {
		$footer.addClass('j_top-0');
		$footer.find(".text-top").addClass('j_display');
		$footer.addClass('j_w');
		$footer.addClass("j_opacity");
		$footer.find("img").addClass("j_img_width");
	}
	else {
		$footer.removeClass('j_top-0');
		$footer.find(".text-top").removeClass('j_display');
		$footer.removeClass('j_w');
		$footer.removeClass("j_opacity");
		$footer.find("img").removeClass("j_img_width");
	}
}

/** 回頂層
*/
function Top() {
	$('html').stop().animate({ scrollTop: 0 }, 200, () => $('.backtop').hide());
}

/** 回頂層
*/
function Down() {
	$('html').stop().animate({ scrollTop: ScrollHeight }, 200);
}

/*副程式****************************************************************************************************/

function showDevText() {
	$("test").html(DevText);
}

/**判斷是否null
* @param {String} v 要判斷的文字
* @param {String} str 要回傳的文字
* @return {String} string
*/
function isNULL(v, str) {
	var _typeof = typeof (v);
	switch (_typeof) {
		case 'string':
			switch (v.toLowerCase()) {
				case 'null':
				case '':
				case 'invalid date':
				case 'infinity':
				case 'nan':
					return str;
				default:
					return v;
			}
		case 'number':
			switch ((v + '').toLowerCase()) {
				case 'invalid date':
				case 'infinity':
				case 'nan':
					return str;
				default:
					return v;
			}
		case 'undefined':
			return str;
		case 'object':
			for (var i in v)
				return v;
			return str;
		default:
			return v;
	}
}

/**拆URL
* @param {String} url 網址
* @return {JSON} selfJSON GET資料
*/
function hrefRequest(url) {
	if (!url)
		url = location.href;
	var hrefArr = url.indexOf('?') > -1 ? url.split('?')[1].split('&') : null;
	var selfJSON = {};
	for (var i in hrefArr) {
		var TempArr = hrefArr[i].split('=');
		selfJSON[TempArr[0]] = TempArr[1];
	}
	return selfJSON;
}