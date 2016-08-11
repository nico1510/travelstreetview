import React, {Component} from 'react';
import $ from 'jquery';
import logo from './logo.svg';
import './App.css';
import serverConfigModule from '../../config'
import {default as ImagePanelComponent} from './ImagePanelComponent';
import {default as GoogleMapsComponent} from './GoogleMapsComponent';

const config = serverConfigModule(process.env.NODE_ENV);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {list: []};
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
            <div className="App">
                <GoogleMapsComponent list={this.state.list} />
                <div className="App-footer">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <ImagePanelComponent list={this.state.list} />
                </div>
            </div>
        );
    }
}

export default App;
