const state = {};

const setState = (key, value) => {
    state[key] = value;
};

const getState = (key) => {
    if (key in state) {
        return state[key];
    }

    return null;
};

module.exports = {
    setState,
    getState
};