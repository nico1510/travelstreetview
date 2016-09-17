/**
 * Created by nico on 09.08.16.
 */

import {default as React, Component} from "react";
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";
import {GoogleMap, Marker} from "react-google-maps";
//import {default as MarkerClusterer} from 'react-google-maps/lib/addons/MarkerClusterer';
import {hasGPSattached, isSamePosition} from './Utils';

export default class GoogleMapsComponent extends Component {

    constructor(props) {
        super(props);
        this.panToMarkers = this.panToMarkers.bind(this);
        this.state = {initialRender: true};
    }

    panToMarkers(googleMap) {
        // panToMarkers should only be invoked on initial render
        if (this.state.initialRender) {
            let bounds = new google.maps.LatLngBounds();
            this.props.list.filter(hasGPSattached).forEach(function (item) {
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
                            ref={googleMap => {
                                if (!googleMap) {
                                    return;
                                }
                                this.panToMarkers(googleMap);
                            }}
                            center={(this.props.selectedItem) ? this.props.selectedItem.gps : undefined}
                            zoom={(this.props.selectedItem) ? 12 : undefined}
                            mapTypeId='hybrid'
                            onClick={this.props.handleMapClick}>
                            {/*                       <MarkerClusterer
                             averageCenter={ true }
                             enableRetinaIcons={ true }
                             gridSize={60}>
                             */}
                            {/* Marker for 'map-click-event' position */}
                            {(!this.props.selectedPosition || (this.props.selectedItem && isSamePosition(this.props.selectedPosition, this.props.selectedItem.gps))) ? undefined :
                                <Marker position={this.props.selectedPosition}
                                        icon='https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'/>
                            }

                            {this.props.list.filter(hasGPSattached).map((item) => {
                                return (
                                    (this.props.selectedItem && isSamePosition(this.props.selectedItem.gps, item.gps)) ? undefined :
                                        <Marker
                                            position={item.gps}
                                            key={key++}
                                            onClick={this.props.handleItemSelect.bind(this, item)}/>
                                );
                            })}

                            {/* Marker for selected item */}
                            {(!this.props.selectedItem) ? undefined :
                                <Marker position={this.props.selectedItem.gps}
                                        icon='https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                                        onClick={this.props.handleItemSelect.bind(this, this.props.selectedItem)}/>
                            }
                            {/*
                             </MarkerClusterer>
                             */}
                        </GoogleMap>
                    }/>
            </div>
        );
    }
}
