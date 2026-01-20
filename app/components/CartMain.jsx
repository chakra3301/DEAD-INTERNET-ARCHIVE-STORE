import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart, onBackToProducts}) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  // Handle null/undefined cart
  if (!cart) {
    return (
      <div className={className}>
        <CartEmpty hidden={false} layout={layout} onBackToProducts={onBackToProducts} />
      </div>
    );
  }

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} onBackToProducts={onBackToProducts} />
      <div className="cart-details">
        <div aria-labelledby="cart-lines">
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => {
              // Filter out lines with invalid product data
              if (!line?.merchandise?.product?.handle) {
                return null;
              }
              return <CartLineItem key={line.id} line={line} layout={layout} />;
            })}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 *   onBackToProducts?: () => void;
 * }}
 */
function CartEmpty({hidden = false, onBackToProducts}) {
  const {close} = useAside();
  
  const handleContinueShopping = () => {
    if (onBackToProducts) {
      onBackToProducts();
    } else {
      close();
    }
  };
  
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      {onBackToProducts ? (
        <button onClick={handleContinueShopping} className="crt-continue-shopping-btn">
          Continue shopping →
        </button>
      ) : (
        <Link to="/" onClick={handleContinueShopping} prefetch="viewport">
          Continue shopping →
        </Link>
      )}
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
