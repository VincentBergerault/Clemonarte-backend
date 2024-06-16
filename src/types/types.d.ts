export type IUser = {
  id: number;
  username: string;
  password: string;
  role: string;
};

export type Product = {
  name: string;
  price: number;
  src: string;
  visible: boolean;
  description: string;
  authorDescription: string;
  materials: Array<string>;
};

export type Image = {
  name: string;
  productID: string;
  content: string;
  extension: string;
};

export type ClientProduct = {
  name: string;
  price: number;
  src: string;
  description: string;
  materials: Array<string>;
};
