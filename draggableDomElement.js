/**
 * Directive that enables dom elements to be dragged and dropped
 * on a target, The target is identified by a css selector
 * It fires events when drag begins and ends
 */


function enableDrag() {
	element.css({
		cursor: 'pointer'
	});

	//Fire a drag start events
	element.on('mousedown', mouseStart);
	element.on('touchstart', touchStart);
}

function disableDrag() {
	element.css({
		cursor: 'auto'
	});

	//unregister drag events
	element.off('mousedown', mouseStart);
	element.off('touchstart', touchStart);
}

function broadcastMouseStart() {
	if (!mouseUpOrClickHappened) {
		if (!touchStartHappened && (touchMoveHappened === 0) && !touchEndHappened) {
			dropZone = $(scope.dropZoneID);
			dropZone.on('mouseup', dragEnd);
			dropZone.on('click', dragEnd);
			element.on('click', dragEnd);

			mouseEvent.preventDefault();

			SceneService.onStartDragDomElement(
				scope.draggableData, mouseEvent.originalEvent, dropZone[0], null);

			$rootScope.$apply();
		}
	} else {
		mouseUpOrClickHappened = false;
	}
}




function mouseStart(event) {
	mouseEvent = event;
	$timeout(broadcastMouseStart, 150);
	element.on('mouseup', mouseUp);
	element.on('click', click);
}

function mouseUp() {
	mouseUpOrClickHappened = true;
	element.unbind('mouseup', mouseUp);
	element.unbind('click', click);
}

function click() {
	mouseUp();
}


function touchStart(touchEvent) {

	touchEndHappened = false;
	touchStartHappened = true;
	dropZone = $(scope.dropZoneID);
	element.on('touchmove', touchMove);
	element.on('touchend', touchEnd);

	currentTouchEvent = touchEvent;
	$rootScope.$apply();

	$timeout(broadcastTouchStart, 300);
}

function broadcastTouchStart() {
	if ((touchMoveHappened === 0) && !touchEndHappened) {
		dropZone.on('touchend', dragEnd);
		element.unbind('touchmove', touchMove);

		SceneService.onStartDragDomElement(
			scope.draggableData, mouseEvent.originalEvent, dropZone[0], null);
	}
	resetTouchBooleans();
	$rootScope.$apply();
}

function touchMove(touchEvent) {
	touchStartHappened = false;
	touchMoveHappened += 1;
	element.unbind('touchmove', touchMove);
}

function touchEnd(touchEvent) {
	touchStartHappened = false;
	touchEndHappened = true;
	element.unbind('touchend', touchEnd);
}

//Fire a drag end event
function dragEnd() {
	// Not used for now
	$rootScope.$apply();
	dropZone.unbind('mouseup', dragEnd);
	dropZone.unbind('touchend', dragEnd);
	dropZone.unbind('click', dragEnd);
}

function resetTouchBooleans() {
	touchStartHappened = false;
	touchEndHappened = false;
	touchMoveHappened = 0;
}
