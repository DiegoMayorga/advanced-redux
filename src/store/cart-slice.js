import { createSlice } from "@reduxjs/toolkit";

import { uiActions } from "./ui-slice";

const initialState = { items: [], totalQuantity: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        }); // si uso solo redux y no toolkit, estaria mutando. Aca no pasa nada.
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price; // HASTA AQUI EL PRIMER VIDEO
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      state.totalQuantity--;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
  },
});

// despues del objeto slice.

export const sendCartData = (cart) => {
  // retorno otra funcion. si, en js puedo crear funciones que retornen funciones.
  return async (dispatch) => {
    // Pendiente
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        "https://react-htt-34fa6-default-rtdb.firebaseio.com/cart.json",
        {
          // Con el PUT los datos no se agregaran en una lista de datos, sino que sobreescribiran los datos existentes.
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("Sending cart data failed.");
      }
    };
    try {
      await sendRequest();

      // Exito
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent cart data successfully!",
        })
      );
    } catch (error) {
      // Error
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart data failed!",
        })
      );
    }
  };
};
// no estoy ejecutando este codigo en un reducer, por lo que aqui pueden haber efectos secundarios
// y codigo asincrono.

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
