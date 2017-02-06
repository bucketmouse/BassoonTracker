UI.knob = function(initialProperties){
	var me = UI.element();
	me.type = "knob";

	window.know = me;

	var label = "";
	var font;
	var textAlign = "left";
	var paddingTop = 0;

	var angle = 0;
	var value = 50;
	var startValue = value;

	var min = -160;
	var max = 160;

	var filterChain;

	var properties = ["left","top","width","height","name","font","label","textAlign","paddingTop"];

	var img = Y.getImage("knob_back");
	var front = Y.getImage("knob_front");
	var padding = 16;
	me.width = img.width + (padding*2);
	me.height = img.height + (padding*2);
	me.setSize(me.width,me.height);

	me.setProperties = function(p){

		properties.forEach(function(key){
			if (typeof p[key] != "undefined"){
				// set internal var
				switch(key){
					case "label": label=p[key];break;
					case "font": font=p[key];break;
					case "textAlign": textAlign=p[key];break;
					case "paddingTop": paddingTop=parseInt(p[key]);break;
					default:
						me[key] = p[key];
				}
			}
		});

		me.setSize(me.width,me.height);
		me.setPosition(me.left,me.top);

	};

	me.setFont = function(f){
		font = f;
		me.refresh();
	};

	me.setLabel = function(text){
		label = text;
		me.refresh();
	};

	me.setValue = function(newValue){
		angle = newValue;
		me.refresh();
	};


	me.render = function(internal){
		if (me.needsRendering){
			internal = !!internal;

			me.clearCanvas();

			var scale = 1;
			scale = 0.8;

			var imgw = img.width * scale;
			var imgh = img.height * scale;

			var w = imgw / 2;
			var h = imgh / 2;

			//me.ctx.drawImage(img,0,0);

			me.ctx.save();
			me.ctx.translate(padding+w,padding+h);
			me.ctx.drawImage(img,-w,-h,imgw,imgh);


			// value is from 0 to 100;
			//var value = angle+50;

			var minAngle = -230;
			var maxAngle = 50;

			var max = Math.abs(minAngle) + maxAngle;
			var angleValue = minAngle + (value/100)*max;

			var startAngle = minAngle * Math.PI/180;
			var endAngle = angleValue * Math.PI/180;

			me.ctx.fillStyle = "rgba(130,200,255,0.5)";
			me.ctx.beginPath();
			me.ctx.arc(0,0,30,startAngle,endAngle, false); // outer (filled)
			me.ctx.arc(0,0,25,endAngle,startAngle, true); // outer (unfills it)
			me.ctx.fill();


			var angle = (value/100) * 320 - 160;
			me.ctx.rotate(angle * Math.PI/180);
			me.ctx.drawImage(front,-w,-h,imgw,imgh);

			me.ctx.restore();

			if (label){
				var labelX = (me.width - (label.length*6))/2;
				labelX = padding + w - (label.length*3);
				fontSmall.write(me.ctx,label,labelX,imgh + padding + 4);
			}

		}
		me.needsRendering = false;

		if (internal){
			return me.canvas;
		}else{
			me.parentCtx.drawImage(me.canvas,me.left,me.top,me.width,me.height);
		}
	};

	me.onDragStart = function(){
		startValue = value;

		if (!filterChain){
			filterChain = new FilterChain();

			var trackVolume = Audio.trackVolume[1];
			var trackPanning = Audio.trackPanning[1];

			trackVolume.disconnect();

			filterChain.connect(trackVolume,trackPanning);

			window.f = filterChain;
		}
	};

	me.onDrag=function(touchData){

			var delta =  touchData.dragY - touchData.startY;
			value = startValue + delta;
			value = Math.max(value,0);
			value = Math.min(value,100);
			me.refresh();

			filterChain.frequency(value/100);
	};

	return me;
};


