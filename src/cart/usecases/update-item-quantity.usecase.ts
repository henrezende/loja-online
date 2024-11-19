import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICartRepository } from '../cart.repository';
import { UpdateItemQuantityDto } from '../dto/update-item-quantity.dto';
import { IProductRepository } from 'src/products/products.repository';
import { ICartItemRepository } from 'src/cart-items/cart-items.repository';

@Injectable()
export class UpdateItemQuantityUseCase {
  constructor(
    @Inject('ICartRepository')
    private readonly cartRepository: ICartRepository,

    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,

    @Inject('ICartItemRepository')
    private readonly cartItemRepository: ICartItemRepository,
  ) {}

  async execute(
    productId: number,
    updateItemQuantityDto: UpdateItemQuantityDto,
  ): Promise<any> {
    const { quantity } = updateItemQuantityDto;
    const cart = await this.cartRepository.getOrCreateCart();
    const cartItem = await this.cartItemRepository.findByCartAndItemId(
      productId,
      cart.id,
    );

    if (quantity <= 0) {
      return this.cartRepository.removeItem(cartItem, cart);
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    await this.cartRepository.updateItemQuantity(cart, productId, quantity);

    return cart;
  }
}
