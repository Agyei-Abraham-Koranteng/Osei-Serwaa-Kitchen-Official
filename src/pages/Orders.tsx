import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroRestaurant from '@/assets/hero-restaurant.jpg';

const Orders = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal, addOrder } = useRestaurant();
  const { toast } = useToast();

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const handleQuantityChange = (id: string, delta: number) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      updateCartQuantity(id, item.quantity + delta);
    }
  };

  const handleSubmitOrder = () => {
    if (cart.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your cart before placing an order.',
        variant: 'destructive',
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (deliveryType === 'delivery' && !customerInfo.address) {
      toast({
        title: 'Missing delivery address',
        description: 'Please provide a delivery address.',
        variant: 'destructive',
      });
      return;
    }

    // Create order
    addOrder({
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      items: cart.map((item) => ({
        menuItemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cartTotal,
      status: 'pending',
      deliveryAddress: customerInfo.address,
      deliveryType,
      notes: customerInfo.notes,
    });

    toast({
      title: 'Order placed successfully!',
      description: 'We will contact you shortly to confirm your order.',
    });

    // Clear cart and form
    clearCart();
    setCustomerInfo({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroRestaurant})` }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Your <span className="gradient-text">Order</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Review your cart and complete your order for delivery or pickup
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 bg-muted/30">

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6" />
                  Cart Items ({cart.length})
                </h2>

                {cart.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-xl text-muted-foreground">Your cart is empty</p>
                    <Link to="/menu">
                      <Button>Browse Menu</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-soft transition-shadow"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                          <p className="text-lg font-bold text-primary mt-2">
                            GH₵ {item.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end justify-between gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="w-full text-destructive hover:text-destructive"
                    >
                      Clear Cart
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            {cart.length > 0 && (
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-2xl font-semibold">Customer Information</h2>

                  {/* Delivery Type */}
                  <div className="space-y-3">
                    <Label>Order Type</Label>
                    <RadioGroup value={deliveryType} onValueChange={(value: any) => setDeliveryType(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="cursor-pointer">
                          Delivery
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="cursor-pointer">
                          Pickup
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="+233 24 123 4567"
                    />
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="123 Main St, Accra"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      placeholder="Any special requests or dietary requirements?"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="sticky top-28">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-2xl font-semibold">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">GH₵ {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {deliveryType === 'delivery' ? 'Delivery Fee' : 'Pickup'}
                      </span>
                      <span className="font-medium">
                        {deliveryType === 'delivery' ? 'GH₵ 10.00' : 'Free'}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          GH₵ {(cartTotal + (deliveryType === 'delivery' ? 10 : 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSubmitOrder} size="lg" className="w-full hover-scale">
                    Place Order
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By placing an order, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
