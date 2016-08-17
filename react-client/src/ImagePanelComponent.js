import React from 'react';
import './App.css';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import ImageItemComponent from './ImageItemComponent';

function ImagePanelComponent(props) {
    let key = 0;
    return (
        <div className='image-panel' style={{backgroundColor: darkBaseTheme.palette.canvasColor}}>
            {!props.list.length ? 'Loading...' : props.list.map((item) => {
                return (
                    <ImageItemComponent item={item} key={key++}/>
                )
            })}
        </div>
    );
}


export default ImagePanelComponent;