import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { slugify } from '../common/utils/slugify.util';
import { StoresService } from '../stores/stores.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    private readonly storesService: StoresService,
  ) {}

  async create(storeId: string, createCategoryDto: CreateCategoryDto) {
    const slug = slugify(createCategoryDto.name);
    await this.ensureUniqueSlug(storeId, slug);

    const category = await this.categoryModel.create({
      storeId,
      name: createCategoryDto.name,
      slug,
      description: createCategoryDto.description,
      sortOrder: createCategoryDto.sortOrder ?? 0,
      isActive: createCategoryDto.isActive ?? true,
      archivedAt: null,
    });

    return category;
  }

  listAdmin(storeId: string) {
    return this.categoryModel
      .find({ storeId, archivedAt: null })
      .sort({ sortOrder: 1, name: 1 })
      .lean()
      .exec();
  }

  async listPublic() {
    const store = await this.storesService.findDefaultStore();

    if (!store) {
      throw new NotFoundException('Nenhuma loja ativa encontrada');
    }

    return this.categoryModel
      .find({
        storeId: store._id,
        isActive: true,
        archivedAt: null,
      })
      .sort({ sortOrder: 1, name: 1 })
      .lean()
      .exec();
  }

  async update(
    storeId: string,
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryModel.findOne({
      _id: categoryId,
      storeId,
      archivedAt: null,
    });

    if (!category) {
      throw new NotFoundException('Categoria nao encontrada');
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const slug = slugify(updateCategoryDto.name);
      await this.ensureUniqueSlug(storeId, slug, category._id);
      category.name = updateCategoryDto.name;
      category.slug = slug;
    }

    if (updateCategoryDto.description !== undefined) {
      category.description = updateCategoryDto.description;
    }

    if (updateCategoryDto.sortOrder !== undefined) {
      category.sortOrder = updateCategoryDto.sortOrder;
    }

    if (updateCategoryDto.isActive !== undefined) {
      category.isActive = updateCategoryDto.isActive;
    }

    await category.save();

    return category;
  }

  async ensureExistsForStore(
    storeId: string,
    categoryId: string | Types.ObjectId,
  ) {
    const category = await this.categoryModel.findOne({
      _id: categoryId,
      storeId,
      archivedAt: null,
    });

    if (!category) {
      throw new NotFoundException('Categoria nao encontrada');
    }

    return category;
  }

  private async ensureUniqueSlug(
    storeId: string,
    slug: string,
    ignoreId?: Types.ObjectId,
  ) {
    const existing = await this.categoryModel.findOne({
      storeId,
      slug,
      ...(ignoreId ? { _id: { $ne: ignoreId } } : {}),
    });

    if (existing) {
      throw new ConflictException('Ja existe categoria com este nome');
    }
  }
}

