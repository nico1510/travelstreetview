/**
 * Created by nico on 09.08.16.
 */

import {default as React, Component} from "react";
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";
import {GoogleMap, Marker} from "react-google-maps";


export default class GoogleMapsComponent extends Component {

    handleMapClick(event) {
        console.log('The map was clicked');
    }

    handleMarkerRightclick(index, event) {
        console.log('I was right clicked');
    }

    render() {
        let key = 0;

        return (
            <div style={{height: "500px"}}>
                <ScriptjsLoader
                    hostname={"maps.googleapis.com"}
                    pathname={"/maps/api/js"}
                    query={{ key: 'AIzaSyCtpyLylm0fZPF8ikfs-UTtctdn-xWxxaU', libraries: `geometry,drawing,places` }}
                    loadingElement={
                      <div {...this.props} style={{ height: `100%` }}>
                        Loading Map...
                      </div>
                    }

                    containerElement={
                        <div {...this.props} style={{ height: `100%` }} />
                    }

                    googleMapElement={
                      <GoogleMap
                        ref={googleMap => {
                            if (!googleMap) {
                               return;
                            }

                            let bounds = new google.maps.LatLngBounds();
                            this.props.list.forEach(function(item){
                               bounds.extend(new google.maps.LatLng (item.gps.lat,item.gps.lng));
                            });
                            googleMap.props.map.setCenter(bounds.getCenter());
                            googleMap.props.map.fitBounds(bounds);
                        }}
                        defaultZoom={3}
                        defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
                        onClick={this.handleMapClick.bind(this)} >
                        {this.props.list.map((item, index) => {
                          return (
                            <Marker position={item.gps} key={key++} onRightclick={this.handleMarkerRightclick.bind(this, index)}
                            />
                          );
                        })}
                        </GoogleMap>
    }/>
            </div>
        )
            ;
    }
}
