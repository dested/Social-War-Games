
var preventPullToRefresh = (function preventPullToRefresh(lastTouchY) {
    lastTouchY = lastTouchY || 0;
    var maybePrevent = false;

    function setTouchStartPoint(event) {
        lastTouchY = event.touches[0].clientY;
        // console.log('[setTouchStartPoint]TouchPoint is ' + lastTouchY);
    }
    function isScrollingUp(event) {
        var touchY = event.touches[0].clientY,
            touchYDelta = touchY - lastTouchY;

        // console.log('[isScrollingUp]touchYDelta: ' + touchYDelta);
        lastTouchY = touchY;

        // if touchYDelta is positive -> scroll up
        if(touchYDelta > 0){
            return true;
        }else{
            return false;
        }
    }

    return {
        // set touch start point and check whether here is offset top 0
        touchstartHandler: function(event) {
            if(event.touches.length != 1) return;
            setTouchStartPoint(event);
            maybePrevent = window.pageYOffset === 0;
            // console.log('[touchstartHandler]' + maybePrevent);
        },
        // reset maybePrevent frag and do prevent
        touchmoveHandler: function(event) {
            if(maybePrevent) {
                maybePrevent = false;
                if(isScrollingUp(event)) {
                    // console.log('======Done preventDefault!======');
                    event.preventDefault();
                    return;
                }
            }
        }
    }
})();
// usage
document.addEventListener('touchstart', preventPullToRefresh.touchstartHandler);
document.addEventListener('touchmove', preventPullToRefresh.touchmoveHandler);