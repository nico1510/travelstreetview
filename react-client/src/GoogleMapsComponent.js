/**
 * Created by nico on 09.08.16.
 */

import {default as React, Component} from "react";
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";
import {GoogleMap, Marker} from "react-google-maps";


export default class GoogleMapsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            markers: [{
                position: {
                    lat: 25.0112183,
                    lng: 121.52067570000001,
                },
                key: `Taiwan`,
                defaultAnimation: 2,
            }],
        }
    }
    
    handleMapClick(event) {
        console.log('The map was clicked');
    }

    handleMarkerRightclick(index, event) {
        console.log('I was right clicked');
    }

    render() {
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
              console.log(googleMap);
              console.log(`Zoom: ${ googleMap.getZoom() }`);
              console.log(`Center: ${ googleMap.getCenter() }`);
            }}
            defaultZoom={3}
            defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
            onClick={this.handleMapClick.bind(this)} >
            {this.state.markers.map((marker, index) => {
              return (
                <Marker
                  {...marker}
                  onRightclick={this.handleMarkerRightclick.bind(this, index)}
                />
              );
            })}
          </GoogleMap>
        }/>
            </div>
        );
    }
}
