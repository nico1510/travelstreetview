import React, {Component} from 'react';
import $ from 'jquery';
import './App.css';
import serverConfigModule from '../../config'
import {default as ImagePanelComponent} from './ImagePanelComponent';
import {default as GoogleMapsComponent} from './GoogleMapsComponent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

const config = serverConfigModule(process.env.NODE_ENV);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedItem: {}
        };

        this.handleItemSelect = this.handleItemSelect.bind(this);

        // Needed for onTouchTap
        // http://stackoverflow.com/a/34015469/988941
        injectTapEventPlugin();
    }

    handleItemSelect(selectedItem) {
        this.state.list.forEach((item) => {
            if(item === selectedItem) {
                console.log('found it !!! ' + JSON.stringify(selectedItem.gps));
                this.setState({selectedItem: item});
            }
        })
    }

    componentDidMount() {
        window.$ = $;
        console.log('starting to fetch');
        this.serverRequest = $.ajax({
                type: "GET",
                url: window.location.protocol + '//' + window.location.hostname + ':' + config.ports.http + config.listEndpoint,
                error: (xhr, status, error) => {
                    console.log("Error: " + xhr.responseText);
                },
                success: (list) => {
                    console.log('done fetching');
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
                    <GoogleMapsComponent handleItemSelect={this.handleItemSelect} selectedItem={this.state.selectedItem} list={this.state.list}/>
                    <div className="App-footer">
                        <ImagePanelComponent handleItemSelect={this.handleItemSelect} selectedItem={this.state.selectedItem} list={this.state.list}/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
