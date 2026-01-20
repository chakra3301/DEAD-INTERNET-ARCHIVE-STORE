import {Await, useLoaderData, Link} from 'react-router';
import {Suspense, useState, useEffect} from 'react';
import {Image, useOptimisticCart, CartForm} from '@shopify/hydrogen';
import {SocialButtons} from '~/components/SocialButtons';
import {AddToCartButton} from '~/components/AddToCartButton';
import {CartMain} from '~/components/CartMain';
import crtOutline from '~/assets/outline-2.png';
import crtScreen from '~/assets/crt-screen.png';
import channel1 from '~/assets/channel-1.png';
import diaB from '~/assets/dia-b.png';
import crtZoomed from '~/assets/zoomed-new.png';
import overlay from '~/assets/overlay.png';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Dead Internet Archive'},
    {description: 'Artifacts from the digital void. Clothing for the spectral age.'},
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const {cart} = context;
  return {
    cart: await cart.get(),
  };
}

/**
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const products = context.storefront.query(PRODUCTS_QUERY, {
    variables: {first: 20},
  });

  return {
    products,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [currentScreenImage, setCurrentScreenImage] = useState(crtScreen);
  
  // Listen for cart view toggle from header
  useEffect(() => {
    const handleCartToggle = () => {
      if (isZoomed) {
        setShowCart(prev => !prev);
      }
    };
    
    window.addEventListener('toggleCartView', handleCartToggle);
    return () => window.removeEventListener('toggleCartView', handleCartToggle);
  }, [isZoomed]);

  const handleEnterScreen = () => {
    setIsZoomed(true);
  };

  const handleProductClick = (e, product, fullProductData) => {
    e.preventDefault();
    setSelectedProduct(fullProductData || product);
    setSelectedVariant(null);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  const handleNextProduct = () => {
    if (!selectedProduct || productsList.length === 0) return;
    const currentIndex = productsList.findIndex(p => p.id === selectedProduct.id);
    const nextIndex = (currentIndex + 1) % productsList.length;
    const nextProduct = productsList[nextIndex];
    setSelectedProduct(nextProduct);
    setSelectedVariant(null);
  };

  const handlePrevProduct = () => {
    if (!selectedProduct || productsList.length === 0) return;
    const currentIndex = productsList.findIndex(p => p.id === selectedProduct.id);
    const prevIndex = (currentIndex - 1 + productsList.length) % productsList.length;
    const prevProduct = productsList[prevIndex];
    setSelectedProduct(prevProduct);
    setSelectedVariant(null);
  };

  // Add class to body when zoomed (client-side only)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (isZoomed) {
      document.body.classList.add('crt-zoomed-in');
    } else {
      document.body.classList.remove('crt-zoomed-in');
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('crt-zoomed-in');
      }
    };
  }, [isZoomed]);

  // Add class to body when modal is open to disable header pointer events
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (selectedProduct) {
      document.body.classList.add('product-modal-open');
    } else {
      document.body.classList.remove('product-modal-open');
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('product-modal-open');
      }
    };
  }, [selectedProduct]);

  // Toggle between screen.png, channel-1.png, and dia-b.png every 3 seconds
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const images = [crtScreen, channel1, diaB];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setCurrentScreenImage(images[currentIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`crt-page ${isZoomed ? 'zoomed' : ''}`}>
      {/* Landing State - Full CRT Monitor */}
      <div className="crt-landing" onClick={handleEnterScreen}>
        <div className="crt-monitor-stack">
          {/* Screen content behind */}
          <img src={currentScreenImage} alt="CRT Screen" className="crt-screen-layer" />
          {/* CRT screen effects overlay */}
          <div className="crt-screen-effects">
            <div className="crt-scanlines" />
            <div className="crt-refresh-line" />
            <div className="crt-glow" />
          </div>
          {/* Monitor outline on top */}
          <img src={crtOutline} alt="CRT Monitor" className="crt-outline-layer" />
        </div>
        <span className="crt-click-hint">Click to enter</span>
      </div>

      {/* Zoomed State - Inside the screen */}
      <div className="crt-zoomed">
        {/* CRT Zoomed Background */}
        <div 
          className="crt-border-frame" 
          style={{backgroundImage: `url(${crtZoomed})`}}
        />
        
        {/* Content inside the screen */}
        <div className="crt-screen-content">
          {/* CRT Effects Overlay */}
          <div className="crt-screen-content-effects">
            <div className="crt-screen-content-scanlines" />
            <div className="crt-screen-content-refresh-line" />
            <div className="crt-screen-content-glow" />
          </div>

          {/* Overlay Image */}
          <div className="crt-screen-overlay">
            <img src={overlay} alt="" className="overlay-image" />
          </div>

          {/* Cart Button - Top Right Corner */}
          <Suspense fallback={null}>
            <Await resolve={data.cart}>
              {(cart) => <CrtCartButton cart={cart} onClick={() => setShowCart(true)} />}
            </Await>
          </Suspense>

          {/* Website Title */}
          <h1 className="crt-screen-title">DEAD INTERNET ARCHIVE</h1>
          
          {/* Toggle between Products and Cart */}
          {showCart ? (
            <CartViewContent cart={data.cart} onBack={() => setShowCart(false)} />
          ) : (
            <>
              {/* Products Grid */}
              <Suspense fallback={<ProductGridSkeleton />}>
                <Await resolve={data.products}>
                  {(response) => {
                    // Handle both direct response and nested structure
                    console.log('Full response:', JSON.stringify(response, null, 2));
                    const products = response?.products?.nodes || response?.nodes || [];
                    console.log('Products loaded:', products.length, products);
                    
                    if (products.length === 0) {
                      return (
                        <div style={{color: 'white', padding: '2rem', textAlign: 'center'}}>
                          No products found. Check console for response structure.
    </div>
  );
}

  return (
                      <ProductGridWithState
                        products={products}
                        onProductClick={handleProductClick}
                        onProductsLoaded={setProductsList}
                      />
                    );
                  }}
                </Await>
              </Suspense>
              
              {/* Social Buttons */}
              <SocialButtons />
            </>
          )}
        </div>

        {/* Dark Overlay when modal is open - covers everything except CRT outline */}
        {selectedProduct && (
          <div className="product-modal-dark-overlay" />
        )}

        {/* Product Modal - Outside content area */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
            onClose={handleCloseModal}
            onNext={handleNextProduct}
            onPrev={handlePrevProduct}
          />
        )}
      </div>
      </div>
  );
}

