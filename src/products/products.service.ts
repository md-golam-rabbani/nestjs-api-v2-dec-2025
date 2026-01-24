import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { ProductListFilterDto } from './dto/request/product-list-filter.dto';
import { instanceToPlain } from 'class-transformer';
import { ProductResponseDto } from './dto/response/product-response.dto';
import { ProductListResponseDto } from './dto/response/product-list-response.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsRepository.create(createProductDto);
    return instanceToPlain(product, {
      groups: ['response'],
    }) as ProductResponseDto;
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return instanceToPlain(product, {
      groups: ['response'],
    }) as ProductResponseDto;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const existingProduct = await this.productsRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const product = await this.productsRepository.update(id, updateProductDto);
    return instanceToPlain(product, {
      groups: ['response'],
    }) as ProductResponseDto;
  }

  async remove(id: string): Promise<void> {
    const existingProduct = await this.productsRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    await this.productsRepository.remove(id);
  }

  async togglePublishStatus(id: string): Promise<ProductResponseDto> {
    const existingProduct = await this.productsRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const product = await this.productsRepository.togglePublishStatus(id);
    return instanceToPlain(product, {
      groups: ['response'],
    }) as ProductResponseDto;
  }

  async findAllWithFilters(
    filterDto: ProductListFilterDto,
  ): Promise<ProductListResponseDto<ProductResponseDto>> {
    const result = await this.productsRepository.findAllWithFilters(filterDto);

    const items = result.items.map((product) =>
      instanceToPlain(product, { groups: ['response'] }),
    ) as ProductResponseDto[];

    return {
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      items,
    };
  }
}
