const { gql } = require("apollo-server");

module.exports = gql`
  type Customer {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
    token: String
    addresses: [Address]
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
  type Product {
    _id: ID!
    title: String!
    image: String
    brand: String!
    description: String!
    price: Float!
    categories: [Category]!
  }
  type CartItem {
    id: ID
    productId: Product
    quantity: Float
    price: Float
    total: Float
  }
  type Cart {
    id: ID
    customerId: Customer
    items: [CartItem]
    subTotal: Float
    shippingTotal: Float
    grandTotal: Float
    totalQty: Float
    shippingAddress: Address
    billingAddress: Address
    paymentMethod: PaymentMethod
    shippingMethod: ShippingMethod
  }
  type ShippingMethod {
    carrierCode: String
    rateId: String
  }
  type PaymentMethod {
    methodCode: String
  }
  # input ProductInput{
  #   title: String!,
  #   image: String,
  #   brand: String!,
  #   description: String!,
  #   price: Float!
  #   categories: [ID]!
  # }

  input CategoryInputData {
    title: String
    parent: ID
  }
  input CustomerAddressInput {
    firstname: String
    lastname: String
    city: String
    address: String

    country: String
  }
  type Address {
    firstname: String
    lastname: String
    city: String
    address: String
    country: String
  }
  type Review {
    id: ID
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
    cart(cartId: ID): Cart
    admin: Admin!
    adminCustomer(id: ID!): Customer!
    products: [Product]!
    # categories
    categories: [Category]!
    productById(id: ID): Product!
    getCategoryProducts(categoryId: ID!): CategoryProductsResult!
    adminGetCategories: AdminCategoriesResult!
    adminGetCategory(categoryId: ID!): Category!
    # review
    reviewsOneProduct(productId: ID): [Review]!
  }

  type Mutation {
    # customer
    register(
      firstname: String!
      lastname: String!
      password: String!
      email: String!
    ): Customer!
    updateCustomer(customerData: CustomerDataInput): Customer
    addCustomerAddress(customerAddressInput: CustomerAddressInput): Customer
    editCustomerAddres(
      customerAddressId: ID!
      customerAddressInput: CustomerAddressInput
    ): Customer
    removeCustomerAddress(customerAddressId: ID): Boolean
    login(email: String!, password: String!): Customer!

    adminLogin(email: String!, password: String!): Admin!
    adminAddCustomer(customerData: CustomerDataInput): Boolean
    adminDeleteCustomer(id: ID!): Boolean
    adminMassDeleteCustomers(customerIds: [String]): Boolean
    adminUpdateCustomer(id: ID!, customerData: CustomerDataInput): Boolean

    # product
    # adminCreateProduct(productInput: ProductInput!): Product!
    adminCreateProduct(
      title: String!
      image: String
      brand: String!
      description: String!
      price: Float!
      categories: [ID]!
    ): Product!
    adminUpdateProduct(id: ID!, title: String!): Product!
    adminDeleteProduct(id: ID!): Product!
    # image
    adminAddProductImage(id: ID!, image: String): Product!
    adminDeleteProductImage(id: ID!): Product

    # adminDeleteCategoryFromProduct(productId: ID, categories: [ID]): Product!

    # category
    adminAddCategory(categoryData: CategoryInputData!): Boolean
    adminUpdateCategory(
      categoryId: ID!
      categoryData: CategoryInputData!
    ): Boolean
    adminDeleteCategory(categoryId: ID!): Boolean

    # Review
    createReview(reviewInput: ReviewInput): Review!
    deleteReview(reviewId: ID): Review!
    adminDeleteReviews(reviewIds: [ID]): Boolean!

    # Cart
    addToCart(productId: ID, quantity: Float): Cart!
    decreaseCartItem(productId: ID, quantity: Float): Cart!
    removeItemFromCart(productId: ID): Cart!
    clearCart: Boolean!
    submitShippingAddress(customerAddressInput: CustomerAddressInput): Cart!
    submitBillingAddress(customerAddressInput: CustomerAddressInput): Cart!
    submitShippingMethod(carrierCode: String, rateId: String): Cart
    submitPaymentMethod(methodCode: String): Cart
  }
`;
