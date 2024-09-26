import { connectToDB } from "../mongoDB";
import RawMaterial from '../models/RawMaterial';
import Polish from "../models/Polish";
import Color from "../models/Color";
import Packaging from "../models/Packaging";
import Box from "../models/Box";
import Product from "../models/Product";

type ProductData = {
  product: string;
  totalWeight: number;
  partialWeight: number;
  vendor?: string;
  rate?: number;
  gross: number;
  pieces: number;
  boxCount?: number;
  quantity?: string;
};

type Document = {
  date: string;
  products: ProductData[];
  return?: {
    weight?: number;
    gross?: number;
    packets?: number;
    isVerified?: boolean;
  }[];
};

const sumGrossForProduct = (documents: Document[], product: string, model: string): number => {
  if (model !== "packaging") {
    return documents.reduce((total: number, doc: Document) => {
      const productData = doc.products.find(p => p.product === product);
      return total + (productData ? productData.gross : 0);
    }, 0);
  } else {
    return documents.reduce((total: number, doc: Document) => {
      const returnGross = doc.return?.reduce((returnTotal: number, returnItem) => {
        // Check if doc.products is defined before calling .find()
        if (!doc.products) return returnTotal; // Prevent error if products is undefined

        // Only add gross if the return item's product matches
        const productData = doc.products.find(p => p.product === product);
        return returnTotal + (returnItem.gross && productData ? returnItem.gross : 0);
      }, 0) || 0; // Default to 0 if return is undefined
      return total + returnGross;
    }, 0);
  }
};

const sumWeightForProduct = (documents: Document[], product: string, model: string): number => {
  if (model !== "packaging") {
    return documents.reduce((total: number, doc: Document) => {
      const productData = doc.products.find(p => p.product === product);
      return total + (productData ? productData.totalWeight : 0);
    }, 0);
  } else {
    return documents.reduce((total: number, doc: Document) => {
      const returnWeight = doc.return?.reduce((returnTotal: number, returnItem) => {
        return returnTotal + (returnItem.weight || 0); // Use optional chaining and defaulting to 0
      }, 0) || 0; // Default to 0 if return is undefined
      return total + returnWeight;
    }, 0);
  }
};

const sumPiecesForProduct = (documents: Document[], product: string, model: string): number => {
  if (model !== "packaging") {
    return documents.reduce((total: number, doc: Document) => {
      const productData = doc.products.find(p => p.product === product);
      return total + (productData ? productData.pieces : 0);
    }, 0);
  } else {
    return documents.reduce((total: number, doc: Document) => {
      const returnPieces = doc.return?.reduce((returnTotal: number, returnItem) => {
        return returnTotal + ((returnItem.gross || 0) * 12); // Optional chaining and defaulting to 0
      }, 0) || 0; // Default to 0 if return is undefined
      return total + returnPieces;
    }, 0);
  }
};

export const getProductGrossData = async () => {
  await connectToDB();

  const products = await Product.find().sort({ expense: "asc" }).select('title'); // Get only the product titles
  const rawMaterials = await RawMaterial.find();
  const polishes = await Polish.find();
  const colors = await Color.find();
  const packagings = await Packaging.find();
  const boxes = await Box.find();

  const productGrossData = await Promise.all(products.map(async (product) => {
    const rawGross = sumGrossForProduct(rawMaterials, product.title, "raw");
    const polishGross = sumGrossForProduct(polishes, product.title, "polish");
    const colorGross = sumGrossForProduct(colors, product.title, "color");
    const packagingGross = sumGrossForProduct(packagings, product.title, "packaging");
    const boxCount = boxes.reduce((total: number, doc: Document) => {
      const boxData = doc.products.find(p => p.product === product.title);
      return total + (boxData?.boxCount ?? 0); // Optional chaining and defaulting to 0
    }, 0);

    return {
      product: product.title,
      rawGross,
      polishGross,
      packagingGross,
      colorGross,
      boxCount
    };
  }));

  return productGrossData;
};

export const getProductWeightData = async () => {
  await connectToDB();

  const products = await Product.find().sort({ expense: "asc" }).select('title'); // Get only the product titles
  const rawMaterials = await RawMaterial.find();
  const polishes = await Polish.find();
  const colors = await Color.find();
  const packagings = await Packaging.find();
  const boxes = await Box.find();

  const productWeightData = await Promise.all(products.map(async (product) => {
    const rawGross = sumWeightForProduct(rawMaterials, product.title, "raw");
    const polishGross = sumWeightForProduct(polishes, product.title, "polish");
    const colorGross = sumWeightForProduct(colors, product.title, "color");
    const packagingGross = sumWeightForProduct(packagings, product.title, "packaging");
    const boxCount = boxes.reduce((total: number, doc: Document) => {
      const boxData = doc.products.find(p => p.product === product.title);
      return total + (boxData?.boxCount ?? 0); // Optional chaining and defaulting to 0
    }, 0);

    return {
      product: product.title,
      rawGross,
      polishGross,
      packagingGross,
      colorGross,
      boxCount
    };
  }));

  return productWeightData;
};

export const getProductPiecesData = async () => {
  await connectToDB();

  const products = await Product.find().sort({ expense: "asc" }).select('title'); // Get only the product titles
  const rawMaterials = await RawMaterial.find();
  const polishes = await Polish.find();
  const colors = await Color.find();
  const packagings = await Packaging.find();
  const boxes = await Box.find();

  const productPiecesData = await Promise.all(products.map(async (product) => {
    const rawGross = sumPiecesForProduct(rawMaterials, product.title, "raw");
    const polishGross = sumPiecesForProduct(polishes, product.title, "polish");
    const packagingGross = sumPiecesForProduct(packagings, product.title, "packaging");
    const colorGross = sumPiecesForProduct(colors, product.title, "color");
    const boxCount = boxes.reduce((total: number, doc: Document) => {
      const boxData = doc.products.find(p => p.product === product.title);
      return total + (boxData?.boxCount ?? 0); // Optional chaining and defaulting to 0
    }, 0);

    return {
      product: product.title,
      rawGross,
      polishGross,
      packagingGross,
      colorGross,
      boxCount
    };
  }));

  return productPiecesData;
};
