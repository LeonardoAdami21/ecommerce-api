import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCT_MODEL } from './provider/model.provider';
import { Model } from 'mongoose';
import { Product } from './model/product.model';
import cloudinary from '../config/cloudinary.config';
import redisClient from '../config/redis.config';
import { Express } from 'express';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_MODEL) private readonly productModel: Model<Product>,
  ) {}

  async findAll() {
    try {
      const products = await this.productModel.find();
      return products;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getFeaturedPrducts() {
    try {
      let featuredProducts: any = await redisClient.get('featured_products');
      if (featuredProducts) {
        return JSON.parse(featuredProducts);
      }
      featuredProducts = await this.productModel
        .find({ isFeatured: true })
        .lean();
      if (!featuredProducts) {
        throw new NotFoundException('Products not found');
      }
      await redisClient.set(
        'featured_products',
        JSON.stringify(featuredProducts),
      );
      return featuredProducts;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getRecommendedProducts() {
    try {
      const products = await this.productModel.aggregate([
        { $sample: { size: 4 } },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            image: 1,
            price: 1,
          },
        },
      ]);
      return products;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllProductsByCategory(category: string) {
    try {
      const products = await this.productModel.find({ category });
      return products;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateFeaturedProductsCache() {
    try {
      const products = await this.productModel.find({ isFeatured: true });
      await redisClient.set('featured_products', JSON.stringify(products));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async toggleFeaturedProduct(id: string) {
    try {
      const product = await this.productModel.findById(id);
      if (product) {
        product.isFeatured = !product.isFeatured;
        const updatedProduct = await product.save();
        await this.updateFeaturedProductsCache();
        return updatedProduct;
      } else {
        throw new NotFoundException('Product not found');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async create(dto: CreateProductDto, file: Express.Multer.File) {
    try {
      const { name, description, price, category } = dto;
      if (!name || !description || !price || !category || !file) {
        throw new BadRequestException('All fields are required');
      }
      let cloudinaryResponse: any = null;
      if (file) {
        cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
        });
      }
      const product = await this.productModel.create({
        name,
        description,
        price,
        category,
        file: cloudinaryResponse?.secure_url
          ? cloudinaryResponse.secure_url
          : '',
      });
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string) {
    try {
      const product = await this.productModel.findById(id);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      if (product.file) {
        const publicId = product.file.split('/').pop()?.split('.')[0];
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log('File deleted successfully');
        } catch (error) {
          throw new InternalServerErrorException(error.message);
        }
      }
      await this.productModel.findByIdAndDelete(id);
      return {
        message: 'Product deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
