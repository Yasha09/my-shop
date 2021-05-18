// const Cart = require("../../models/Cart")

// module.exports = {
//   Mutation: {
//     addProductInCart: async(_,{ product_id, quantity }) =>{
//       let findCart = await new Cart.findOne({status: 0})
//     },
//     // createCard: async (_,
//     //   { cardInput: { customer_id, product, status, count } },
//     // ) => {
//     //   let newCard = new Card({
//     //     customer_id,
//     //     product,
//     //     status:0,
//     //     count
//     //   });
//     //   return await newCard.save();
//     // },
//     // addProductInCard: async (_, args) => {
//     //   if(status!= 0){console.log("err")}
//     //   return await Card.create(
//     //    {_id: args.id},
//     //     {product: args.product}
//     //   )
//     // },
//     // delete Cart
//     deleteCart: async (_, { cartId }) => {
//     let emptyCart = await Card.findOneAndRemove(
//       {status: 0},//if he want to remove his cart where status 0,remove it -_-!
//       {
//         $set: { _id: cartId },
//       },
//       { useFindAndModify: false },
//       );
//       console.log(emptyCart);
//       return emptyCart;
//     },
//     // the end
//   },
// };

