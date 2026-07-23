import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const connectDB = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri:
    configService.get<string>('MONGODB_URI') ||
    'mongodb+srv://mostafaradwanyos_db_user:Fom1eaQ4DOpTpcK0@users.i5o1asj.mongodb.net/ecommerce?appName=Users',
  autoIndex: true,
});

export const corsConfig = (): CorsOptions => ({
  origin: process.env.CLIENT_URL,
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  credentials: true,
});
