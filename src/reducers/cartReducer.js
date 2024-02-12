export const CART_TYPES = {
  ADD: 'ADD',
  RESET: 'RESET',
}

export default function cartReducer(state, action) {
  switch (action.type) {
    case CART_TYPES.ADD:
      const elementFind = state.find(el => el.hawa == action.payload.hawa);
      if (elementFind) {
        if (action.payload.quantity > 0)
          return [
            ...state.filter(el => el.hawa != action.payload.hawa),
            {
              ...elementFind,
              quantitySelect: elementFind.quantitySelect + 1
            }
          ]
        else
          return state;
      }
      else {
        return [
          ...state,
          {
            ...action.payload,
            quantitySelect: 1
          }
        ]
      }
    case CART_TYPES.RESET:
      return [];
    default:
      return state;
  }
}