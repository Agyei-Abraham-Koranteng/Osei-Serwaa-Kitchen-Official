import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import menuDataJson from '@/data/menuData.json';
import reservationsDataJson from '@/data/mockReservations.json';

// Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId: string;
  image: string;
  featured: boolean;
  available: boolean;
  spicyLevel: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}


export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    tagline: string;
  };
  features: { title: string; description: string }[];
  cta: { title: string; description: string };
}

export interface AboutContent {
  story: { paragraph1: string; paragraph2: string; paragraph3: string };
  values: { title: string; description: string }[];
  team: { name: string; role: string; description: string; image: string }[];
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

export interface ContactPageInfo {
  pageContent: { heroTitle: string; heroSubtitle: string };
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    hours: { weekday: string; weekend: string };
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

interface RestaurantContextType {
  // Menu
  menuItems: MenuItem[];
  categories: Category[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  // Reservations
  
  // Reservations
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  deleteReservation: (id: string) => void;
  
  // Contact Messages
  contactMessages: ContactMessage[];
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;
  updateContactMessageStatus: (id: string, status: ContactMessage['status']) => void;
  deleteContactMessage: (id: string) => void;
  // Hero images for pages (keyed by page name)
  heroImages: Record<string, string>;
  setHeroImage: (page: string, url: string) => void;
  // Hero title/subtitle/tagline text for pages
  heroTexts: Record<string, { title?: string; subtitle?: string; tagline?: string }>;
  setHeroText: (page: string, payload: { title?: string; subtitle?: string; tagline?: string }) => void;
  // Page content
  homeContent: HomeContent;
  setHomeContent: (c: HomeContent) => void;
  aboutContent: AboutContent;
  setAboutContent: (c: AboutContent) => void;
  galleryImages: GalleryImage[];
  setGalleryImages: (imgs: GalleryImage[]) => void;
  contactPageInfo: ContactPageInfo;
  setContactPageInfo: (info: ContactPageInfo) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
};

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  // Load initial data from JSON files
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuDataJson.menuItems as MenuItem[]);
  const [categories] = useState<Category[]>(menuDataJson.categories as Category[]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [reservations, setReservations] = useState<Reservation[]>(
    reservationsDataJson.reservations as Reservation[]
  );
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  // Hero images state (persisted in localStorage)
  const [heroImages, setHeroImages] = useState<Record<string, string>>(() => {
    try {
      const raw = localStorage.getItem('restaurant-hero-images');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  // Hero texts state (title / subtitle / tagline), persisted in localStorage
  const [heroTexts, setHeroTexts] = useState<Record<string, { title?: string; subtitle?: string; tagline?: string }>>(() => {
    try {
      const raw = localStorage.getItem('restaurant-hero-texts');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  // Home content state
  const [homeContent, setHomeContentState] = useState<HomeContent>(() => {
    try {
      const raw = localStorage.getItem('restaurant-home-content');
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      hero: {
        title: 'Osei Serwaa Kitchen',
        subtitle: 'Authentic West African Cuisine',
        tagline: 'Experience the rich flavors and traditions of Ghana in every dish',
      },
      features: [
        { title: 'Award Winning', description: 'Recognized for excellence in authentic cuisine' },
        { title: 'Quality Ingredients', description: 'Fresh, locally sourced ingredients daily' },
        { title: 'Fast Service', description: 'Quick preparation without compromising quality' },
        { title: 'Made with Love', description: 'Every dish prepared with care and passion' },
      ],
      cta: {
        title: 'Ready to Experience True Ghanaian Flavors?',
        description: 'Book a table and come experience the best of authentic Ghanaian cuisine.',
      },
    };
  });

  // About content state
  const [aboutContent, setAboutContentState] = useState<AboutContent>(() => {
    try {
      const raw = localStorage.getItem('restaurant-about-content');
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      story: {
        paragraph1: "Osei Serwaa Kitchen was founded with a simple mission: to share the rich culinary heritage of Ghana with food lovers everywhere. Our restaurant is named after our founder's grandmother, Osei Serwaa, whose recipes and cooking techniques have been passed down through generations.",
        paragraph2: "Every dish we serve is prepared using traditional methods and authentic ingredients, ensuring that each bite transports you to the vibrant streets and warm kitchens of Ghana. From our signature jollof rice to our perfectly seasoned banku, we take pride in maintaining the authentic flavors that have made Ghanaian cuisine beloved worldwide.",
        paragraph3: "Our commitment to quality, authenticity, and excellent service has made us a favorite destination for those seeking genuine Ghanaian food. Whether you're from Ghana or discovering these flavors for the first time, we invite you to experience the warmth and hospitality that define our kitchen.",
      },
      values: [
        { title: 'Authenticity', description: 'We stay true to traditional recipes and cooking methods' },
        { title: 'Quality', description: 'Only the freshest ingredients make it to your plate' },
        { title: 'Community', description: 'We bring people together through food and culture' },
        { title: 'Excellence', description: 'Every dish is prepared with care and passion' },
      ],
      team: [
        { name: 'Kwame Osei', role: 'Head Chef', description: 'With 20 years of experience in traditional Ghanaian cooking', image: '' },
        { name: 'Akosua Mensah', role: 'Restaurant Manager', description: 'Ensuring every guest feels at home in our kitchen', image: '' },
        { name: 'Kofi Asante', role: 'Sous Chef', description: 'Bringing innovation while respecting tradition', image: '' },
      ],
    };
  });

  // Gallery images state
  const [galleryImages, setGalleryImagesState] = useState<GalleryImage[]>(() => {
    try {
      const raw = localStorage.getItem('restaurant-gallery-images');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  // Contact page info state
  const [contactPageInfo, setContactPageInfoState] = useState<ContactPageInfo>(() => {
    try {
      const raw = localStorage.getItem('restaurant-contact-page');
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      pageContent: {
        heroTitle: 'Contact Us',
        heroSubtitle: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      },
        contactInfo: {
        address: '123 Liberation Road\nAccra, Ghana',
        phone: '+233 24 750 5196',
        email: 'hello@oseiserwaa.com',
        hours: { weekday: 'Mon - Fri: 11:00 AM - 10:00 PM', weekend: 'Sat - Sun: 10:00 AM - 11:00 PM' },
      },
    };
  });

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('restaurant-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('restaurant-cart', JSON.stringify(cart));
  }, [cart]);

  // Menu functions
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  // Cart functions
  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      updateCartQuantity(item.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  

  // Reservation functions
  const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: `RES-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReservations([newReservation, ...reservations]);
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations(reservations.map(reservation => 
      reservation.id === id ? { ...reservation, status } : reservation
    ));
  };

  const deleteReservation = (id: string) => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
  };

  // Contact Message functions
  const addContactMessage = (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const newMessage: ContactMessage = {
      ...message,
      id: `MSG-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    setContactMessages([newMessage, ...contactMessages]);
  };

  const updateContactMessageStatus = (id: string, status: ContactMessage['status']) => {
    setContactMessages(contactMessages.map(message => 
      message.id === id ? { ...message, status } : message
    ));
  };

  const deleteContactMessage = (id: string) => {
    setContactMessages(contactMessages.filter(message => message.id !== id));
  };

  const setHeroImage = (page: string, url: string) => {
    setHeroImages(prev => {
      const next = { ...prev, [page]: url };
      try {
        localStorage.setItem('restaurant-hero-images', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const setHeroText = (page: string, payload: { title?: string; subtitle?: string; tagline?: string }) => {
    setHeroTexts(prev => {
      const next = { ...prev, [page]: { ...(prev[page] || {}), ...payload } };
      try {
        localStorage.setItem('restaurant-hero-texts', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const setHomeContent = (c: HomeContent) => {
    setHomeContentState(c);
    try {
      localStorage.setItem('restaurant-home-content', JSON.stringify(c));
    } catch {}
  };

  const setAboutContent = (c: AboutContent) => {
    setAboutContentState(c);
    try {
      localStorage.setItem('restaurant-about-content', JSON.stringify(c));
    } catch {}
  };

  const setGalleryImages = (imgs: GalleryImage[]) => {
    setGalleryImagesState(imgs);
    try {
      localStorage.setItem('restaurant-gallery-images', JSON.stringify(imgs));
    } catch {}
  };

  const setContactPageInfo = (info: ContactPageInfo) => {
    setContactPageInfoState(info);
    try {
      localStorage.setItem('restaurant-contact-page', JSON.stringify(info));
    } catch {}
  };

  const value: RestaurantContextType = {
    menuItems,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
  
    reservations,
    addReservation,
    updateReservationStatus,
    deleteReservation,
    contactMessages,
    addContactMessage,
    updateContactMessageStatus,
    deleteContactMessage,
    heroImages,
    setHeroImage,
    heroTexts,
    setHeroText,
    homeContent,
    setHomeContent,
    aboutContent,
    setAboutContent,
    galleryImages,
    setGalleryImages,
    contactPageInfo,
    setContactPageInfo,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};
