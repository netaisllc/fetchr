// main.js
"use strict"
import fetchr from './fetchr';

var el = document.querySelector( "#app" );
var fortune = "http://api.acme.international/fortune";
var doppio = "http://dgtest4.elasticbeanstalk.com/SimpleServletProject/GlobalDocsList";

fetchr( doppio, 500, true ).then(
    function ( data ) {
        console.log( 'Truth: ', data );
        el.innerHTML = "All done OK";

    },
    function ( reason ) {
        console.error( 'Something went horribly wrong', reason );
        el.innerHTML = reason.result + ": " + reason.status;
    });



