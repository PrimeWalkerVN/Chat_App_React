import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

class MessagesHeader extends React.Component {

    render() {
        const { channelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel, handleStar, isChannelStarred } = this.props;
        return (
            <Segment clearing>
                {/* Channel Title */}
                <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
                    <span>
                        {channelName}
                        {!isPrivateChannel && (
                            <Icon style={{cursor: 'pointer'}} name={isChannelStarred ? 'star' : 'star outline'}
                                onClick={handleStar} color={isChannelStarred ? 'yellow' : 'black'}
                            />)}
                    </span>
                    <Header.Subheader> {numUniqueUsers}</Header.Subheader>
                </Header>
                {/* Channel search input */}
                <Header floated='right'>
                    <Input
                        onChange={handleSearchChange}
                        loading={searchLoading}
                        size='mini' icon='search' name='searchTerm' placeholder='Search Messages' />
                </Header>
            </Segment>
        );
    }




}

export default MessagesHeader;