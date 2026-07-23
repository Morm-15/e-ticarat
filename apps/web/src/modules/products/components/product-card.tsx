'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Product } from '@apps/shared/types';
import { useTranslation } from '@/i18n/context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 group">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
          {product.countInStock === 0 && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
              {t('products.outOfStock')}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border space-y-2">
          <div className="text-xs text-muted-foreground font-semibold uppercase">{product.category}</div>
          <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="flex items-center justify-between pt-1">
            <p className="text-lg font-bold text-primary">${product.price}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-accent px-2 py-1 rounded-md">
              <span className="text-yellow-500">⭐</span>
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
              <span>({product.numReviews})</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
