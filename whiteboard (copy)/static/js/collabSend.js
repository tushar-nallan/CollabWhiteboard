var MessageSender = {};
$(document).ready(function(){
	MessageSender.sendChange = function(elems){
		console.log("Z");
		console.log(elems);
		docId = $("#collabDetails #docId").html()
		layer = svgCanvas.getCurrentLayer();
		for(i=0;i<elems.length;i++){
			if(!elems[i]) continue;
			elems_str = (new XMLSerializer).serializeToString(elems[i]);
 			console.log($("#svgcontent #"+elems[i].getAttribute("id")).length);
			remove = $("#svgcontent #"+elems[i].getAttribute("id")).length ? false : true;
			$.ajax({
				url: '/whiteboard/default/changeDoc/',
				type: 'POST',
				data : {
					elements:elems_str,
					layer:layer,
					remove:remove,
					docId:docId
				},
				success: function(data){
					if(data=="0"){
						notif("error","Something went wrong, Please Re-login");
					}
				}
			});
		}
	}
});