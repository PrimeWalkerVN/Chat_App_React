import React from 'react';
import uuidv4 from 'uuid/v4';
import { Segment, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';
import { Picker, emojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";


class MessagesForm extends React.Component {
    state = {
        storageRef: firebase.storage().ref(),
        uploadTask: null,
        uploadState: '',
        message: '',
        typingRef: firebase.database().ref('typing'),
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: [],
        modal: false,
        percentUploaded: 0,
        emojiPicker: false
    }

    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });


    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleKeyDown = e => {
        if( e.keyCode === 13){
            this.sendMessage();
        }

        const { message, typingRef, channel, user } = this.state;

        if (message) {
            typingRef
                .child(channel.id)
                .child(user.uid)
                .set(user.displayName);
        } else {
            typingRef
                .child(channel.id)
                .child(user.uid)
                .remove();
        }
    };

    handleTogglePicker = () => {
        this.setState({ emojiPicker: !this.state.emojiPicker });
    };

    handleAddEmoji = emoji => {
        const oldMessage = this.state.message;
        const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons} `);
        this.setState({ message: newMessage, emojiPicker: false });
        setTimeout(() => this.messageInputRef.focus(), 0);
    };
    colonToUnicode = message => {
        return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
            x = x.replace(/:/g, "");
            let emoji = emojiIndex.emojis[x];
            if (typeof emoji !== "undefined") {
                let unicode = emoji.native;
                if (typeof unicode !== "undefined") {
                    return unicode;
                }
            }
            x = ":" + x + ":";
            return x;
        });
    };

    createMessage = (fileUrl = null) => {
        const message = {
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            timestamp: firebase.database.ServerValue.TIMESTAMP,

        };
        if (fileUrl !== null) {
            message['image'] = fileUrl;

        } else {
            message['content'] = this.state.message;
        }
        return message
    }

    sendMessage = e => {
        const { getMessagesRef } = this.props;
        const { message, channel, user, typingRef } = this.state
        if (message) {
            this.setState({ loading: true });
            getMessagesRef()
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] });
                    typingRef
                        .child(channel.id)
                        .child(user.uid)
                        .remove();

                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message' })
            })
        }
    }

    getPath = () => {
        if (this.props.isPrivateChannel) {
            return `chat/private-${this.state.channel.id}`;
        } else {
            return 'chat/public';
        }
    }

    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.getMessagesRef();
        const filePath = `${this.getPath()}${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
            () => {
                this.state.uploadTask.on('state_changed', snap => {
                    const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                    this.setState({ percentUploaded });
                    this.props.isProgressBarVisible(percentUploaded);
                }, err => {
                    console.error(err);

                    this.setState({
                        errors: [...this.state.errors, err],
                        uploadState: 'error',
                        uploadTask: null
                    })
                },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                            this.sendFileMessage(downloadURL, ref, pathToUpload);
                        })
                            .catch(err => {
                                console.error(err);

                                this.setState({
                                    errors: [...this.state.errors, err],
                                    uploadState: 'error',
                                    uploadTask: null
                                })
                            })
                    })
            }
        )
    }

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: 'done' })
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err)
                })
            })
    }

    render() {
        const { errors, message, loading, modal, uploadState, percentUploaded, emojiPicker } = this.state;
        return (
            <Segment className="message__form">
                {emojiPicker && (
                    <Picker
                        set="apple"
                        onSelect={this.handleAddEmoji}
                        className="emojipicker"
                        title="Pick your emoji"
                        emoji="point_up"
                    />
                )}
                <Input
                    fluid
                    name="message"
                    value={message}
                    ref={node => (this.messageInputRef = node)}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    style={{ marginBottom: '0.7rem' }}
                    label={
                        <Button
                            icon={emojiPicker ? "close" : "add"}
                            content={emojiPicker ? "Close" : null}
                            onClick={this.handleTogglePicker}
                        />
                    }
                    labelPosition='left'
                    className={errors.some(error => error.message.includes('message')) ? "error" : ""}
                    placeholder='Write your message' />


                <Button.Group icon widths='2'>
                    <Button disable={loading.toString()} onClick={this.sendMessage} color='teal'
                        content='Add Reply' labelPosition='left' icon='edit' />
                    <Button disabled={uploadState === 'uploading'} onClick={this.openModal} color='orange' content='Upload Media' labelPosition='right' icon='cloud upload' />
                </Button.Group>
                <FileModal modal={modal} closeModal={this.closeModal} uploadFile={this.uploadFile} />
                <ProgressBar uploadState={uploadState} percentUploaded={percentUploaded} />

            </Segment>
        );
    }
}

export default MessagesForm;