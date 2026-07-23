'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Loader2, User } from 'lucide-react';
import { useUser } from '@/modules/auth/hooks/use-user';
import Link from 'next/link';
import { useLogout } from '@/modules/auth/hooks/use-auth';
import { useTranslation } from '@/i18n/context';

export function UserMenu() {
  const { user, isLoading } = useUser();
  const logout = useLogout();
  const { t } = useTranslation();

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span>{t('nav.login')}</span>
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span>{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('nav.profile')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">{t('nav.profile')}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/orders">{t('nav.cart')}</Link>
        </DropdownMenuItem>
        {user.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t('nav.admin')}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/admin/products">{t('nav.products')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/users">Users</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/orders">Orders</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout.mutate()} className="text-destructive cursor-pointer">
          {t('nav.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
