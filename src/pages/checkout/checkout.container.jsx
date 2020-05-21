import React from 'react';

import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import CheckoutPage from './checkout.component';

const GET_CART_ITEMS_AND_TOTAL = gql`
    {
        cartItems @client
        total @client
    }
`;


const CheckoutPageContainer = () => (
    <Query query={ GET_CART_ITEMS_AND_TOTAL } >
        {({ data }) => {
            const { cartItems, total } = data;
            return <CheckoutPage cartItems={ cartItems } total={ total } />
        }}
    </Query>
);

export default CheckoutPageContainer;