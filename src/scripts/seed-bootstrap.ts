import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { SettingsSchema } from '../settings/schemas/settings.schema';
import { StoreSchema } from '../stores/schemas/store.schema';
import { UserRole, UserSchema } from '../users/schemas/user.schema';

type RequiredEnvKey =
  | 'MONGODB_URI'
  | 'SEED_STORE_NAME'
  | 'SEED_STORE_SLUG'
  | 'SEED_STORE_WHATSAPP'
  | 'SEED_ADMIN_NAME'
  | 'SEED_ADMIN_EMAIL'
  | 'SEED_ADMIN_PASSWORD'
  | 'SEED_STORE_STREET'
  | 'SEED_STORE_NUMBER'
  | 'SEED_STORE_NEIGHBORHOOD'
  | 'SEED_STORE_CITY'
  | 'SEED_STORE_STATE'
  | 'SEED_STORE_ZIPCODE';

function getRequiredEnv(key: RequiredEnvKey): string {
  const value = process.env[key];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
}

async function bootstrap() {
  const mongoUri = getRequiredEnv('MONGODB_URI');
  const storeName = getRequiredEnv('SEED_STORE_NAME');
  const storeSlug = getRequiredEnv('SEED_STORE_SLUG').toLowerCase();
  const whatsappNumber = getRequiredEnv('SEED_STORE_WHATSAPP');
  const adminName = getRequiredEnv('SEED_ADMIN_NAME');
  const adminEmail = getRequiredEnv('SEED_ADMIN_EMAIL').toLowerCase();
  const adminPassword = getRequiredEnv('SEED_ADMIN_PASSWORD');

  await mongoose.connect(mongoUri);

  const storeModel = mongoose.model('StoreSeed', StoreSchema, 'stores');
  const settingsModel = mongoose.model(
    'SettingsSeed',
    SettingsSchema,
    'settings',
  );
  const userModel = mongoose.model('UserSeed', UserSchema, 'users');

  const store = await storeModel.findOneAndUpdate(
    { slug: storeSlug },
    {
      name: storeName,
      slug: storeSlug,
      isActive: true,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  if (!store) {
    throw new Error('Failed to create or update store');
  }

  await settingsModel.findOneAndUpdate(
    { storeId: store._id },
    {
      storeId: store._id,
      storeName,
      whatsappNumber,
      primaryColor: '#2F855A',
      deliveryFeeCents: 0,
      minimumOrderCents: 0,
      businessHours: 'Seg a Sab 07:00-18:00',
      address: {
        street: getRequiredEnv('SEED_STORE_STREET'),
        number: getRequiredEnv('SEED_STORE_NUMBER'),
        neighborhood: getRequiredEnv('SEED_STORE_NEIGHBORHOOD'),
        city: getRequiredEnv('SEED_STORE_CITY'),
        state: getRequiredEnv('SEED_STORE_STATE'),
        zipCode: getRequiredEnv('SEED_STORE_ZIPCODE'),
        complement: process.env.SEED_STORE_COMPLEMENT?.trim() || undefined,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const adminUser = await userModel.findOneAndUpdate(
    { storeId: store._id, email: adminEmail },
    {
      storeId: store._id,
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log('Bootstrap seed concluido com sucesso.');
  console.log(`Loja: ${storeName} (${storeSlug})`);
  console.log(`Admin: ${adminName} <${adminEmail}>`);
  console.log(`User ID: ${adminUser?._id?.toString() ?? 'n/a'}`);

  await mongoose.disconnect();
}

void bootstrap().catch(async (error: unknown) => {
  console.error('Falha ao executar seed-bootstrap.');
  console.error(error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
