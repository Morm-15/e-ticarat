import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { connectDB } from '../utils/config';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from 'src/users/users.module';
import { CommandModule } from 'nestjs-command';
import { CartModule } from 'src/cart/cart.module';
import { OrderModule } from '../orders/order.module';
// import { SeedsModule } from '../seeds/seeds.module';
import { AppController } from './controllers/app.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AppService } from './services/app.service';
import { AiModule } from '@/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    // Rate limiting: 60 requests per minute per IP
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 60,
      },
    ]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: connectDB,
    }),
    CommandModule,
    ProductsModule,
    UsersModule,
    CartModule,
    OrderModule,
    CloudinaryModule,
    AiModule,
    // SeedsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
