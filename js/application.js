House = {
	blockTarget:"",
	placeTarget:"",
	activeBlock:"",
	blockDimensions:[0,0],
	targetCoordinates:[0,0],
	targetImageBlocks:[ ["n","n"], ["n","n"] ], // n, s, v, h
	targetImage:"",
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
			House.targetCoordinates = House.lookupPlaceholder(House.placeTarget);
			//console.log( "Focused on:" + House.targetCoordinates.join('x') );
		},function(){
			House.placeTarget = "";
		});

		$("#Container").mousedown(function(e){


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
			switch(House.activeBlock){
				case "blockSingle":
					House.blockDimensions = [1,1];
					break;
				case "blockTall":
					House.blockDimensions = [1,2];
					break;
				case "blockWide":
					House.blockDimensions = [2,1];
					break;
				case "blockDelete":
					break;
				default:
			}
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
			var affected = House.affectedBlocks( House.targetCoordinates[0], House.targetCoordinates[1], House.blockDimensions[0], House.blockDimensions[1] );
			//console.log( [House.targetCoordinates[0], House.targetCoordinates[1], House.blockDimensions[0], House.blockDimensions[1]].join(","))
			var affectedTargets = [];
			for(var i=0;i<affected.length;i++){
				var affectedTarget = House.lookupBlocks(affected[i][0],affected[i][1]);
				if (affectedTarget) {
					affectedTargets.push( affectedTarget );
				}
			}
			//console.log( affectedTargets[0] + "-" + (affectedTargets[1]?affectedTargets[1]:"") );

			switch(House.activeBlock){
				case "blockSingle":
					for(var i=0;i< affectedTargets.length;i++){
						// Handle conflicts in placements here.
						House.setPlaceholder(House.placeTarget, "s");
						$("#"+House.placeTarget).css('background','#f00');
					}
					break;
				case "blockTall":
					for(var i=0;i< affectedTargets.length;i++){
						House.setPlaceholder(affectedTargets[i], "v");
						$("#"+affectedTargets[i]).css('background','#00f');
					}
					break;
				case "blockWide":
					for(var i=0;i< affectedTargets.length;i++){
						House.setPlaceholder(affectedTargets[i], "h");
						$("#"+affectedTargets[i]).css('background','#0f0');
					}
					break;
				case "blockDelete":
					for(var i=0;i< affectedTargets.length;i++){
						House.setPlaceholder(affectedTargets[i], "n");
						$("#"+affectedTargets[i]).css('background','#000');
					}
					break;
				default:
			}
			House.blockDimensions = [0,0];
			House.activeBlock = "";
		});

		$("#Container").mousemove(function(e){
			if(!console) console = {};
			var pageCoords = "( " + e.pageX + ", " + e.pageY + " )";
			var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";
			mouseX = e.pageX;
			mouseY = e.pageY;
			//console.log("( e.pageX, e.pageY ) : " + pageCoords);
			//console.log("( e.clientX, e.clientY ) : " + clientCoords);
		});
		$("#blocksActions").click(function(e){
			if($(this).hasClass("modeCombine")){
				House.combine();
			}else{
				House.resetProcess();
			}
		});
	},
	init: function(){
		$(document).ready(function(){
			House.setupActions();
		});
	},
	affectedBlocks: function(overx,overy, sizex,sizey){
		switch(overx){
			case 1:
				switch(overy){
					case 1:
						if(sizex>1){
							affected = [[1,1],[2,1]];
						}else if(sizey>1){
							affected = [[1,1],[1,2]];
						}else{
							affected = [[overx,overy]];
						}
						break;
					case 2:
						if(sizex>1){
							affected = [[1,2],[2,2]];
						}else if(sizey>1){
							affected = [[1,1],[1,2]];
						}else{
							affected = [[overx,overy]];
						}
						break;
				}
				break;
			case 2:
				switch(overy){
					case 1:
						if(sizex>1){
							affected = [[1,1],[2,1]];
						}else if(sizey>1){
							affected = [[2,1],[2,2]];
						}else{
							affected = [[overx,overy]];
						}
						break;
					case 2:
						if(sizex>1){
							affected = [[1,2],[2,2]];
						}else if(sizey>1){
							affected = [[2,1],[2,2]];
						}else{
							affected = [[overx,overy]];
						}
						break;
				}
				break;
		}

		return affected;
	}, 
	setPlaceholder: function(placeholder,type){
		var target = House.lookupPlaceholder(placeholder);
		//console.log( target.join("-") );
		House.targetImageBlocks[target[0]-1 ][target[1]-1 ] = type;
	},
	resetPlaceholders: function(){

		House.targetImageBlocks = [ ["n","n"], ["n","n"] ]
	},
	lookupBlocks: function(x,y){
		var place = false;
		switch(x){
			case 1:
				switch(y){
					case 1:
						place = "placeHolder1";
						break;
					case 2:
						place = "placeHolder3";
						break;
				}
				break;
			case 2:
				switch(y){
					case 1:
						place = "placeHolder2";
						break;
					case 2:
						place = "placeHolder4";
						break;
				}
				break;
		}
		//console.log(x+","+y+": "+place);
		return place;
	},
	lookupPlaceholder: function(name){
		switch(name){
			case 'placeHolder1':
				return [1,1];
			case 'placeHolder2':
				return [2,1];
			case 'placeHolder3':
				return [1,2];
			case 'placeHolder4':
				return [2,2];
		}
	},
	combine:function(){
		var combined = [ House.targetImageBlocks[0][0], House.targetImageBlocks[1][0], House.targetImageBlocks[0][1], House.targetImageBlocks[1][1] ].join("");
		var image = "panels/"+combined+".png";
		$("#Present").html("<img src='"+image+"' width='500' height='500'>").show("fast");
		$("#blocksActions").html("Reset").removeClass("modeCombine").addClass("modeReset");

		//console.log( combined );
	},
	resetProcess:function(){
		$("#Present").hide("fast").html("");
		$("#blocksActions").html("Combine").addClass("modeCombine").removeClass("modeReset");
	},
};
House.init();