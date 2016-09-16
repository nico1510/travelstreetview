import React, {Component} from 'react';
import {Dialog, FloatingActionButton, Badge} from 'material-ui';
import {hasGPSattached} from './Utils';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';
import FlatButton from 'material-ui/FlatButton';
import { StyleSheet, css } from 'aphrodite';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {red700 as errorColor} from 'material-ui/styles/colors'

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
                badgeContent={
                    hasGPSattached(this.props.item)?
                    <FloatingActionButton>
                        <MapsPlace />
                    </FloatingActionButton>
                        :
                    <FloatingActionButton backgroundColor={errorColor} tooltip="No GPS data available" tooltipPosition="bottom-right">
                        <NavigationCancel />
                    </FloatingActionButton>
                    }>
                <div className={css(styles.imageItem,
                                this.props.isSelected? styles.highlightShadow : styles.blackShadow,
                                (this.props.item.orientation === 6) && styles.rotateBgImg)}
                     style={{ backgroundImage: `url('${this.props.item.src}')`}}
                     onClick={this.handleImageClick}>

                    <Dialog
                        actions={[]}
                        bodyClassName={css(styles.dialogBody)}
                        modal={false}
                        autoDetectWindowHeight={true}
                        contentClassName={css(styles.dialogContainer)}
                        open={this.state.dialogOpen}
                        onRequestClose={this.handleClose}>
                        <div className={css(styles.dialogContent)}>
                            <FlatButton onClick={this.handleClose} className={css(styles.dialogCloseButton)}>
                                <NavigationClose className={css(styles.closeIcon)} />
                            </FlatButton>

                            <img onClick={this.handleClose} src={this.props.item.src}
                                 alt={this.props.item.src}
                                 className={css((this.props.item.orientation === 6)? styles.rotatedFullImg : styles.normalFullImg)} />
                        </div>
                    </Dialog>
                </div>
            </Badge>
        );
    }
}

const styles = StyleSheet.create({
    dialogContainer: {
        width: '100%',
        maxWidth: 'none'
    },

    dialogBody: {
        margin: '0px',
        padding: '0px'
    },

    dialogContent: {
        height: '80vh',
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    dialogCloseButton: {
        position: 'absolute',
        top: '10px',
        left: '0px',
        borderRadius: '50%'
    },

    closeIcon: {
        padding: '5px'
    },

    imageItem: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: '50px',
        border: '1px solid darkslategray',
        margin: '5px',
        width: '230px',
        height: '230px'
    },

    blackShadow: {
        boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.5)'
    },

    highlightShadow: {
        boxShadow: `0 6px 30px 0 ${darkBaseTheme.palette.primary1Color}`
    },

    rotateBgImg: {
        transform: 'rotate(90deg)'
    },

    rotatedFullImg: {
        height: 'auto',
        transform: 'rotate(90deg)',
        width: '70vh'
    },

    normalFullImg: {
        height: '70vh',
        width: 'auto'
    }

});

export default ImageItemComponent;
