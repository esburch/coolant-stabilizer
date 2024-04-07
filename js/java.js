/*
jQuery Press and Hold
https://github.com/santhony7/pressAndHold/
*/
(function (e, t, n, r) {
	function o(t, n) {
	  this.element = t;
	  this.settings = e.extend({}, s, n);
	  this._defaults = s;
	  this._name = i;
	  this.init();
	}
	var i = "pressAndHold",
	  s = {
		holdTime: 700,
		progressIndicatorRemoveDelay: 300,
		progressIndicatorColor: "#ff0000",
		progressIndicatorOpacity: 0.6
	  };
	o.prototype = {
	  init: function () {
		var t = this,
		  n,
		  r,
		  i;
		e(this.element).css({
		  display: "block",
		  overflow: "hidden",
		  position: "relative"
		});
		i =
		  '<div class="holdButtonProgress" style="height: 100%; width: 100%; position: absolute; top: 0; left: -100%; background-color:' +
		  this.settings.progressIndicatorColor +
		  "; opacity:" +
		  this.settings.progressIndicatorOpacity +
		  ';"></div>';
		e(this.element).prepend(i);
		e(this.element).mousedown(function (i) {
		  if (i.button != 2) {
			e(t.element).trigger("start.pressAndHold");
			r = 0;
			n = setInterval(function () {
			  r += 10;
			  e(t.element)
				.find(".holdButtonProgress")
				.css("left", (r / t.settings.holdTime) * 100 - 100 + "%");
			  if (r == t.settings.holdTime) {
				t.exitTimer(n);
				e(t.element).trigger("complete.pressAndHold");
			  }
			}, 10);
			e(t.element).on(
			  "mouseup.pressAndHold mouseleave.pressAndHold",
			  function (e) {
				t.exitTimer(n);
			  }
			);
		  }
		});
	  },
	  exitTimer: function (t) {
		var n = this;
		clearTimeout(t);
		e(this.element).off("mouseup.pressAndHold mouseleave.pressAndHold");
		setTimeout(function () {
		  e(".holdButtonProgress").css("left", "-100%");
		  e(n.element).trigger("end.pressAndHold");
		}, this.settings.progressIndicatorRemoveDelay);
	  }
	};
	e.fn[i] = function (t) {
	  return this.each(function () {
		if (!e.data(this, "plugin_" + i)) {
		  e.data(this, "plugin_" + i, new o(this, t));
		}
	  });
	};
  })(jQuery, window, document);
  /* end jQuery Press and Hold */
  (function ($) {
	var fishmovement,
	  progresstimer,
	  bottomtimer,
	  baittimer,
	  progressupdated = false;
	$(".fishing .sea .fish").hide();
	$(".fishing .sea .fish").animate(
	  {
		top: randomNumber($(".fishing .sea .fish").data("depth") * 0.89, 89) + "%"
	  },
	  $(".fishing .sea .fish").data("speed"),
	  function () {
		$(".fishing .sea .fish").fadeIn();
		movefishy();
	  }
	);
	$("body").pressAndHold({
	  holdTime: -1,
	  progressIndicatorRemoveDelay: 100
	});
	$("body").on("start.pressAndHold", function (event) {
	  clearInterval(bottomtimer);
	  clearInterval(baittimer);
	  $(".fishing .rod .reel .handle").removeClass("reelout").addClass("reelin");
	  setTimeout(function () {
		$(".fishing .rod .reel .handle").removeClass("reelin");
	  }, 200);
	  $("#bait").stop(true);
	  baittimer = setInterval(function () {
		$(".fishing .rod .reel .handle")
		  .removeClass("reelout")
		  .addClass("reelin");
		$("#bait").animate(
		  { top: "-=" + $(".fishing").data("reelpower") + "%" },
		  {
			easing: "linear",
			step: function (now) {
			  if (now <= 0) $("#bait").stop(true);
			  checkoverlapping();
			}
		  }
		);
	  }, 400);
	});
	$("body").on("end.pressAndHold", function (event) {
	  $(".fishing .rod .reel .handle").removeClass("reelin");
	  $("#bait").stop(true);
	  clearInterval(bottomtimer);
	  clearInterval(baittimer);
	  reelgravity();
	});
	reelgravity();
	function reelgravity() {
	  $(".fishing .rod .reel .handle").addClass("reelout");
	  $("#bait")
		.animate(
		  { top: "79%" },
		  {
			duration: parseInt($(".fishing").data("baitweight")) * 1000,
			complete: function () {
			  $(".fishing .rod .reel .handle").removeClass("reelout");
			},
			step: function (now) {
			  checkoverlapping();
			}
		  }
		)
		.animate({ top: "76%" }, 300, function () {
		  if (!progressupdated) {
			bottomtimer = setInterval(function () {
			  progressupdated = true;
			  var baitbound = $("#bait")[0].getBoundingClientRect(),
				fishbound = $(".fishing .sea .fish")[0].getBoundingClientRect(),
				overlaping = !(
				  baitbound.right < fishbound.left ||
				  baitbound.left > fishbound.right ||
				  baitbound.bottom < fishbound.top ||
				  baitbound.top > fishbound.bottom
				);
			  progressbar(overlaping);
			}, $(".fishing").data("progressupdaterate"));
		  }
		})
		.animate({ top: "79%" }, 300)
		.animate({ top: "77%" }, 300)
		.animate({ top: "79%" }, 500);
	}
	function checkoverlapping() {
	  var baitbound = $("#bait")[0].getBoundingClientRect(),
		fishbound = $(".fishing .sea .fish")[0].getBoundingClientRect(),
		overlaping = !(
		  baitbound.right < fishbound.left ||
		  baitbound.left > fishbound.right ||
		  baitbound.bottom < fishbound.top ||
		  baitbound.top > fishbound.bottom
		);
	  if (!progressupdated) {
		progressupdated = true;
		progresstimer = setTimeout(function () {
		  progressbar(overlaping);
		}, $(".fishing").data("progressupdaterate"));
	  }
	}
	function movefishy() {
	  fishmovement = setInterval(function () {
		var currentposition = parseInt($(".fishing .sea .fish")[0].style.top),
		  movedirection =
			Math.floor(Math.random() * currentposition) +
			Math.abs(
			  currentposition - $(".fishing .sea .fish").data("jumprange")
			);
		$(".fishing .sea .fish").animate(
		  { top: (movedirection <= 89 ? movedirection : 89) + "%" },
		  {
			duration: $(".fishing .sea .fish").data("speed"),
			step: function (now) {
			  if (now <= 0) $(".fishing .sea .fish").stop(true);
			}
		  }
		);
	  }, $(".fishing .sea .fish").data("movepremsec"));
	}
	function progressbar(overlapping) {
	  clearTimeout(progresstimer);
	  var progressbarheight = parseFloat(
		$(".fishing .progress .bar")[0].style.height
	  );
	  if (overlapping) {
		if (progressbarheight < 100) {
		  $(".fishing .progress .bar").animate(
			{
			  height: progressbarheight + $(".fishing").data("progress") + "%"
			},
			$(".fishing").data("progressupdaterate"),
			"linear"
		  );
		} else {
		  toastr.success("You caught the fish. Good job!!", "Horray!!");
		  reset();
		}
	  } else {
		if (progressbarheight > 0) {
		  $(".fishing .progress .bar").animate(
			{
			  height:
				progressbarheight - $(".fishing").data("progresspenalty") + "%"
			},
			$(".fishing").data("progressupdaterate"),
			"linear"
		  );
		}
	  }
	  progressupdated = false;
	}
	function reset() {
	  clearInterval(bottomtimer);
	  clearInterval(fishmovement);
	  clearInterval(baittimer);
	  $(".fishing .sea .fish").hide();
	  $(".fishing .sea .fish").animate(
		{
		  top:
			randomNumber($(".fishing .sea .fish").data("depth") * 0.89, 89) + "%"
		},
		$(".fishing .sea .fish").data("speed"),
		function () {
		  $(".fishing .sea .fish").fadeIn();
		  movefishy();
		}
	  );
	  $(".fishing .progress .bar").css("height", "0%");
	}
	function randomNumber(min, max) {
	  return Math.random() * (max - min) + min;
	}
  })(jQuery);
  