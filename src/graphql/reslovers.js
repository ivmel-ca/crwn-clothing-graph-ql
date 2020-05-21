import { gql } from 'apollo-boost';

import { 
    addItemToCart,
    getCartItemCount,
    getCartItemTotalCount,
    removeItemFromCart,
    clearItemFromCart
    } from './cart.utils';

export const typeDefs = gql`
    extend type Item {
        quantity: Int
    }

    extend type DateTime {
        nanoseconds: Int!
        seconds: Int!
    }

    extend type User {
        id: ID!
        displayName: String!
        email: String!
        createdAt: DateTime!
    }

    extend type Mutation {
        ToggleCartHidden: Boolean!
        AddItemToCart(item: Item!): [Item]!
        RemoveItemToCart(item: Item!): [Item]!
        ClearItemFromCart(item: Item!): [Item]!
        SetCurrentUser(user: User!): User!
    }
`;

const GET_CART_HIDDEN = gql`
    {
        cartHidden @client
    }
`;

const GET_CART_ITEMS = gql`
    {
        cartItems @client
    }
`;

const GET_ITEM_COUNT = gql`
    {
        itemCount @client
    }
`;

const GET_ITEM_TOTAL_COUNT = gql`
    {
        total @client
    }
`;

const GET_CURRENT_USER = gql`
    {
        currentUser @client
    }
`;

const updateCartRelatedData = (newCartItems, cache) => {
    cache.writeQuery({
        query: GET_ITEM_TOTAL_COUNT,
        data: { total: getCartItemTotalCount(newCartItems) }
    });

    cache.writeQuery({
        query: GET_ITEM_COUNT,
        data: { itemCount: getCartItemCount(newCartItems) }
    });

    cache.writeQuery({
        query: GET_CART_ITEMS,
        data: { cartItems: newCartItems }
    });

    return newCartItems;
}


export const resolvers = {
    Mutation: {
        toggleCartHidden: (_root, _args, { cache }) =>  {
            const data = cache.readQuery({
                query: GET_CART_HIDDEN
            });

            const { cartHidden } = data;

            cache.writeQuery({
                query: GET_CART_HIDDEN,
                data: { cartHidden: !cartHidden }
            });

            return !cartHidden;
        },

        addItemToCart: (_root, { item }, { cache }) => {
            const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS
            });

            const newCartItems = addItemToCart(cartItems, item);
            return updateCartRelatedData(newCartItems, cache);
        },

        removeItemFromCart: (_root, { item }, { cache }) => {
            const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS
            });

            const newCartItems = removeItemFromCart(cartItems, item);
            return updateCartRelatedData(newCartItems, cache);
        },

        clearItemFromCart: (_root, { item }, { cache }) => {
            const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS
            });

            const newCartItems = clearItemFromCart(cartItems, item);
            return updateCartRelatedData(newCartItems, cache);
        },

        setCurrentUser: (_root, { user }, { cache }) => {
            cache.writeQuery({
                query: GET_CURRENT_USER,
                data: { currentUser: user }
            });
        }
     }
}   