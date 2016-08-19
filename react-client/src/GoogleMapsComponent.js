/**
 * Created by nico on 09.08.16.
 */

import {default as React, Component} from "react";
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";
import {GoogleMap, Marker} from "react-google-maps";
//import {default as MarkerClusterer} from 'react-google-maps/lib/addons/MarkerClusterer';

export default class GoogleMapsComponent extends Component {

    constructor(props) {
        super(props);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMarkerRightclick = this.handleMarkerRightclick.bind(this);
        this.panToMarkers = this.panToMarkers.bind(this);

        this.state = {initialRender: true};
    }

    handleMapClick(event) {
        console.log('The map was clicked');
    }

    handleMarkerRightclick(index, event) {
        console.log('I was right clicked');
    }

    panToMarkers(googleMap) {
        // panToMarkers should only be invoked on initial render
        if (this.state.initialRender) {
            let bounds = new google.maps.LatLngBounds();
            this.props.list.forEach(function (item) {
                bounds.extend(new google.maps.LatLng(item.gps.lat, item.gps.lng));
            });
            googleMap.fitBounds(bounds);
            this.setState({initialRender: false});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // When initialRender is flipped to true the component should not re-render because the view is not affected by this state change
        if (this.state.initialRender && !nextState.initialRender) {
            return false;
        } else {
            return true;
        }
    }


    render() {
        let key = 0;

        return (
            <div className='G-maps-container'>
                <ScriptjsLoader
                    hostname={"maps.googleapis.com"}
                    pathname={"/maps/api/js"}
                    query={{ key: 'AIzaSyCtpyLylm0fZPF8ikfs-UTtctdn-xWxxaU', libraries: `geometry,drawing,places` }}
                    loadingElement={
                      <div style={{ height: `100%` }}>
                        Loading Map...
                      </div>
                    }

                    containerElement={
                        <div style={{ height: `100%` }} />
                    }

                    googleMapElement={
                      <GoogleMap
                        ref={googleMap => {
                            if (!googleMap) {
                               return;
                            }
                            this.panToMarkers(googleMap);
                        }}
                        center={(this.props.selectedItem)? this.props.selectedItem.gps: undefined}
                        zoom={(this.props.selectedItem)? 12: undefined}
                        mapTypeId='hybrid'
                        onClick={this.handleMapClick} >
{/*                       <MarkerClusterer
                          averageCenter={ true }
                          enableRetinaIcons={ true }
                          gridSize={60}>
*/}
                            {this.props.list.map((item, index) => {
                              return (
                                <Marker
                                    position={item.gps}
                                    key={key++}
                                    icon={(item===this.props.selectedItem)? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : undefined}
                                    onRightclick={this.handleMarkerRightclick.bind(this, index)}
                                />
                              );
                            })}
{/*
                            </MarkerClusterer>
*/}
                        </GoogleMap>
                    }/>
            </div>
        );
    }
}
