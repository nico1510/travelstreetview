import React from 'react';
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";
import {GoogleMap} from "react-google-maps";

function StreetViewComponent(props) {

    let streetViewContent;

    if (!props.selectedPosition) {
        streetViewContent = 'Select an image to show streetview';
    } else {

        const steetViewPanorama = initStreetViewPanorama(props.selectedPosition);

        streetViewContent = (
            <ScriptjsLoader
                hostname={"maps.googleapis.com"}
                pathname={"/maps/api/js"}
                query={{key: 'AIzaSyCtpyLylm0fZPF8ikfs-UTtctdn-xWxxaU', libraries: `geometry,drawing,places`}}
                loadingElement={
                    <div style={{height: `100%`}}>
                        Loading Map...
                    </div>
                }

                containerElement={
                    <div style={{height: `100%`}}/>
                }

                googleMapElement={
                    <GoogleMap
                        streetView={steetViewPanorama}>
                    </GoogleMap>
                }/>
        );
    }

    return (
        <div id='streetViewMapHolder' className='StreetView-container'>
            {streetViewContent}
        </div>
    )
}


function initStreetViewPanorama(pos) {
    if(typeof google !== 'undefined') {
        return new google.maps.StreetViewPanorama(
            document.getElementById('streetViewMapHolder'), {
                position: pos,
                pov: {
                    heading: 34,
                    pitch: 10
                }
            });
    } else {
        return undefined;
    }
}


export default StreetViewComponent;