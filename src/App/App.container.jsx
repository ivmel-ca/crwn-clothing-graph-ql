import React from 'react';

import { Query, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import App from './App';


const GET_CURRENT_USER = gql`
    {
        currentUser @client
    }
`;

const SET_CURRENT_USER = gql`
    mutation SetCurrentUser($user: User!) {
        setCurrentUser(user: $user) @client
    }
`;

const AppContainer = () => (
    <Query query={ GET_CURRENT_USER } >
    {
        ({ data: {currentUser} }) => (
            <Mutation mutation={ SET_CURRENT_USER }>
                {
                    setCurrentUser => 
                    <App  currentUser={ currentUser } setCurrentUser={ user => setCurrentUser({ variables: { user } }) } />
                }
            </Mutation>
        )
    }
    </Query>
);

export default AppContainer;