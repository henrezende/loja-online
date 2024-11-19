import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { UpdateItemQuantityDto } from './dto/update-item-quantity.dto';
import { AddItemToCartUseCase } from './usecases/add-item-to-cart.usecase';
import { RemoveItemFromCartUseCase } from './usecases/remove-item-from-cart.usecase';
import { UpdateItemQuantityUseCase } from './usecases/update-item-quantity.usecase';
import { GetCartUseCase } from './usecases/get-cart.usecase';
import { CheckoutCartUseCase } from './usecases/checkout-cart.usecase';

@Controller('carrinho')
export class CartController {
  @Inject(AddItemToCartUseCase)
  private readonly addItemToCartUseCase: AddItemToCartUseCase;

  @Inject(RemoveItemFromCartUseCase)
  private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase;

  @Inject(UpdateItemQuantityUseCase)
  private readonly updateItemQuantityUseCase: UpdateItemQuantityUseCase;

  @Inject(CheckoutCartUseCase)
  private readonly checkoutCartUseCase: CheckoutCartUseCase;

  @Inject(GetCartUseCase)
  private readonly getCartUseCase: GetCartUseCase;

  @Get()
  getCart() {
    return this.getCartUseCase.execute();
  }

  @Post('item/:itemId')
  async addItem(@Param() addItemToCartDto: AddItemToCartDto) {
    return await this.addItemToCartUseCase.execute(addItemToCartDto);
  }

  @Delete('item/:id')
  async removeItem(@Param('id') productId: number) {
    return await this.removeItemFromCartUseCase.execute(productId);
  }

  @Patch('atualizar-quantidade-item/:id')
  async updateItemQuantity(
    @Param('id') itemId: number,
    @Body() updateItemQuantityDto: UpdateItemQuantityDto,
  ) {
    return await this.updateItemQuantityUseCase.execute(
      itemId,
      updateItemQuantityDto,
    );
  }

  @Post('checkout')
  async checkout() {
    return await this.checkoutCartUseCase.execute();
  }
}
