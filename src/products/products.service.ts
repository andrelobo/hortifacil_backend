import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { slugify } from '../common/utils/slugify.util';
import { StoresService } from '../stores/stores.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetPublicProductsQueryDto } from './dto/get-public-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly categoriesService: CategoriesService,
    private readonly storesService: StoresService,
  ) {}

  async create(storeId: string, createProductDto: CreateProductDto) {
    this.validatePrices(
      createProductDto.priceCents,
      createProductDto.promotionalPriceCents,
    );

    if (createProductDto.categoryId) {
      await this.categoriesService.ensureExistsForStore(
        storeId,
        createProductDto.categoryId,
      );
    }

    const slug = slugify(createProductDto.name);
    await this.ensureUniqueSlug(storeId, slug);

    return this.productModel.create({
      storeId,
      ...createProductDto,
      slug,
      promotionalPriceCents: createProductDto.promotionalPriceCents ?? null,
      categoryId: createProductDto.categoryId ?? null,
      isAvailable: createProductDto.isAvailable ?? true,
      isFeatured: createProductDto.isFeatured ?? false,
      archivedAt: null,
    });
  }

  async listPublic(query: GetPublicProductsQueryDto) {
    const store = await this.storesService.findDefaultStore();

    if (!store) {
      throw new NotFoundException('Nenhuma loja ativa encontrada');
    }

    const filter: Record<string, unknown> = {
      storeId: store._id,
      isAvailable: true,
      archivedAt: null,
    };

    if (query.categoryId) {
      filter.categoryId = new Types.ObjectId(query.categoryId);
    }

    if (query.featured) {
      filter.isFeatured = true;
    }

    if (query.promotionOnly) {
      filter.promotionalPriceCents = { $ne: null };
    }

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    const items = await this.productModel
      .find(filter)
      .sort({ isFeatured: -1, name: 1 })
      .lean()
      .exec();

    return { items };
  }

  async findPublicBySlug(slug: string) {
    const store = await this.storesService.findDefaultStore();

    if (!store) {
      throw new NotFoundException('Nenhuma loja ativa encontrada');
    }

    const product = await this.productModel
      .findOne({
        storeId: store._id,
        slug,
        isAvailable: true,
        archivedAt: null,
      })
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException('Produto nao encontrado');
    }

    return product;
  }

  async listAdmin(storeId: string) {
    const items = await this.productModel
      .find({ storeId, archivedAt: null })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return {
      items,
      total: items.length,
    };
  }

  async update(
    storeId: string,
    productId: string,
    updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productModel.findOne({
      _id: productId,
      storeId,
      archivedAt: null,
    });

    if (!product) {
      throw new NotFoundException('Produto nao encontrado');
    }

    const nextPrice =
      updateProductDto.priceCents !== undefined
        ? updateProductDto.priceCents
        : product.priceCents;
    const nextPromotionalPrice =
      updateProductDto.promotionalPriceCents !== undefined
        ? updateProductDto.promotionalPriceCents
        : product.promotionalPriceCents;

    this.validatePrices(nextPrice, nextPromotionalPrice ?? undefined);

    if (updateProductDto.categoryId) {
      await this.categoriesService.ensureExistsForStore(
        storeId,
        updateProductDto.categoryId,
      );
    }

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const slug = slugify(updateProductDto.name);
      await this.ensureUniqueSlug(storeId, slug, product._id);
      product.name = updateProductDto.name;
      product.slug = slug;
    }

    if (updateProductDto.description !== undefined) {
      product.description = updateProductDto.description;
    }

    if (updateProductDto.unitLabel !== undefined) {
      product.unitLabel = updateProductDto.unitLabel;
    }

    if (updateProductDto.priceCents !== undefined) {
      product.priceCents = updateProductDto.priceCents;
    }

    if (updateProductDto.promotionalPriceCents !== undefined) {
      product.promotionalPriceCents = updateProductDto.promotionalPriceCents;
    }

    if (updateProductDto.categoryId !== undefined) {
      product.categoryId = updateProductDto.categoryId
        ? new Types.ObjectId(updateProductDto.categoryId)
        : null;
    }

    if (updateProductDto.imageUrl !== undefined) {
      product.imageUrl = updateProductDto.imageUrl;
    }

    if (updateProductDto.isAvailable !== undefined) {
      product.isAvailable = updateProductDto.isAvailable;
    }

    if (updateProductDto.isFeatured !== undefined) {
      product.isFeatured = updateProductDto.isFeatured;
    }

    await product.save();

    return product;
  }

  async getAvailableProductsForStore(
    storeId: string | Types.ObjectId,
    productIds: string[],
  ) {
    const products = await this.productModel
      .find({
        storeId,
        _id: { $in: productIds },
        isAvailable: true,
        archivedAt: null,
      })
      .exec();

    const productMap = new Map(products.map((product) => [product.id, product]));

    for (const productId of productIds) {
      if (!productMap.has(productId)) {
        throw new BadRequestException(
          `Produto indisponivel ou inexistente: ${productId}`,
        );
      }
    }

    return productMap;
  }

  private validatePrices(
    priceCents: number,
    promotionalPriceCents?: number | null,
  ) {
    if (promotionalPriceCents !== undefined && promotionalPriceCents !== null) {
      if (promotionalPriceCents >= priceCents) {
        throw new BadRequestException(
          'Preco promocional deve ser menor que o preco base',
        );
      }
    }
  }

  private async ensureUniqueSlug(
    storeId: string,
    slug: string,
    ignoreId?: Types.ObjectId,
  ) {
    const existing = await this.productModel.findOne({
      storeId,
      slug,
      ...(ignoreId ? { _id: { $ne: ignoreId } } : {}),
    });

    if (existing) {
      throw new ConflictException('Ja existe produto com este nome');
    }
  }
}

