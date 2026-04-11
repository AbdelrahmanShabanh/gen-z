import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('genzfront_cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('genzfront_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, size) => {
    setItems(prev => {
      const existing = prev.find(i => i.product._id === product._id && i.size === size);
      if (existing) {
        return prev.map(i =>
          i.product._id === product._id && i.size === size
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, { product, size, qty: 1 }];
    });
  };

  const removeFromCart = (productId, size) => {
    setItems(prev => prev.filter(i => !(i.product._id === productId && i.size === size)));
  };

  const updateQty = (productId, size, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId, size);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.product._id === productId && i.size === size ? { ...i, qty: newQty } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
