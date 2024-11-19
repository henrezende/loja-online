import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';

export interface ICartItemRepository {
  create(cartItem: CartItem): Promise<void>;
  update(cartItem: CartItem): Promise<void>;
  findByCartAndItemId(productId: number, cartId: number): Promise<CartItem>;
}

@Injectable()
export class CartItemRepository implements ICartItemRepository {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
  ) {}

  async create(cartItem: CartItem): Promise<void> {
    await this.cartItemRepo.save(cartItem);
  }

  async update(cartItem: CartItem): Promise<void> {
    await this.cartItemRepo.update(cartItem.id, cartItem);
  }

  async findByCartAndItemId(
    productId: number,
    cartId: number,
  ): Promise<CartItem> {
    return await this.cartItemRepo.findOne({
      where: { product: { id: productId }, cart: { id: cartId } },
      relations: ['product', 'cart'],
    });
  }
}
