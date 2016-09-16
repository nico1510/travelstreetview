import React, {Component} from 'react';
import $ from 'jquery';
import './App.css';
import serverConfigModule from '../../config'
import {default as ImagePanelComponent} from './ImagePanelComponent';
import {default as GoogleMapsComponent} from './GoogleMapsComponent';
import {default as StreetViewComponent} from './StreetViewComponent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {default as scrollIntoView} from 'scroll-into-view';

const config = serverConfigModule(process.env.NODE_ENV);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedItem: undefined,
            streetViewPosition: undefined
        };

        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);

        // Needed for onTouchTap
        // http://stackoverflow.com/a/34015469/988941
        injectTapEventPlugin();
    }

    handleItemSelect(selectedItem) {
        this.state.list.forEach((item, index) => {
            if (item === selectedItem) {
                this.setState({
                    selectedItem: item,
                    streetViewPosition: item.gps
                });
                scrollIntoView($(`#image-panel`).find(`> div:nth-child(${index})`)[0]);
            }
        })
    }

    handleMapClick(event) {
        this.setState({
            streetViewPosition: event.latLng
        });
    }

    componentDidMount() {
        this.serverRequest = $.ajax({
                type: "GET",
                url: window.location.protocol + '//' + window.location.hostname + ':' + config.ports.http + config.listEndpoint,
                error: (xhr, status, error) => {
                    console.log("Error: " + xhr.responseText);
                },
                success: (list) => {
                    this.setState({list});
                }
            }
        );
    }


    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div className="App">
                    <div className="Google-container">
                        <GoogleMapsComponent selectedPosition={this.state.streetViewPosition} handleMapClick={this.handleMapClick} handleItemSelect={this.handleItemSelect} selectedItem={this.state.selectedItem} list={this.state.list}/>
                        <StreetViewComponent selectedPosition={this.state.streetViewPosition} />
                    </div>
                    <div className="App-footer">
                        <ImagePanelComponent handleItemSelect={this.handleItemSelect} selectedItem={this.state.selectedItem} list={this.state.list}/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
