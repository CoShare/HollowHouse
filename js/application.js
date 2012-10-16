House = {
	blockTarget:"",
	placeTarget:"",
	activeBlock:"",
	blockDimensions:[0,0],
	targetCoordinates:[0,0],
	targetImageBlocks:[ ["n","n"], ["n","n"] ], // n, s, v, h
	targetImage:"",

	images:{
		"nnnn":{active:true},
		"nnns":{active:true},
		"nnsn":{active:true},
		"nsnn":{active:true},
		"snnn":{active:true},
		"snns":{active:true},
		"snsn":{active:true},
		"ssnn":{active:true},
		"ssns":{active:true},
		"sssn":{active:true},
		"ssss":{active:true},
		"nsns":{active:true},
		"nssn":{active:true},
		"nsss":{active:true},
		"nnss":{active:true},
		"vsvs":{active:true},
		"vsvn":{active:true},
		"vvvv":{active:true},
		"nvnv":{active:true},
		"hhnn":{active:true},
		"hhhh":{active:true},
		"nnhh":{active:true},
		"vnvs":{active:true},
		"vnvn":{active:true},
		"svnv":{active:false},
		"svsv":{active:false},
		"nvsv":{active:false},
		"hhss":{active:false},
		"hhsn":{active:false},
		"hhns":{active:false},
		"sshh":{active:false},
		"snhh":{active:false},
		"nshh":{active:false},
	},
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

		$(window).mousemove(function(e){
			$("#cursorHelper").css("top",e.pageY+5);
			$("#cursorHelper").css("left",e.pageX+5);
		});

		$("#Container").mousedown(function(e){


			if(!House.blockTarget) return false;
			if( House.isCombined() ) House.resetProcess();
			
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
			$("#cursorHelper").css("display","block");
			switch(House.activeBlock){
				case "blockSingle":
					House.blockDimensions = [1,1];
					$("#cursorHelper").addClass("holderSingleMouse");
					break;
				case "blockTall":
					House.blockDimensions = [1,2];
					$("#cursorHelper").addClass("holderTallMouse");
					break;
				case "blockWide":
					House.blockDimensions = [2,1];
					$("#cursorHelper").addClass("holderWideMouse");
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
			
			$("#cursorHelper").removeClass();
			
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
					}
					break;
				case "blockTall":
					for(var i=0;i< affectedTargets.length;i++){
						House.setPlaceholder(affectedTargets[i], "v");
					}
					break;
				case "blockWide":
					for(var i=0;i< affectedTargets.length;i++){
						House.setPlaceholder(affectedTargets[i], "h");
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
			if(House.isCombined()){
				House.resetProcess();
			}else{
				House.combine();
			}
		});
	},
	isCombined:function(){
		if($("#blocksActions").hasClass("modeCombine")){
			return false;
		}
		return true;
	},
	init: function(){
		$(document).ready(function(){
			House.setupActions();
		});
	},
	affectedBlocks: function(overx, overy, sizex, sizey){
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
		if (type == "s") $("#"+placeholder).css('background','#f00');
		if (type == "v") $("#"+placeholder).css('background','#00f');
		if (type == "h") $("#"+placeholder).css('background','#0f0');

		House.targetImageBlocks[target[0]-1 ][target[1]-1 ] = type;
	},
	resetPlaceholders: function(){
		House.targetImageBlocks = [ ["n","n"], ["n","n"] ]
	},
	lookupBlocks: function(x,y){
		var place = false;
		if( x == 1 && y == 1) place = "placeHolder1";
		if( x == 1 && y == 2) place = "placeHolder3";
		if( x == 2 && y == 1) place = "placeHolder2";
		if( x == 2 && y == 2) place = "placeHolder4";
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

		$("#blocksActions").html("Reset").removeClass("modeCombine").addClass("modeReset");

		if( House.images[combined] && House.images[combined].active ){}else{
			$("#NotPresent").show("fast");
			return false;
		}

		$("#Present").html("<img src='"+image+"' width='500' height='500'>");
		$('#Present img').load(function() { 
			$("#Present").show("fast");
		});
		
		/*
		if(House.getCookie("check_"+combined)){
			House.setCookie("check_"+combined,"");
		}
		*/
		//console.log( combined );
	},
	resetProcess:function(){
		$("#Present").hide("fast").html("");
		$("#NotPresent").hide("fast");
		$("#blocksActions").html("Combine").addClass("modeCombine").removeClass("modeReset");
		$(".box").css('background','transparent');
		House.resetPlaceholders();
	},
	squareOffConflicts: function(){
		//Todo
	},
	setCookie: function(c_name,value,exdays){
		exdays = 365;
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
	},
	getCookie: function(c_name){
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++){
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			if (x==c_name){
				return unescape(y);
			}
		}
	},

};
House.init();