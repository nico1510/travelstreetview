import React, {Component} from 'react';
import {Dialog, FlatButton} from 'material-ui';
import {default as moment} from 'moment';

class ImageItemComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {dialogOpen: false};
        this.handleImageClick = this.handleImageClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleImageClick() {
        this.setState({dialogOpen: true});
    }

    handleClose() {
        this.setState({dialogOpen: false});
    }

    render() {
        return (
            <div className='image-item' style={{ backgroundImage: `url('${this.props.item.src}')`}} onClick={this.handleImageClick}>
                <Dialog
                    actions={[]}
                    bodyStyle={{margin: '0px', padding: '0px'}}
                    modal={false}
                    autoDetectWindowHeight={true}
                    contentStyle={{
                        width: '100%',
                        maxWidth: 'none'}}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleClose}>
                    <div style={{
                        height: '80vh',
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'}}>
                         <img onClick={this.handleClose} src={this.props.item.src} style={{height: '70vh', width: 'auto'}} />
                    </div>
                </Dialog>
            </div>
        );
    }
}


export default ImageItemComponent;
