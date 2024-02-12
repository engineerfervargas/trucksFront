export const INVENTORY_TYPES = {
  SUBSTRACT: 'SUBSTRACT',
  RESET: 'RESET',
}

export default function inventoryReducer(state, action) {
  switch (action.type) {
    case INVENTORY_TYPES.SUBSTRACT:
      const elementFind = state.find(el => el.hawa == action.payload.hawa);
      if (elementFind) {
        if (action.payload.quantity > 0)
          return [
            ...state.filter(el => el.hawa != action.payload.hawa),
            {
              ...elementFind,
              quantity: elementFind.quantity - 1
            }
          ]
        else
          return state;
      }
      else {
        return state;
      }
    case INVENTORY_TYPES.RESET:
      return action.payload;
    default:
      return state;
  }
}