/**
 * Add to Cart button that closes modal after adding
 */
function AddToCartWithClose({currentVariant, onClose}) {
  return (
    <CartForm 
      route="/cart" 
      inputs={{
        lines: currentVariant
          ? [
              {
                merchandiseId: currentVariant.id,
                quantity: 1,
                selectedVariant: currentVariant,
              },
            ]
          : []
      }} 
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher) => (
        <AddToCartButtonInner 
          fetcher={fetcher} 
          currentVariant={currentVariant} 
          onClose={onClose}
        />
      )}
    </CartForm>
  );
}

/**
 * Inner component to handle the button and closing logic
 */
function AddToCartButtonInner({fetcher, currentVariant, onClose}) {
  const [prevState, setPrevState] = useState(null);
  const [hasClosed, setHasClosed] = useState(false);

  useEffect(() => {
    // Close modal when item is successfully added
    if (
      !hasClosed &&
      prevState === 'submitting' && 
      fetcher.state === 'idle' && 
      fetcher.data && 
      (!fetcher.data.errors || fetcher.data.errors.length === 0)
    ) {
      setHasClosed(true);
      onClose();
    }
    if (fetcher.state !== prevState) {
      setPrevState(fetcher.state);
    }
  }, [fetcher.state, fetcher.data, prevState, onClose, hasClosed]);

  // Reset hasClosed when variant changes
  useEffect(() => {
    setHasClosed(false);
    setPrevState(null);
  }, [currentVariant?.id]);

  return (
    <button
      type="submit"
      disabled={!currentVariant || !currentVariant.availableForSale || fetcher.state !== 'idle'}
    >
      {currentVariant?.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
    </button>
  );
}

/**
 * Cart button for CRT screen - top corner
 */
function CrtCartButton({cart, onClick}) {
  const optimisticCart = useOptimisticCart(cart);
  const count = optimisticCart?.totalQuantity ?? 0;
  
  // Always pulsate when there are items in cart
  const shouldPulsate = count > 0;
  
  return (
    <button 
      className={`crt-cart-button ${shouldPulsate ? 'pulsating' : ''}`} 
      onClick={onClick}
    >
      Cart {count > 0 ? `(${count})` : ''}
    </button>
  );
}

/**
 * Cart view component for CRT screen
 */
function CartViewContent({cart, onBack}) {
  return (
    <div className="crt-cart-view">
      <button 
        className="crt-back-to-products-btn"
        onClick={onBack}
      >
        ← Back to Products
      </button>
      <Suspense fallback={<div className="crt-cart-loading">Loading cart...</div>}>
        <Await resolve={cart}>
          {(cartData) => <CartView cart={cartData} onBackToProducts={onBack} />}
        </Await>
      </Suspense>
      </div>
  );
}

/**
 * Cart view with optimistic updates
 */
function CartView({cart: originalCart, onBackToProducts}) {
  const cart = useOptimisticCart(originalCart);
  return <CartMain cart={cart} layout="page" onBackToProducts={onBackToProducts} />;
}

/**
 * @param {{
 *   products: Array<any>;
 *   onProductClick: (e: Event, product: any) => void;
 *   onProductsLoaded: (products: Array<any>) => void;
 * }}
 */
function ProductGridWithState({products, onProductClick, onProductsLoaded}) {
  useEffect(() => {
    if (products.length > 0) {
      onProductsLoaded(products);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  return <ProductGrid products={products} onProductClick={onProductClick} />;
}

/**
 * @param {{
 *   products: Array<any>;
 *   onProductClick: (e: Event, product: any) => void;
 * }}
 */
function ProductGrid({products, onProductClick}) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <a
          key={product.id}
          href="#"
          onClick={(e) => onProductClick(e, product, product)}
          className="product-grid-item"
        >
          {product.featuredImage && (
            <div className="product-grid-image-wrapper">
              <Image
                data={product.featuredImage}
                aspectRatio="1/1"
                sizes="200px"
                className="product-grid-image"
              />
            </div>
          )}
          <div className="product-grid-name">{product.title}</div>
        </a>
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="product-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="product-grid-item skeleton">
          <div className="product-grid-image-wrapper" />
          <div className="product-grid-name skeleton-text" />
      </div>
        ))}
      </div>
  );
}

