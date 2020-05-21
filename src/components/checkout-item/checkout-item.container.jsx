import React from 'react';

import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import CheckoutItem from './checkout-item.component';


const REMOVE_ITEM_FROM_CART = gql`
    mutation RemoveItemFromCart($item: Item!) {
      removeItemFromCart(item: $item) @client
    }
`;

const CLEAR_ITEM_FROM_CART = gql`
  mutation ClearItemFromCart($item: Item!) {
      clearItemFromCart(item: $item) @client
  }
`;

const ADD_ITEM_TO_CART = gql`
  mutation AddItemToCart($item: Item!) {
    addItemToCart(item: $item) @client
  }
`;

const CheckoutItemContainer = (props) => (
  <Mutation mutation={ CLEAR_ITEM_FROM_CART }>
  {clearItemFromCart => (
    <Mutation mutation={ ADD_ITEM_TO_CART }>
    {addItemToCart => (
        <Mutation mutation={ REMOVE_ITEM_FROM_CART } >
            {removeItemFromCart => (
                <CheckoutItem
                { ...props }
                removeItem={ item => removeItemFromCart({ variables: { item } }) }
                clearItem={ item => clearItemFromCart({ variables: { item } }) }
                addItem={item => addItemToCart({ variables: { item } })}
                 />
            )}
        </Mutation>
    )}
  </Mutation>
    )}
  </Mutation>
);

export default CheckoutItemContainer;