import {Await, useLoaderData, Link} from 'react-router';
import {Suspense, useState} from 'react';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import {GlitchText} from '~/components/GlitchText';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Clothing | Dead Internet Archive'},
    {description: 'Browse our collection of artifacts from the digital void.'},
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const {context, request} = args;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const {products} = await context.storefront.query(PRODUCTS_QUERY, {
    variables: paginationVariables,
  });

  return {products};
}

export default function ClothingPage() {
  const {products} = useLoaderData();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['All', 'New', 'Tops', 'Bottoms', 'Accessories'];

  return (
    <div className="clothing-page">
      <header className="clothing-header">
        <GlitchText text="Collection" as="h1" variant="glitch" />
        <p>Artifacts recovered from signal decay. Each piece a fragment of the void.</p>
      </header>

      <nav className="clothing-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter.toLowerCase() ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.toLowerCase())}
          >
            {filter}
          </button>
        ))}
      </nav>

      <PaginatedResourceSection
        connection={products}
        resourcesClassName="clothing-grid"
      >
        {({node: product}) => (
          <ProductCard key={product.id} product={product} />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

/**
 * @param {{product: ProductFragment}}
 */
function ProductCard({product}) {
  return (
    <Link to={`/products/${product.handle}`} className="clothing-item">
      {product.featuredImage && (
        <Image
          data={product.featuredImage}
          aspectRatio="3/4"
          sizes="(min-width: 45em) 33vw, 50vw"
        />
      )}
      <div className="clothing-item-overlay">
        <h3 className="clothing-item-name">{product.title}</h3>
        <span className="clothing-item-price">
          ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}{' '}
          {product.priceRange.minVariantPrice.currencyCode}
        </span>
      </div>
    </Link>
  );
}

const PRODUCTS_QUERY = `#graphql
  fragment ProductFragment on Product {
    id
    title
    handle
    publishedAt
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
      }
    }
  }
  query ProductsQuery(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: UPDATED_AT
      reverse: true
    ) {
      nodes {
        ...ProductFragment
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('./+types/clothing').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
