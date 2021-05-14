const { gql } = require("apollo-server");

module.exports = gql`
  type Customer {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
    token: String
  }

  type Admin {
    id: ID
    firstname: String!
    lastname: String!
    email: String!
    token: String
  }

  input CustomerDataInput {
    id: ID
    email: String
    password: String
    firstname: String
    lastname: String
  }

  input CategoryInputData {
    title: String
    parent: ID
  }

  type Product {
    _id: ID!
    title: String!
    image: String!
    brand: String!
    description: String!
    price: Float!
    categories: [Category]!
  }

  input ProductInput {
    title: String!
    image: String
    brand: String!
    description: String!
    price: Float!
    categories: [ID]!
  }

  type Review {
    _id: ID
    customer_id: Customer
    product_id: Product
    review: String!
    rating: Float!
    name: String!
    title: String
  }
  input ReviewInput {
    customer_id: ID!
    product_id: ID!
    review: String
    rating: Float
    title: String
  }

  type Category {
    id: ID!
    title: String!
    parent: ID!
  }

  type AdminCategoriesResult {
    items: [Category]
    total: Int
  }

  type CategoryProductsResult {
    products: [Product]
    total: Int
  }

  type Query {
    customers: [Customer]!
    customer: Customer!
    admin: Admin!
    adminCustomer(id: ID!): Customer!
    products: [Product]!
    # categories
    categories: [Category]!
    getCategoryProducts(categoryId: ID!): CategoryProductsResult!
    adminGetCategories: AdminCategoriesResult!
    adminGetCategory(categoryId: ID!): Category!
    # review
    reviewsOneProduct(productId: ID): [Review]!
  }

  type Mutation {
    register(
      firstname: String!
      lastname: String!
      password: String!
      email: String!
    ): Customer!
    adminLogin(email: String!, password: String!): Admin!
    adminAddCustomer(customerData: CustomerDataInput): Boolean
    adminDeleteCustomer(id: ID!): Boolean
    adminMassDeleteCustomers(customerIds: [String]): Boolean
    adminUpdateCustomer(id: ID!, customerData: CustomerDataInput): Boolean
    login(email: String!, password: String!): Customer!

    # product
    adminCreateProduct(productInput: ProductInput!): Product!
    adminUpdateProduct(
      id: ID!
      title: String
      brand: String
      description: String
      price: Float
      categories: [ID!]
    ): Product!
    adminDeleteProduct(id: ID!): Product!
    adminDeleteCategoryFromProduct(productId: ID, categories: [ID]): Product!

    # category
    adminAddCategory(categoryData: CategoryInputData!): Boolean
    adminUpdateCategory(categoryId: ID!, categoryData: CategoryInputData!): Boolean
    adminDeleteCategory(categoryId: ID!): Boolean

    # Review
    createReview(reviewInput: ReviewInput): Review!
    deleteReview(reviewId: ID): Review!
    adminDeleteReviews(reviewIds: [ID]): Boolean!
  }
`;
