import React, {Component} from 'react';
import './App.css';

class ImagePanelComponent extends Component {

    render() {
        let key = 0;
        return (
            <div className="imagePanel">
                {!this.props.list.length ? 'Loading...' : this.props.list.map((item) => {
                    return <img src={item.src} alt='img placeholder' style={calculateAspectRatioFit(item.dimensions.width, item.dimensions.height, 250, 200)} key={key++}/>;
                })}
            </div>
        );
    }
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
}

export default ImagePanelComponent;