/**
 * @param {{
 *   product: any;
 *   selectedVariant: any;
 *   onSelectVariant: (variant: any) => void;
 *   onClose: () => void;
 *   onNext: () => void;
 *   onPrev: () => void;
 * }}
 */
function ProductModal({
  product,
  selectedVariant,
  onSelectVariant,
  onClose,
  onNext,
  onPrev,
}) {

  // Get variants from product
  const variants = (product && Array.isArray(product.variants?.nodes)) 
    ? product.variants.nodes 
    : [];
  const currentVariant = selectedVariant || (variants.length > 0 ? variants[0] : null);
  
  // Get size options - check both 'Size' and 'size' (case insensitive)
  const sizeOption = (product && Array.isArray(product.options))
    ? product.options.find(opt => opt?.name?.toLowerCase() === 'size')
    : null;
  const sizeOptions = (sizeOption && Array.isArray(sizeOption.values)) 
    ? sizeOption.values 
    : [];

  useEffect(() => {
    if (product && variants.length > 0 && !selectedVariant) {
      onSelectVariant(variants[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, variants.length, selectedVariant]);

  const handleSizeSelect = (sizeValue) => {
    const variant = variants.find(v => 
      v.selectedOptions?.some(opt => opt.name === 'Size' && opt.value === sizeValue)
    );
    if (variant) {
      onSelectVariant(variant);
    }
  };

  const price = currentVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount || '0';
  const currency = currentVariant?.price?.currencyCode || product.priceRange?.minVariantPrice?.currencyCode || 'USD';

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        {/* CRT Effects Overlay */}
        <div className="product-modal-crt-effects">
          <div className="product-modal-scanlines" />
          <div className="product-modal-refresh-line" />
          <div className="product-modal-glow" />
        </div>

        {/* Close button */}
        <button className="product-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* Navigation arrows */}
        <button 
          className="product-modal-arrow product-modal-arrow-left" 
          onClick={onPrev}
          aria-label="Previous product"
        >
          ‹
        </button>
        <button 
          className="product-modal-arrow product-modal-arrow-right" 
          onClick={onNext}
          aria-label="Next product"
        >
          ›
        </button>

        {/* Product Image */}
        <div className="product-modal-image-wrapper">
          <Image
            data={currentVariant?.image || product.featuredImage}
            aspectRatio="1/1"
            sizes="400px"
            className="product-modal-image"
          />
        </div>

        {/* Price */}
        <div className="product-modal-price">
          {`${parseFloat(price).toFixed(2)} ${currency}`}
        </div>

        {/* Product Name */}
        <div className="product-modal-name">
          {product.title}
        </div>

        {/* Size Options */}
        {sizeOptions.length > 0 && (
          <div className="product-modal-sizes">
            {sizeOptions.map((size) => {
              const isSelected = currentVariant?.selectedOptions?.some(
                opt => opt.name === 'Size' && opt.value === size.value
              );
              return (
                <button
                  key={size.value}
                  className={`product-modal-size-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSizeSelect(size.value)}
                >
                  {size.value}
                </button>
              );
            })}
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="product-modal-actions">
          <AddToCartWithClose
            currentVariant={currentVariant}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

const PRODUCTS_QUERY = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    id
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
    title
  }
  fragment ProductCard on Product {
    id
    title
    handle
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
    options {
      name
      values
    }
    variants(first: 100) {
      nodes {
        ...ProductVariant
      }
    }
  }
  query Products($country: CountryCode, $language: LanguageCode, $first: Int!)
    @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductCardFragment} ProductCardFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
