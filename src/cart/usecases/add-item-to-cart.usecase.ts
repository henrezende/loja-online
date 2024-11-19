import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICartRepository } from '../cart.repository';
import { AddItemToCartDto } from '../dto/add-item-to-cart.dto';
import { Cart } from '../entities/cart.entity';
import { IProductRepository } from 'src/products/products.repository';

@Injectable()
export class AddItemToCartUseCase {
  constructor(
    @Inject('ICartRepository')
    private readonly cartRepository: ICartRepository,

    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(addItemToCartDto: AddItemToCartDto): Promise<Cart> {
    const { itemId } = addItemToCartDto;

    const product = await this.productRepository.findById(itemId);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const cart = await this.cartRepository.getOrCreateCart();

    return await this.cartRepository.addItem(product, cart);
  }
}
