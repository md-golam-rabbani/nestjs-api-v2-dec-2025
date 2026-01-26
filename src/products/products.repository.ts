import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/request/create-product.dto';
import { ProductListFilterDto } from './dto/request/product-list-filter.dto';

/**
 * MongoDB filter type for product queries
 */
type MongoFilter = {
  name?: {
    $regex: string;
    $options?: string;
  };
  price?: {
    $gte?: number;
    $lte?: number;
  };
};

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: MongoRepository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.repository.create(createProductDto);
    return await this.repository.save(product);
  }

  async findById(id: string): Promise<Product | null> {
    return await this.repository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  async update(
    id: string,
    updateProductDto: Partial<CreateProductDto>,
  ): Promise<Product> {
    const result = await this.repository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateProductDto },
      { returnDocument: 'after' },
    );

    if (!result) {
      throw new NotFoundException('Product not found');
    }

    return result as unknown as Product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  async togglePublishStatus(id: string): Promise<Product> {
    const product = await this.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const newStatus = !product.isPublished;

    const result = await this.repository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isPublished: newStatus } },
      { returnDocument: 'after' },
    );

    return result as unknown as Product;
  }

  async findAllWithFilters(filterDto: ProductListFilterDto): Promise<{
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    content: Product[];
  }> {
    const {
      search,
      minPrice,
      maxPrice,
      pageNumber = 1,
      pageSize = 10,
    } = filterDto;

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    // Build query filter
    const filter: MongoFilter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: 'i',
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    // Get total count
    const totalElements = await this.repository.count(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalElements / pageSize);

    // Get paginated data
    const content = await this.repository.find({
      where: filter,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      pageNumber,
      pageSize,
      totalPages,
      totalElements,
      content,
    };
  }
}
