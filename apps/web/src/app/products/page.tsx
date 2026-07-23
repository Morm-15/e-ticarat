import { Container } from '@/components/ui/container';
import { ProductGrid } from '@/modules/products/components/product-grid';
import { getProducts } from '@/modules/products/actions/get-products';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { getVisiblePages } from '@/lib/utils';

interface ProductsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const { items: products, pages } = await getProducts(currentPage, 12);

  const visiblePages = getVisiblePages(currentPage, pages);

  return (
    <Container className="mt-8">
      <div className="space-y-8 pb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Explore our complete collection of gadgets and electronics.</p>
        </div>

        <ProductGrid products={products} />

        <div className="flex justify-center mt-8">
          {pages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={`/products?page=${currentPage - 1}`}
                    isActive={currentPage > 1}
                  />
                </PaginationItem>

                {visiblePages.map((pageNum, idx) =>
                  pageNum === null ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href={`/products?page=${pageNum}`}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    href={`/products?page=${currentPage + 1}`}
                    isActive={currentPage < pages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </Container>
  );
}
