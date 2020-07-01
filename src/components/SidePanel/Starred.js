import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import { setCurrentChannel, setPrivateChannel } from '../../actions'

class Starred extends React.Component {
    state = {
        user: this.props.currentUser,
        activeChannel: '',
        starredChannels: [],
        usersRef: firebase.database().ref('users')
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    }

    addListeners = (userId) => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_added', snap => {
                const starredChannel = { id: snap.key, ...snap.val() };
                this.setState({
                    starredChannels: [...this.state.starredChannels, starredChannel]
                });
            });

        this.state.usersRef
            .child(userId)
            .child('starred').on('child_removed', snap =>{
                const channelToRemove = {id: snap.key, ...snap.val()};
                const filteredChannels = this.state.starredChannels.filter(channel => {
                    return channel.id !== channelToRemove.id;
                })
                this.setState({ starredChannels: filteredChannels });
            })
    }

    changeChanel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);

    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    displayChannels = displayChannels => (
        displayChannels.length > 0 && displayChannels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChanel(channel)}
                name={channel.name}
                style={{ opacity: 1 }}
                active={channel.id === this.state.activeChannel}>

                # {channel.name}
            </Menu.Item>
        ))
    )
    render() {
        const { starredChannels } = this.state;
        return (
            <Menu.Menu className="menu">
                <Menu.Item style={{ fontWeight: "bold" }}>
                    <span>
                        <Icon name="star" /> FAVORITE
                        </span> {' '}
                        ({starredChannels.length})
            </Menu.Item>
                {/* Channels */}
                {this.displayChannels(starredChannels)}
            </Menu.Menu>

        )
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred)