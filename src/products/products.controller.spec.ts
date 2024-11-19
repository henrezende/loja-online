import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductUseCase } from './usecases/create-product.usecase';
import { UpdateProductUseCase } from './usecases/update-product.usecase';
import { GetAllProductsUseCase } from './usecases/get-all-products.usecase';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './products.repository';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productRepo: Repository<Product>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Product],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Product]),
      ],
      controllers: [ProductsController],
      providers: [
        CreateProductUseCase,
        UpdateProductUseCase,
        GetAllProductsUseCase,
        ProductRepository,
        {
          provide: 'IProductRepository',
          useExisting: ProductRepository,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productRepo = module.get('ProductRepository');
  });

  beforeEach(async () => {
    await productRepo.clear();
  });

  describe('create', () => {
    it('should create a new product successfully', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        stock: 10,
      };

      const result = await controller.create(createProductDto);

      expect(result).toMatchObject({
        id: expect.any(Number),
        name: 'Test Product',
        price: 100,
        stock: 10,
      });

      const products = await productRepo.find();
      expect(products).toHaveLength(1);
    });

    it('should throw an error if required fields are missing', async () => {
      const createProductDto = { price: 100 };

      await expect(
        controller.create(createProductDto as any),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all products successfully', async () => {
      await productRepo.save([
        { name: 'Product 1', price: 50, stock: 5 },
        { name: 'Product 2', price: 100, stock: 10 },
      ]);

      const result = await controller.findAll();

      expect(result).toHaveLength(2);
      expect(result).toMatchObject([
        { name: 'Product 1', price: 50, stock: 5 },
        { name: 'Product 2', price: 100, stock: 10 },
      ]);
    });

    it('should return an empty array if no products exist', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update an existing product successfully', async () => {
      const product = await productRepo.save({
        name: 'Product 1',
        price: 50,
        stock: 5,
      });

      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 60,
      };

      const result = await controller.update(
        product.id.toString(),
        updateProductDto,
      );

      expect(result).toMatchObject({
        id: product.id,
        name: 'Updated Product',
        price: 60,
        stock: 5,
      });

      const count = await productRepo.count();
      expect(count).toBe(1);

      const updatedProduct = await productRepo.findOneByOrFail({
        id: product.id,
      });

      const teste = await productRepo.findOneByOrFail({ id: product.id });

      expect(updatedProduct).toMatchObject({
        name: 'Updated Product',
        price: 60,
        stock: 5,
      });
    });

    it('should throw an error if the product does not exist', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Nonexistent Product',
        price: 100,
      };

      await expect(
        controller.update('999', updateProductDto),
      ).rejects.toThrow();
    });

    it('should throw an error if the input data is invalid', async () => {
      const product = await productRepo.save({
        name: 'Product 1',
        price: 50,
        stock: 5,
      });
      const updateProductDto = { price: -10 };

      await expect(
        controller.update(product.id.toString(), updateProductDto as any),
      ).rejects.toThrow();
    });
  });
});
