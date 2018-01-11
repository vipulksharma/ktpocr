const addressReducer = (state = {}, action) => {
    const { type, payload, categories} = action;

    switch(type){
        case 'CSV_DATA_RECIEVED':
            return {...state, "addresses" : payload, "categories" :categories};
        default:
            return state;
    }
};

export default addressReducer;
