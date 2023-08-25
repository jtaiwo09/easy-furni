interface IsearchParams {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
interface IBank {
  id: number;
  name: string;
  code: string;
}

interface Image {
  public_id: string;
  url: string;
  _id?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  tags: string;
  originalPrice: number;
  discountPrice: number;
  stock: number;
  images: Image[];
  shopId: string;
  shop: Shop;
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
  role: "user" | "Admin";
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
  userToken?: string;
}

interface Shop {
  avatar: {
    public_id: string;
    url: string;
  };
  _id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  description: string;
  role: "Seller";
  blocked: boolean;
  availableBalance: number;
  transactions: {
    _id: string;
    amount: number;
    updatedAt: Date;
    status: string;
  }[];
  withdrawMethod: {
    bankName: string;
    bankHolderName: string;
    bankAccountNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
  ratings?: any;
}

interface Order {
  _id?: string;
  cart: IProduct[];
  discountPrice?: number | null;
  shipping: number;
  shippingAddress: Address;
  subTotalPrice?: number;
  totalPrice: number;
  user: User;
  paymentInfo?: {
    type: string;
    status?: string;
    id?: string;
    ref?: string;
    paid: boolean;
  };
  status?: string;
  createdAt?: Date;
  paidAt?: Date;
  deliveredAt?: Date;
}

interface Address {
  address: string;
  country: string;
  state: string;
  email: string;
  name: string;
  phoneNumber: string;
}
