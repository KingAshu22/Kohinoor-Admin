type CollectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
}

type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  category: string;
  collections: [CollectionType];
  tags: [string];
  sizes: [string];
  colors: [string];
  price: number;
  expense: number;
  createdAt: Date;
  updatedAt: Date;
}

type VendorType = {
  _id: string;
  name: string;
  address: string;
  contact: string;
  type: string;
}

type materialType = {
  _id: string;
  date: string;
  product: string;
  vendor: string;
  isCompleted: boolean;
  packaging: {
    weight: number;
    partialWeight: number;
    gross: number;
    pieces: number;
  };
  products: {
    product: string;
    totalWeight: number;
    partialWeight: number;
    vendor: string;
    rate: number;
    gross: number;
    pieces: number;
  }[];
}

type PackagingProductType = {
  _id: string;
  date: string;
  product: string;
  vendor: string;
  rate: number;
  totalWeight: number;
  remainingWeight: number;
  isCompleted: boolean;
  packaging: {
    weight: number;
    gross: number;
    pieces: number;
  }[];
  return: {
    _id: string;
    date: string;
    weight: number;
    packets: number;
    gross: number;
    isVerified: boolean;
  }[];
  box: {
    _id: string;
    date: string;
    packets: number;
    gross: number;
    boxCount: string;
    quantity: number;
  }[];
};

type ReturnData = {
  _id: string;
  date: string;
  weight: number;
  packets: number;
  gross: number;
  isVerified: boolean;
};

type OrderColumnType = {
  _id: string;
  customer: string;
  products: number;
  totalAmount: number;
  createdAt: string;
}

type OrderItemType = {
  product: ProductType
  color: string;
  size: string;
  quantity: number;
}

type CustomerType = {
  clerkId: string;
  name: string;
  email: string;
}

type ProductData = {
  product: string;
  totalWeight: number;
  partialWeight: number;
  vendor?: string;
  rate?: number;
  gross: number;
  pieces?: number;
  boxCount?: number;
  quantity?: string;
};

type Document = {
  date: string;
  products: ProductData[];
};

type DashboardData = [
  product: string,
  raw: number,
  polish: number,
  color: number,
  packaging: number,
  boxCount: number
]