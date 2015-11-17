// main.js
"use strict"
import fetchr from './fetchr';

/*function showMessage ( payload ) {
    // Sample success callback
    console.info( ' Data payload:', payload );
}

var promise = fetchr( "http://api.acme.international/fortune", 4500, true );
promise.then(
    function( payload ) {
        console.warn( payload )
        showMessage( payload )
    },
    function( reason ) {
        console.error( reason )
    }
);*/


fetchr( "http://api.acme.international/fortune", 4500, true ).then(
    function ( data ) {
        console.log( 'Truth: ', data.payload );
    },
    function ( reason ) {
        console.error( 'Something went horribly wrong', reason );
    });