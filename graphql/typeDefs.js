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
  input ProductInput {
    title: String!
    image: String
    brand: String
    description: String
    price: Float!
    categories: [ID]!
  }

  type CartItem {
    id: ID
    productId: Product
    quantity: Float
    name: String  
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
  # Order
  type CustomerOrdersResult {
    items: [Order]
    total: Int
  }
  type AdminOrdersResult {
    items: [Order]
    total: Int
  }
  type OrderItem {
    id: ID!
    productId: Product
    name: String
    quantity: Float
    price: Float
    total: Float
  }
  type OrderCustomer {
    firstname: String
    lastname: String
    email: String
  }
  type Order {
    id: ID!
    orderNumber: Int
    createdAt: String
    customerId: Customer
    shippingTotal: Float
    subTotal: Float
    grandTotal: Float
    items: [OrderItem]
    totalQty: Int
    orderStatus: String
    customer: OrderCustomer
    shippingAddress: Address
    billingAddress: Address
    paymentMethod: PaymentMethod
    shippingMethod: ShippingMethod
  }
  type SubmitOrderResponse {
    orderId: ID
    orderNumber: Float
    totalPrice: Float
  }
  # input ProductInput{
  #   title: String!,
  #   image: String,
  #   brand: String!,
  #   description: String!,
  #   price: Float!
  #   categories: [ID]!
  # }

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
  input CategoryInputData {
    title: String
    parent: ID
  }
  type ProductPagination {
    totalQty: Float
    pages: Float
    products: [Product]
  }
  input SortInput {
    createdAt: Float
    title: Float
    price: Float
  }

  type Slide {
    id: ID
    name: String
    image: String
    content: String
    contentPosition: String
  }
  type Slider {
    id: ID
    title: String
    slides: [Slide]
  }
  # input SliderInput {
  #   title: String
  #   slides: [Slide]
  # }
  
  type Query {
    customers: [Customer]!
    customer: Customer!
    cart(cartId: ID): Cart
    admin: Admin!
    adminCustomer(id: ID!): Customer!
    # products
    products(
      limit: Float!
      page: Float!
      price: Float
      createdAt: Float
      title: Float
    ): ProductPagination!
    productByName(productName: String!): Product
    productById(id: ID): Product!
    # categories
    categories: [Category]!
    categoryById(id: ID): Category!
    # adminCategory
    getCategoryProducts(categoryId: ID!): CategoryProductsResult!
    adminGetCategories: AdminCategoriesResult!
    adminGetCategory(categoryId: ID!): Category!
    # review
    reviewsOneProduct(productId: ID): [Review]!
    # order
    customerOrders: CustomerOrdersResult!
    customerOrder(orderId: ID): Order!
    adminOrders: AdminOrdersResult!
    adminOrder(orderId: ID): Order!
    # Slider
    # id
    slider(id: String): Slider
    adminSlider(id: String): Slider
    adminSliders: [Slider]!
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
    adminCreateProduct(productInput: ProductInput): Product!
    adminUpdateProduct(productId: ID!, productInput: ProductInput): Product
    adminDeleteProduct(id: ID!): Product!
    adminDeleteCategoryFromProduct(productId: ID, categories: [ID]): Product!
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

    # Order
    submitOrder(cartId: ID!): SubmitOrderResponse!
    adminChangeOrderStatus(orderId: ID!, status: String): Order
    adminDeleteOrder(orderId: ID): Boolean!
    adminMassDeleteOrders(orderIds: [ID]!): Boolean
    # Slider  ...# sliderInput 
    adminAddSlider(title: String, name: String, image: String): Slider! 
    adminUpdateSlider( sliderId: ID, title: String, image: String, name: String): Slider!
    adminDeleteSlide( id: ID, slideId: ID): Slider!
    adminMassDeleteSlides(slideIds: [ID]): Slider! 
    adminDeleteSlider(sliderId: String): Slider! 
    adminMassDeleteSliders(sliderIds: [String]): Slider! 
  }
`;
