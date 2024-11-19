import { Module } from '@nestjs/common';
import { CartItemRepository } from './cart-items.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  controllers: [],
  providers: [
    CartItemRepository,
    {
      provide: 'ICartItemRepository',
      useExisting: CartItemRepository,
    },
  ],
})
export class CartItemsModule {}
