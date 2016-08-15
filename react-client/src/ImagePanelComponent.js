import React, {Component} from 'react';
import './App.css';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';


class ImagePanelComponent extends Component {

    render() {
        let key = 0;
        return (
            <div className='image-panel' style={{backgroundColor: darkBaseTheme.palette.canvasColor}}>
                {!this.props.list.length ? 'Loading...' : this.props.list.map((item) => {
                    return (
                        <div className='image-item' style={{ backgroundImage: `url('${item.src}')`}} key={key++}>
                        </div>
                    )
                })}
            </div>
        );
    }
}


export default ImagePanelComponent;
