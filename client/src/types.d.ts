interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  tags: string;
  originalPrice: number;
  discountPrice: number;
  stock: number;
  images: {
    public_id: string;
    url: string;
    _id: string;
  }[];
  shopId: string;
  shop: {
    avatar: {
      public_id: string;
      url: string;
    };
    _id: string;
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    role: "Seller" | "user" | "Admin";
    availableBalance: number;
    transections: Array;
    createdAt: Date;
    updatedAt: Date;
    ratings?: any;
  };
  sold_out: number;
  reviews: {
    user: User;
    comment: string;
    productId: string;
    rating: number;
    _id: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  qty: number;
  ratings?: number;
}

interface Products {
  products: Product[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: "user";
  addresses: {
    country: string;
    state: string;
    address: string;
    phoneNumber: string;
    default: boolean;
    _id: string;
  }[];
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  cart: IProduct[];
  discountPrice?: number | null;
  shipping: number;
  shippingAddress: {
    address: string;
    country: string;
    state: string;
    email: string;
    name: string;
    phoneNumber: string;
  };
  subTotalPrice?: number;
  totalPrice: number;
  user: User;
  paymentInfo?: {
    type: string;
    status?: string;
    id?: string;
  };
  status?: string;
  createdAt?: Date;
  paidAt?: Date;
}
