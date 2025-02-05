import { db } from '../data/db'
import { CartItem, Guitar } from '../types/types'

export type CartActions =
    | { type: 'addToCart'; payload: { item: Guitar } }
    | { type: 'removeFromCart'; payload: { id: Guitar['id'] } }
    | { type: 'decreaseQuantity'; payload: { id: Guitar['id'] } }
    | { type: 'increaseQuantity'; payload: { id: Guitar['id'] } }
    | { type: 'cleanCart' }

export type CartState = {
    data: Guitar[]
    cart: CartItem[]
}

export const initialCart = (): CartItem[] => {
    const localStorageItem = localStorage.getItem('cart')
    return localStorageItem ? JSON.parse(localStorageItem) : []
}

export const initialState = {
    data: db,
    cart: initialCart(),
}

const MIN_ITEMS = 1
const MAX_ITEMS = 5

export const cartReduce = (
    state: CartState = initialState,
    action: CartActions,
) => {
    if (action.type === 'addToCart') {
        const itemExists = state.cart.find(
            (guitar) => guitar.id === action.payload.item.id,
        )

        let updatedCart: CartItem[] = []
        if (itemExists) {
            updatedCart = state.cart.map((item) => {
                if (item.id === action.payload.item.id) {
                    if (item.quantity < MAX_ITEMS) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return item
                    }
                } else {
                    return item
                }
            })
        } else {
            const newItem: CartItem = { ...action.payload.item, quantity: 1 }
            updatedCart = [...state.cart, newItem]
        }
        return {
            ...state,
            cart: updatedCart,
        }
    }
    if (action.type === 'removeFromCart') {
        const updatedCart = state.cart.filter(
            (item) => item.id != action.payload.id,
        )
        return {
            ...state,
            cart: updatedCart,
        }
    }
    if (action.type === 'decreaseQuantity') {
        const updatedCart = state.cart.map((item) => {
            if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return { ...item, quantity: item.quantity - 1 }
            } else {
                return item
            }
        })
        return {
            ...state,
            cart: updatedCart,
        }
    }
    if (action.type === 'increaseQuantity') {
        const updatedCart = state.cart.map((item) => {
            if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1,
                }
            } else {
                return item
            }
        })
        return {
            ...state,
            cart: updatedCart,
        }
    }
    if (action.type === 'cleanCart') {
        return {
            ...state,
            cart: [],
        }
    }
    return state
}
