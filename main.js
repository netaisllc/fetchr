// main.js
"use strict"
import fetchr from './fetchr';

var el = document.querySelector( "#app" );

fetchr( "http://api.acme.international/fortune", 1250, true ).then(
    function ( data ) {
        console.log( 'Truth: ', data );
        el.innerHTML = "All done OK";

    },
    function ( reason ) {
        console.error( 'Something went horribly wrong', reason );
        el.innerHTML = reason.result + ": " + reason.status;
    });



