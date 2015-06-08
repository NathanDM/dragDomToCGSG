/**
* Handle the drag from the DOM & canvas to the main canvas
*/

/**
 * The behavior when an element from draggableDomElement starts to get dragged.
 *
 * @method onStartDragElement
 * @param elementModel
 * @param mouseOrTouchEvent
 * @param canvas
 * @param dragEndCallback
 */
function onStartDragDomElement(elementModel, mouseOrTouchEvent, canvas, dragEndCallback) {

	//TODO : hide the menu to let the user drag on the canvas behind it
	
	var mousePosition = cgsgGetCursorPositions(mouseOrTouchEvent, canvas)[0];
   
   
   //Create the node from the elementNode
   var node = {}; //new CGSGNode in function of the given type
   
   
	   node.draggedFromMenu = true;
   
   //TODO : add the node to the scene
   
   //Trig the event to the canvas
		eventsHandler(mouseOrTouchEvent, canvas, dragEndCallback);
	}
}


function eventsHandler(mouseOrTouchEvent, canvas, dragEndCallback) {

	var mouseDownEvent;

	if (mouseOrTouchEvent.type == "touchstart") {
		//send the event to JQuery
		mouseDownEvent = jQuery.Event("mousedown", {
			pageX: mouseOrTouchEvent.touches[0].pageX,
			pageY: mouseOrTouchEvent.touches[0].pageY
		});
	} else {
		mouseDownEvent = jQuery.Event("mousedown", {
			pageX: mouseOrTouchEvent.pageX,
			pageY: mouseOrTouchEvent.pageY
		});
	}
	$(canvas).trigger(mouseDownEvent);

	if (mouseOrTouchEvent.type === "touchstart") {
		var libraryElement = mouseOrTouchEvent.target;

		function onTouchMove(e) {
			var mouseMove = jQuery.Event("mousemove", {
				pageX: e.originalEvent.touches[0].pageX,
				pageY: e.originalEvent.touches[0].pageY
			});
			$(canvas).trigger(mouseMove);
		}

		function onTouchEnd(e) {
			dragEndCallback();
			var mouseUp = jQuery.Event("mouseup", {
				pageX: e.originalEvent.changedTouches[0].pageX,
				pageY: e.originalEvent.changedTouches[0].pageY
			});
			$(canvas).trigger(mouseUp);
			$(libraryElement).unbind('touchmove', onTouchMove);
			$(libraryElement).unbind('touchend', onTouchEnd);
		}

		$(libraryElement).on('touchmove', onTouchMove);
		$(libraryElement).on('touchend', onTouchEnd);
	}

}
