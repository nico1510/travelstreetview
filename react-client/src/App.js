import React, {Component} from 'react';
import './App.css';
import {default as injectDefaultCookieStrategyForFetch} from './fetch-with-cookies';
import {default as ImagePanelComponent} from './ImagePanelComponent';
import {default as GoogleMapsComponent} from './GoogleMapsComponent';
import {default as StreetViewComponent} from './StreetViewComponent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {default as scrollIntoView} from 'scroll-into-view';


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
        this.fetchPhotos = this.fetchPhotos.bind(this);

        // Needed for onTouchTap
        // http://stackoverflow.com/a/34015469/988941
        injectTapEventPlugin();

        injectDefaultCookieStrategyForFetch('same-origin');
    }

    handleItemSelect(selectedItem) {
        this.state.list.forEach((item, index) => {
            if (item === selectedItem) {
                this.setState({
                    selectedItem: item,
                    streetViewPosition: item.gps
                });
                scrollIntoView($(`#image-panel`).find(`> div:nth-child(${index + 1})`)[0]);
            }
        })
    }

    handleMapClick(event) {
        this.setState({
            streetViewPosition: event.latLng
        });
    }

    componentDidMount() {
        this.fetchPhotos();
    }

    fetchPhotos() {
        this.request = fetch('/api/list').then(response => response.json()).then(result => {
            const defaultSelectedItem = result[0];  // select first item by default
            this.setState({
                list: result,
                selectedItem: defaultSelectedItem,
                streetViewPosition: (defaultSelectedItem && defaultSelectedItem.gps)? defaultSelectedItem.gps : undefined
            })
        });
    }


    componentWillUnmount() {
        // abort the request here as soon as there is a solution for this (see here https://github.com/whatwg/fetch/issues/27)
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div className="App">
                    <div className="Google-container">
                        <GoogleMapsComponent selectedPosition={this.state.streetViewPosition}
                                             handleMapClick={this.handleMapClick}
                                             handleItemSelect={this.handleItemSelect}
                                             selectedItem={this.state.selectedItem}
                                             list={this.state.list}/>
                        <StreetViewComponent selectedPosition={this.state.streetViewPosition}/>
                    </div>
                    <div className="App-footer">
                        <ImagePanelComponent handleItemSelect={this.handleItemSelect}
                                             selectedItem={this.state.selectedItem}
                                             handleFileUpload={this.fetchPhotos}
                                             list={this.state.list}/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
