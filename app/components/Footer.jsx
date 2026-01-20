import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import {GlitchText} from '~/components/GlitchText';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-brand">
                <GlitchText text="Dead Internet Archive" as="span" variant="corrupt" />
                <p className="footer-tagline">Artifacts from the digital void</p>
              </div>
              <FooterMenu
                menu={footer?.menu}
                primaryDomainUrl={header?.shop?.primaryDomain?.url}
                publicStoreDomain={publicStoreDomain}
              />
              <div className="footer-bottom">
                <span className="footer-copyright">
                  © {new Date().getFullYear()} Dead Internet Archive
                </span>
                <span className="footer-coordinates">
                  Signal origin: Unknown
                </span>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */
function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  const menuToUse = menu || FALLBACK_FOOTER_MENU;

  return (
    <nav className="footer-menu" role="navigation">
      {menuToUse.items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain || '') ||
          item.url.includes(primaryDomainUrl || '')
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'dead-internet-footer',
  items: [
    {
      id: 'footer-clothing',
      title: 'Clothing',
      url: '/clothing',
    },
    {
      id: 'footer-archives',
      title: 'Archives',
      url: '/archives',
    },
    {
      id: 'footer-privacy',
      title: 'Privacy',
      url: '/policies/privacy-policy',
    },
    {
      id: 'footer-terms',
      title: 'Terms',
      url: '/policies/terms-of-service',
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? '500' : '300',
    color: isPending ? 'var(--color-ghost)' : 'var(--color-ghost)',
  };
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
