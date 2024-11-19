import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../products.repository';

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,
  ) {}

  async execute() {
    return this.repo.findAll();
  }
}
