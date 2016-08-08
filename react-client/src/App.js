import React, {Component} from 'react';
import $ from 'jquery';
import logo from './logo.svg';
import './App.css';
import serverConfigModule from '../../config'

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
                error:  (xhr, status, error) => { console.log( "Error: " + xhr.responseText );  },
                success: (list) => { console.log('done fetching'); this.setState({list}); }
            }
        );
    }



    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>
                {!this.state.list.length ? 'Loading...' : this.state.list.map((item) => {
                    return <img src={item.src} style={calculateAspectRatioFit(item.dimensions.width, item.dimensions.height, 250, 200)}/>;
                })}
            </div>
        );
    }
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
}

export default App;
