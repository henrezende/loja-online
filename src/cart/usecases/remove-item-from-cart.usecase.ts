import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICartRepository } from '../cart.repository';
import { ICartItemRepository } from 'src/cart-items/cart-items.repository';

@Injectable()
export class RemoveItemFromCartUseCase {
  constructor(
    @Inject('ICartRepository')
    private readonly cartRepository: ICartRepository,

    @Inject('ICartItemRepository')
    private readonly cartItemRepository: ICartItemRepository,
  ) {}

  async execute(productId: number): Promise<any> {
    const cart = await this.cartRepository.getOrCreateCart();

    const cartItem = await this.cartItemRepository.findByCartAndItemId(
      productId,
      cart.id,
    );

    if (!cartItem) {
      throw new NotFoundException('Produto não encontrado no carrinho');
    }

    return await this.cartRepository.removeItem(cartItem, cart);
  }
}
