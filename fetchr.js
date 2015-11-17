// FETCHR.js
//    simplest ever XHR utility abiding by promises, timeout
//    and cancellation directives

const identity = "Fetchr 0.1";

function promiseEnabled() {
    // more here
    if (typeof window.Promise === 'undefined') {
        throw new Error( identity.concat(
            ' requires a Promise API implementation, but the current environment doesn\'t support it.',
            'You may need to load a polyfill such as https://github.com/petkaantonov/bluebird.')
        );
        return false;
    }
    return true;
}

function fetchr( sURL, timeoutDuration, returnJSON ) {
    /* Return a promise object that resolves with the response value
     * or rejects with descriptive context info
     *
     * @sURL            - reqd - a URI target presumed of good format
     * @timeoutDuration - opt  - allowed duration for the call (ms), default UNDEF
     * @returnJSON      - opt  - parse response before returning it, default TRUE
     *
     */
    if ( promiseEnabled() && sURL ) {
        // OK to continue

        let timeout = timeoutDuration || undefined;
        let isJson = returnJSON || true;

        return new Promise( function( resolve, reject ) {

            // Setup the XHR object
            let request = new XMLHttpRequest();
            let self = this;
            request.open( 'GET', sURL );
            request.timeout = timeout;

            // Add event listeners for interesting events
            request.addEventListener( "load", function( e ) {
                // If client specified JSON via @returnJSON,
                // attempt to parse the response into an object
                var payload = isJson ? JSON.parse( this.responseText ) : this.responseText;
                resolve( {
                    "result": "OK",
                    "payload": payload
                } )
            } );

            request.addEventListener( "timeout", function( e ) {
                // If client specified a duration limit via @timeoutDuration,
                // and the call does not return in time, reject the promise
                // (Note: the actual XHR is cancelled by the platform)
                reject( {
                    "result": "FAILED",
                    "status": "timeout"
                } )
            });

            request.addEventListener( "abort", function( e ) {
                reject( {
                    "result": "CANCELLED",
                    "status": this.status,
                    "message": this.statusText
                } )
            });

            request.addEventListener( "error", function( e ) {
                reject( {
                    "result": "ERROR",
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

export default fetchr;
