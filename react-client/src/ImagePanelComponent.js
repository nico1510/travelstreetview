import React, {Component} from 'react';
import './App.css';

class ImagePanelComponent extends Component {

    render() {
        let key = 0;
        return (
            <div className="image-panel">
                {!this.props.list.length ? 'Loading...' : this.props.list.map((item) => {
                    return (
                        <div className='image-item' style={{ 'background-image': `url('${item.src}')`}} key={key++}>
                        </div>
                    )
                })}
            </div>
        );
    }
}


export default ImagePanelComponent;
