import * as actionsType from './types';

// User action
export const setUser = user => {
    return {
        type: actionsType.SET_USER,
        payload: {
            currentUser: user
        }
    }
}
export const clearUser = () => {
    return {
        type: actionsType.CLEAR_USER
    }
}

// Channel action

export const setCurrentChannel = channel => {
    return {
        type: actionsType.SET_CURRENT_CHANNEL,
        payload: {
            currentChannel: channel
        }
    }
}

export const setPrivateChannel = isPrivateChannel => {
    return {
        type: actionsType.SET_PRIVATE_CHANNEL,
        payload: {
            isPrivateChannel
        }
    }
}

export const setUserPosts = userPosts => {
    return {
        type: actionsType.SET_USER_POSTS,
        payload: {
            userPosts
        }
    };
};

// Colors Actions
export const setColors = (primaryColor, secondaryColor) => {
    return {
      type: actionsType.SET_COLORS,
      payload: {
        primaryColor,
        secondaryColor
      }
    };
  };