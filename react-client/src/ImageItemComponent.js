import React, {Component} from 'react';
import {Dialog, FloatingActionButton, Badge} from 'material-ui';
import MapsPlace from 'material-ui/svg-icons/maps/place';

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
            <Badge
                onClick={this.props.handleItemSelect.bind(this, this.props.item)}
                badgeStyle={{top: '25px', right: '25px'}}
                badgeContent={<FloatingActionButton>
                                  <MapsPlace />
                              </FloatingActionButton>}>
                <div className={'image-item '
                    + ((this.props.isSelected)? 'cyan-shadow' : 'black-shadow')
                    + ((this.props.item.orientation === 6)? ' rotate-bg-img' : ' ')
                        }
                     style={{ backgroundImage: `url('${this.props.item.src}')`}}
                     onClick={this.handleImageClick}>

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
                            alignItems: 'center'
                        }}>
                            <img onClick={this.handleClose} src={this.props.item.src}
                                 alt={this.props.item.src}
                                 className={((this.props.item.orientation === 6)? ' rotated-full-img' : 'normal-full-img')} />
                        </div>
                    </Dialog>
                </div>
            </Badge>
        );
    }
}


export default ImageItemComponent;
