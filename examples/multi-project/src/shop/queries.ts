import { gql } from "graphql-tag";

// Project B (shop): validated against schema/shop.graphql
// Deprecation rule is disabled — `cost` field usage won't trigger a warning.
export const PRODUCT_LIST = gql`
  query ShopProductList {
    products {
      id
      name
      price
      cost
      inStock
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation ShopPlaceOrder($cartId: ID!) {
    placeOrder(cartId: $cartId) {
      id
      status
      placedAt
    }
  }
`;
