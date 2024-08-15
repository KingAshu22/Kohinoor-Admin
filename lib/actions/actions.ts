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
};

// Utility function to sum gross for a given product across multiple documents
const sumGrossForProduct = (documents: Document[], product: string): number => {
  return documents.reduce((total: number, doc: Document) => {
    const productData = doc.products.find(p => p.product === product);
    return total + (productData ? productData.gross : 0);
  }, 0);
};

const sumWeightForProduct = (documents: Document[], product: string): number => {
  return documents.reduce((total: number, doc: Document) => {
    const productData = doc.products.find(p => p.product === product);
    return total + (productData ? productData.totalWeight : 0);
  }, 0);
};

const sumPiecesForProduct = (documents: Document[], product: string): number => {
  return documents.reduce((total: number, doc: Document) => {
    const productData = doc.products.find(p => p.product === product);
    return total + (productData ? productData.pieces : 0);
  }, 0);
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
    const rawGross = sumGrossForProduct(rawMaterials, product.title);
    const polishGross = sumGrossForProduct(polishes, product.title);
    const colorGross = sumGrossForProduct(colors, product.title);
    const packagingGross = sumGrossForProduct(packagings, product.title);
    const boxCount = boxes.reduce((total: number, doc: Document) => {
      const boxData = doc.products.find(p => p.product === product.title);
      return total + (boxData?.boxCount ?? 0);
    }, 0);

    return {
      product: product.title,
      rawGross,
      polishGross,
      colorGross,
      packagingGross,
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
    const rawGross = sumWeightForProduct(rawMaterials, product.title);
    const polishGross = sumWeightForProduct(polishes, product.title);
    const colorGross = sumWeightForProduct(colors, product.title);
    const packagingGross = sumWeightForProduct(packagings, product.title);
    const boxCount = boxes.reduce((total: number, doc: Document) => {
      const boxData = doc.products.find(p => p.product === product.title);
      return total + (boxData?.boxCount ?? 0);
    }, 0);

    return {
      product: product.title,
      rawGross,
      polishGross,
      colorGross,
      packagingGross,
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
    const rawGross = sumPiecesForProduct(rawMaterials, product.title);
    const polishGross = sumPiecesForProduct(polishes, product.title);
    const colorGross = sumPiecesForProduct(colors, product.title);
    const packagingGross = sumPiecesForProduct(packagings, product.title);
    const boxCount = boxes.reduce((total: number, doc: Document) => {
      const boxData = doc.products.find(p => p.product === product.title);
      return total + (boxData?.boxCount ?? 0);
    }, 0);

    return {
      product: product.title,
      rawGross,
      polishGross,
      colorGross,
      packagingGross,
      boxCount
    };
  }));

  return productPiecesData;
};
