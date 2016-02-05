/*
 *    FETCHR.js ::
 *    Simplest ever client-side XHR utility abiding by promises, 
 *    timeout and cancellation directives. Call the default export
 *    providing a URL, and optionally, a timeout limit and
 *    demand for JSON style response data.
 *
 *    Requirements ::
 *    A Promise implementation; we like BluebirdJS, but RSVP is nice, too.
 *
 *    Use ::
 *    fetchr( "http://api.acme.international/fortune", 'GET', 4500, true ).then(
 *       function ( data ) {
 *           console.log( 'Truth:', data );
 *       },
 *       function ( reason ) {
 *           console.error( 'Something went horribly wrong', reason );
 *       });
 *
 */

export function fetchr( sURL, method, errMessage, timeoutDuration, returnJSON ) {
    /* Return a promise object that resolves with the response value
     * or rejects with descriptive context info
     *
     * @sURL            - reqd - a URI target presumed of good format
     * @method          - opt  - HTTP verb dictating the operation, default GET
     * @errMessage      - opt  - string to post to console when bad things happen
     * @timeoutDuration - opt  - allowed duration for the call (ms), default UNDEF
     * @returnJSON      - opt  - parse response before returning it, default TRUE
     *
     */
     
    const identity = "Fetchr 0.3";
     
    var promiseEnabled = function() {
        // more here
        if (typeof window.Promise === 'undefined') {
            throw new Error( identity.concat(
                ' requires a Promise API implementation, but the current environment doesn\'t support it.',
                'You may need to load a polyfill such as https://github.com/petkaantonov/bluebird.')
            );
        }
        return true;
    }
    
    if ( promiseEnabled() && sURL ) {
        // OK to continue

        let action = method || 'GET';
        action = action.toUpperCase();
        
        let timeout = timeoutDuration || undefined;
        let isJson = returnJSON || true;

        return new Promise( function( resolve, reject ) {

            // Setup the XHR object
            let request = new XMLHttpRequest();
            let self = this;
            request.open( action, sURL );
            request.timeout = timeout;

            // Add event listeners for interesting events
            request.addEventListener( "load", function( e ) {
                // If client specified JSON via @returnJSON,
                // attempt to parse the response into an object
                if ( this.response && this.responseText && this.responseText[0] !== "<" ) {
                    var payload = isJson ? JSON.parse( this.responseText ) : this.responseText;
                    resolve( payload );
                } else {
                    resolve( {} );
                };
            } );

            request.addEventListener( "timeout", function( e ) {
                // If client specified a duration limit via @timeoutDuration,
                // and the call does not return in time, reject the promise
                // (Note: the actual XHR is cancelled by the platform)
                reject( {
                    "result": action + " FAILED",
                    "status": "timeout"
                } )
            });

            request.addEventListener( "abort", function( e ) {
                reject( {
                    "result": action + " CANCELLED",
                    "status": this.status,
                    "message": this.statusText
                } )
            });

            request.addEventListener( "error", function( e ) {
                console.error( 'Fetchr had a bad problem:', errMessage )
                reject( {
                    "result": action + " ERROR",
                    "status": this.status,
                    "message": this.statusText
                } )
            } );

            request.addEventListener( "progress", function( e ) {
                //console.log( 'PROGRESS', e )
            } );

            // Now go for it...
            request.send();
        } );
    }
}

