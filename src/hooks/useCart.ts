import { useEffect, useMemo, useState } from 'react'
import { db } from '../data/db'
import type { CartItem, Guitar } from '../types/types'

export const useCart = () => {
    const initialCart = (): CartItem[] => {
        const localStorageItem = localStorage.getItem('cart')
        return localStorageItem ? JSON.parse(localStorageItem) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MIN_ITEMS = 1
    const MAX_ITEMS = 5

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item: Guitar) {
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id)
        if (itemExists >= 0) {
            if (cart[itemExists].quantity >= MAX_ITEMS) return
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart)
        } else {
            const newItem: CartItem = { ...item, quantity: 1 }
            setCart([...cart, newItem])
        }
    }

    const removeFromCart = (id: Guitar['id']) => {
        setCart([...cart].filter((item) => item.id !== id))
    }

    const decreaseQuantity = (id: Guitar['id']) => {
        const updatedCart = cart.map((item) => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return { ...item, quantity: item.quantity - 1 }
            } else {
                return item
            }
        })
        setCart(updatedCart)
    }

    const increaseQuantity = (id: Guitar['id']) => {
        const updatedCart = cart.map((item) => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1,
                }
            } else {
                return item
            }
        })
        setCart(updatedCart)
    }

    const cleanCart = () => {
        setCart([])
    }

    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(
        () =>
            cart.reduce((total, item) => total + item.price * item.quantity, 0),
        [cart],
    )

    return {
        cart,
        data,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        cleanCart,
        addToCart,
        isEmpty,
        cartTotal,
    }
}
