export const LoadingReducer = (prevState = { isLoading: false }, action) => {
    // console.log("LoadingReducer action", action);

    let { type } = action;

    switch (type) {
        case 'change_loading':
            let newstate = { ...prevState };
            newstate.isLoading = !newstate.isLoading;
            return newstate;
        default:
            return prevState;
    }
}