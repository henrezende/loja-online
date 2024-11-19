import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

export interface IProductRepository {
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product>;
}

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(product: Product): Promise<void> {
    await this.productRepo.save(product);
  }

  async update(product: Product): Promise<void> {
    await this.productRepo.update(product.id, product);
  }

  findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findById(id: number): Promise<Product> {
    return await this.productRepo.findOne({ where: { id } });
  }
}
