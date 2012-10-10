House = {
	blockTarget:"",
	placeTarget:"",
	activeBlock:"",
	mouseX:-1,
	mouseY:-1,
	setupActions: function(){
		// Track the block we might potentially request
		$("#Toolbar .block").hover(function(){
			House.blockTarget = $(this).attr("name");
		},function(){
			House.blockTarget = "";
		});

		$("#House .box").hover(function(){
			House.placeTarget = $(this).attr("id");
		},function(){
			House.placeTarget = "";
		});

		$("#Workshop").mousedown(function(e){


			if(!House.blockTarget) return false;

			House.activeBlock = House.blockTarget;
			/*
			var Holder = $("<div id='PlaceMe'>");
			switch(House.blockTarget){
				case "blockTall":
					Holder.addClass("boxTall");
					break;
				case "blockWide":
					Holder.addClass("boxWide");
					break;
				case "blockSingle":
					Holder.addClass("boxSingle");
					break;
				default:
			}
			Holder.addClass("boxSample");

			//Holder.
			/* Visual
			$("body").append(Holder);
			*/
			e.preventDefault();
		}).mouseup(function(){
			/* Visual
			$("#PlaceMe").remove();
			*/
			//alert(House.activeBlock+"|"+House.placeTarget);
			
			
			if(!House.placeTarget) {
				House.activeBlock = "";
				return false;
			}
			if(!House.activeBlock) return false;
			/*
			switch(House.placeTarget){
				case "placeHolder1":
					$("#"+House.placeTarget).css('background','#f00');
					break;
				case "placeHolder2":
					$("#"+House.placeTarget).css('background','#ff0');
					break;
				case "placeHolder3":
					$("#"+House.placeTarget).css('background','#00f');
					break;
				case "placeHolder4":
					$("#"+House.placeTarget).css('background','#0f0');
					break;
				default:
			}*/
			switch(House.activeBlock){
				case "blockSingle":
					$("#"+House.placeTarget).css('background','#f00');
					break;
				case "blockTall":
					$("#"+House.placeTarget).css('background','#00f');
					break;
				case "blockWide":
					$("#"+House.placeTarget).css('background','#0f0');
					break;
				case "blockDelete":
					$("#"+House.placeTarget).css('background','#000');
					break;
				default:
			}

			House.activeBlock = "";
		});

		$("#Workshop").mousemove(function(e){
			if(!console) console = {};
			var pageCoords = "( " + e.pageX + ", " + e.pageY + " )";
			var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";
			mouseX = e.pageX;
			mouseY = e.pageY;
			//console.log("( e.pageX, e.pageY ) : " + pageCoords);
			//console.log("( e.clientX, e.clientY ) : " + clientCoords);
		});
	},
	init: function(){
		$(document).ready(function(){
			House.setupActions();
		});
	}
};
House.init();