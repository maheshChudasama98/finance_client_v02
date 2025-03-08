const initialState = {
    BranchesList: [],
    OrgsList: [],
};

const masterReducers = (state = initialState, action) => {
    switch (action.type) {
        case 'ORGS_LIST':
            return {
                ...state,
                OrgsList: action?.OrgsList
            };
        case 'BRANCHES_LIST':
            return {
                ...state,
                BranchesList: action?.BranchesList,
            };
        default:
            return state;
    }
};

export default masterReducers;
