import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { ProductListFilterDto } from './dto/request/product-list-filter.dto';
import { ProductResponseDto } from './dto/response/product-response.dto';
import { ProductListResponseDto } from './dto/response/product-list-response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe()) createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.create(createProductDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    await this.productsService.remove(id);
    return;
  }

  @Patch(':id/toggle-publish')
  async togglePublishStatus(
    @Param('id') id: string,
  ): Promise<ProductResponseDto> {
    return await this.productsService.togglePublishStatus(id);
  }

  @Post('list')
  async findAllWithFilters(
    @Body(new ValidationPipe()) filterDto: ProductListFilterDto,
  ): Promise<ProductListResponseDto<ProductResponseDto>> {
    return await this.productsService.findAllWithFilters(filterDto);
  }
}
