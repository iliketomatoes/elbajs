/**
 *
 * Version: 0.2.0
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 *
 * Copyright (c) Gianluca Guarini
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/

// helpers
var msEventType = function(type) {
        var lo = type.toLowerCase(),
            ms = 'MS' + type;
        return navigator.msPointerEnabled ? ms : lo;
    },
    debounce = function(fn, delay) {
        var t;
        return function() {
            var args = arguments;
            clearTimeout(t);
            t = setTimeout(function() {
                fn.apply(null, args)
            }, delay);
        };
    },
    touchevents = {
        touchstart: msEventType('PointerDown') + ' touchstart',
        touchend: msEventType('PointerUp') + ' touchend',
        touchmove: msEventType('PointerMove') + ' touchmove'
    },
    setListener = function(elm, events, callback) {
        var eventsArray = events.split(' '),
            i = eventsArray.length;

        while (i--) {
            elm.addEventListener(eventsArray[i], callback, false);
        }
    },
    getPointerEvent = function(event) {
        return event.targetTouches ? event.targetTouches[0] : event;
    },
    getTimestamp = function() {
        return new Date().getTime();
    },
    sendEvent = function(elm, eventName, originalEvent, data) {
        var customEvent = document.createEvent('Event');
        customEvent.originalEvent = originalEvent;
        data = data || {};
        data.x = currX;
        data.y = currY;
        data.distance = data.distance;

        // addEventListener
        if (customEvent.initEvent) {
            for (var key in data) {
                customEvent[key] = data[key];
            }
            customEvent.initEvent(eventName, true, true);
            elm.dispatchEvent(customEvent);
        }

        // inline
        if (elm['on' + eventName]) {
            elm['on' + eventName](customEvent);
        }
    };

// targetInstance points to the target Slider instance
var targetInstance = null;

var Tocca = {
    onTouchStart: function(e) {

        var pointer = getPointerEvent(e);

        // If we are clicking on the slider's arrow
        if (Utils.selectorMatches(pointer.target, 'a.elba-arrow')) {
            // Get the Slider instance
            targetInstance = Instances[pointer.target.getAttribute('data-elba-id')];
            if (classie.hasClass(pointer.target, 'elba-right-nav')) {
                targetInstance.goTo('next');
            } else {
                targetInstance.goTo('previous');
            }
        } else if (Utils.selectorMatches(pointer.target, '.elba')) {
            targetInstance = Instances[pointer.target.getAttribute('data-elba-id')];
        } else if (Utils.selectorMatches(pointer.target.parentNode, '.elba')) {
            targetInstance = Instances[pointer.target.parentNode.getAttribute('data-elba-id')];
        }

        // caching the current x
        cachedX = currX = pointer.pageX;
        // caching the current y
        cachedY = currY = pointer.pageY;

        longtapTimer = setTimeout(function() {
            sendEvent(e.target, 'longtap', e);
            target = e.target;
        }, longtapThreshold);

        // we will use these variables on the touchend events
        timestamp = getTimestamp();

        tapNum++;
    },
    onTouchEnd: function(e) {

        var eventsArr = [],
            now = getTimestamp(),
            deltaY = cachedY - currY,
            deltaX = cachedX - currX;

        // clear the previous timer if it was set
        clearTimeout(dblTapTimer);
        // kill the long tap timer
        clearTimeout(longtapTimer);

        if (deltaX <= -swipeThreshold){
        	if(targetInstance) {
        		targetInstance.goTo('previous');
        	}
            eventsArr.push('swiperight');
        }

        if (deltaX >= swipeThreshold){
        	if(targetInstance) {
        		targetInstance.goTo('next');
        	}
            eventsArr.push('swipeleft');
        }

        if (deltaY <= -swipeThreshold){
            eventsArr.push('swipedown');
        }

        if (deltaY >= swipeThreshold){
            eventsArr.push('swipeup');
        }

        if (eventsArr.length) {
            for (var i = 0; i < eventsArr.length; i++) {
                var eventName = eventsArr[i];
                sendEvent(e.target, eventName, e, {
                    distance: {
                        x: Math.abs(deltaX),
                        y: Math.abs(deltaY)
                    }
                });
            }
            // reset the tap counter
            tapNum = 0;
        } else {

            if (
                cachedX >= currX - tapPrecision &&
                cachedX <= currX + tapPrecision &&
                cachedY >= currY - tapPrecision &&
                cachedY <= currY + tapPrecision
            ) {
                if (timestamp + tapThreshold - now >= 0) {
                    // Here you get the Tap event
                    sendEvent(e.target, tapNum >= 2 && target === e.target ? 'dbltap' : 'tap', e);
                    target = e.target;
                }
            }

            // reset the tap counter
            dblTapTimer = setTimeout(function() {
                tapNum = 0;
            }, dbltapThreshold);

        }

        targetInstance = null;
    },
    onTouchMove: function(e) {

        var pointer = getPointerEvent(e);

        currX = pointer.pageX;
        currY = pointer.pageY;

        var deltaY = cachedY - currY,
            deltaX = cachedX - currX;

        if (tapNum > 0 && (Math.abs(deltaX) >= swipeThreshold || Math.abs(deltaY) >= swipeThreshold)) {
            sendEvent(e.target, 'drag', e, {
                delta: {
                    x: deltaX,
                    y: deltaY
                }
            });
        }
    }
};
var swipeThreshold = window.SWIPE_THRESHOLD || 100,
    tapThreshold = window.TAP_THRESHOLD || 150, // range of time where a tap event could be detected
    dbltapThreshold = window.DBL_TAP_THRESHOLD || 200, // delay needed to detect a double tap
    longtapThreshold = window.LONG_TAP_THRESHOLD || 1000, // delay needed to detect a long tap
    tapPrecision = window.TAP_PRECISION / 2 || 60 / 2, // touch events boundaries ( 60px by default )
    justTouchEvents = window.JUST_ON_TOUCH_DEVICES,
    tapNum = 0,
    currX, currY, cachedX, cachedY, timestamp, target, dblTapTimer, longtapTimer;

//setting the events listeners
// we need to debounce the callbacks because some devices multiple events are triggered at same time
setListener(document, touchevents.touchstart + (justTouchEvents ? '' : ' mousedown'), debounce(Tocca.onTouchStart, 1));
setListener(document, touchevents.touchend + (justTouchEvents ? '' : ' mouseup'), debounce(Tocca.onTouchEnd, 1));
setListener(document, touchevents.touchmove + (justTouchEvents ? '' : ' mousemove'), debounce(Tocca.onTouchMove, 1));
