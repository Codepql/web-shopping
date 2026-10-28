import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowDown,
  ArrowRight,
  Armchair,
  ChevronDown,
  Gift,
  HeartHandshake,
  Leaf,
  Monitor,
  Moon,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import type { Product, Scene, Category } from "./data/products";
import { categories, productById, scenes } from "./data/products";
import {
  cartCount,
  cartReducer,
  defaultFilters,
  filterProducts,
  MAX_QUANTITY,
  readFilters,
  STORAGE_KEY,
  validCart,
  writeFilters,
} from "./lib/shop";
import type { Cart, Filters, Sort } from "./lib/shop";
import { ProductCard } from "./components/ProductCard";
import { ProductDetail } from "./components/ProductDetail";
import { CartDrawer } from "./components/CartDrawer";
import { Toast } from "./components/Toast";
import type { Notice } from "./components/Toast";

const sceneIcons = { all: Sparkles, focus: Monitor, slow: Moon, gift: Gift };

function loadCart(): Cart {
  try {
    return validCart(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    return [];
  }
}
function initialProduct() {
  return productById.get(
    new URLSearchParams(window.location.search).get("product") ?? "",
  );
}

export default function App() {
  const [filters, setFilters] = useState<Filters>(readFilters);
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [selected, setSelected] = useState<Product | undefined>(initialProduct);
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [storageError, setStorageError] = useState(false);
  const detailOpener = useRef<HTMLElement | null>(null);
  const cartOpener = useRef<HTMLElement | null>(null);
  const cartButton = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const products = filterProducts(filters);
  const count = cartCount(cart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [cart]);
  useEffect(() => {
    writeFilters(filters);
  }, [filters]);
  useEffect(() => {
    const sync = () => {
      setFilters(readFilters());
      setSelected(initialProduct());
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(
      () => setNotice(null),
      notice.action === "undo" ? 9000 : 4500,
    );
    return () => clearTimeout(timer);
  }, [notice]);

  const updateFilters = (updates: Partial<Filters>) =>
    setFilters((current) => ({ ...current, ...updates }));
  const scrollToCollection = () =>
    document.getElementById("collection")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  const chooseCategory = (category: Category) => {
    updateFilters({ category });
    scrollToCollection();
  };
  const chooseScene = (scene: Scene) => {
    setFilters({ ...defaultFilters, scene });
    scrollToCollection();
  };
  const reset = () => setFilters({ ...defaultFilters });
  const openProduct = (product: Product, opener: HTMLElement) => {
    detailOpener.current = opener;
    const url = new URL(window.location.href);
    url.searchParams.set("product", product.id);
    window.history.pushState(null, "", url);
    setSelected(product);
  };
  const closeProduct = useCallback(() => {
    setSelected(undefined);
    const url = new URL(window.location.href);
    url.searchParams.delete("product");
    window.history.replaceState(null, "", url);
  }, []);
  const openCart = () => {
    if (selected) closeProduct();
    cartOpener.current = cartButton.current;
    setCartOpen(true);
    setNotice(null);
  };
  const add = (id: string, quantity = 1) => {
    const current = cart.find((item) => item.id === id)?.quantity ?? 0;
    const added = Math.min(MAX_QUANTITY - current, quantity);
    if (added < 1) {
      setNotice({ message: `每款商品最多加入 ${MAX_QUANTITY} 件` });
      return;
    }
    dispatch({ type: "add", id, quantity: added });
    setNotice({
      message: `已加入 ${added} 件${productById.get(id)!.name}`,
      action: "cart",
    });
  };
  const remove = (id: string) => {
    const removed = cart.find((item) => item.id === id);
    dispatch({ type: "remove", id });
    setNotice({
      message: `已移除${productById.get(id)!.name}`,
      action: "undo",
      removed,
    });
  };
  const actOnNotice = () => {
    if (notice?.action === "cart") openCart();
    else if (notice?.removed) {
      dispatch({ type: "restore", ...notice.removed });
      setNotice(null);
    }
  };
  const hasFilters =
    filters.query !== "" ||
    filters.category !== "全部好物" ||
    filters.scene !== "all" ||
    filters.sort !== "featured";
  const notification = (
    <Toast
      notice={notice}
      onAction={actOnNotice}
      onClose={() => setNotice(null)}
    />
  );

  return (
    <>
      <a className="skip-link" href="#collection">
        跳转到商品列表
      </a>
      <div className="announcement">
        <Leaf size={13} aria-hidden="true" />
        <span>留一点空间，给日常的小美好</span>
        <span className="announcement-divider">·</span>
        <span>用心挑选，刚刚好的生活</span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href={import.meta.env.BASE_URL}
            aria-label="舒隅首页"
          >
            <Armchair size={32} strokeWidth={1.4} aria-hidden="true" />
            <span>
              <strong>
                舒隅<span className="brand-dot">.</span>
              </strong>
              <small>日常，自有好物</small>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="商品分类">
            {categories.map((category) => (
              <a
                className={filters.category === category ? "active" : ""}
                href={`?${category === "全部好物" ? "" : `category=${encodeURIComponent(category)}`}#collection`}
                key={category}
                onClick={(event) => {
                  if (
                    event.ctrlKey ||
                    event.metaKey ||
                    event.shiftKey ||
                    event.altKey
                  )
                    return;
                  event.preventDefault();
                  chooseCategory(category);
                }}
              >
                {category}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button header-search"
              aria-label="搜索商品"
              onClick={() => {
                scrollToCollection();
                searchRef.current?.focus({ preventScroll: true });
              }}
            >
              <Search size={21} strokeWidth={1.6} aria-hidden="true" />
            </button>
            <button
              className="cart-button"
              ref={cartButton}
              onClick={openCart}
              aria-label={`打开购物车，共${count}件商品`}
            >
              <ShoppingBag size={20} strokeWidth={1.6} aria-hidden="true" />
              <span>购物车</span>
              <span className="cart-count">{count}</span>
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span />
              为生活，留一处喜欢的角落
            </div>
            <h1 id="hero-title">
              日子很忙，
              <br />
              总有一隅<span className="hero-green">很慢。</span>
            </h1>
            <p>
              一盏暖灯，一杯热茶，一点恰好的舒适。
              <br className="desktop-break" />
              从桌面到家，发现让日常变好的小物。
            </p>
            <a className="primary-button hero-cta" href="#collection">
              发现日常好物
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <div className="hero-footnote">
              <span className="hero-line" />
              <span>好好生活，从这一角开始。</span>
            </div>
          </div>
          <div className="hero-image-wrap">
            <img
              className="hero-image"
              src={`${import.meta.env.BASE_URL}images/hero.webp`}
              width="1200"
              height="1000"
              alt="自然光下，绿植与木质家具构成安静舒适的居家角落"
              fetchPriority="high"
            />
            <div className="hero-image-shade" />
            <span className="hero-image-caption">属于你的，舒适一角</span>
            <div className="hero-caption-line" />
            <a
              className="hero-product"
              href="?product=warm-lamp#collection"
              onClick={(event) => {
                if (
                  event.ctrlKey ||
                  event.metaKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                openProduct(productById.get("warm-lamp")!, event.currentTarget);
              }}
            >
              <span className="hero-product-icon">
                <Sparkles size={18} aria-hidden="true" />
              </span>
              <span>
                <small>本期灵感好物</small>
                <strong>用一盏暖灯，慢下来</strong>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <span className="hero-stamp" aria-hidden="true">
              好物
              <br />
              <span>慢选</span>
            </span>
          </div>
        </section>
        <section
          className="scene-section page-width"
          aria-label="按生活场景选购"
        >
          <div className="scene-intro">
            <span className="eyebrow">跟着心情逛一逛</span>
            <h2>今天，想怎样生活？</h2>
          </div>
          <div className="scene-cards">
            {scenes.slice(1).map((scene) => {
              const Icon = sceneIcons[scene.id];
              return (
                <button
                  className={`scene-card scene-${scene.id} ${filters.scene === scene.id ? "selected" : ""}`}
                  key={scene.id}
                  onClick={() => chooseScene(scene.id)}
                  aria-pressed={filters.scene === scene.id}
                >
                  <span className="scene-icon">
                    <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{scene.label}</strong>
                    <small>{scene.description}</small>
                  </span>
                  <ArrowRight
                    className="scene-arrow"
                    size={17}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </section>
        <section
          className="collection page-width"
          id="collection"
          aria-labelledby="collection-title"
        >
          <div className="collection-heading">
            <div>
              <span className="eyebrow">经过挑选，值得喜欢</span>
              <h2 id="collection-title">
                日常好物，慢慢挑<span className="heading-dot">.</span>
              </h2>
            </div>
            <span className="collection-note">不必很多，喜欢就好。</span>
          </div>
          <div className="collection-tools">
            <div
              className="category-tabs"
              role="group"
              aria-label="筛选商品分类"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  aria-pressed={filters.category === category}
                  className={filters.category === category ? "active" : ""}
                  onClick={() => updateFilters({ category })}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="search-sort">
              <div className="search-field">
                <Search size={17} aria-hidden="true" />
                <label className="sr-only" htmlFor="product-search">
                  搜索商品
                </label>
                <input
                  id="product-search"
                  ref={searchRef}
                  type="search"
                  name="q"
                  autoComplete="off"
                  placeholder="搜索一件心仪好物…"
                  maxLength={100}
                  value={filters.query}
                  onChange={(event) =>
                    updateFilters({ query: event.target.value })
                  }
                />
                {filters.query && (
                  <button
                    className="clear-search"
                    aria-label="清空搜索"
                    onClick={() => {
                      updateFilters({ query: "" });
                      searchRef.current?.focus();
                    }}
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                )}
              </div>
              <div className="sort-select desktop-sort">
                <label className="sr-only" htmlFor="product-sort">
                  商品排序
                </label>
                <select
                  id="product-sort"
                  value={filters.sort}
                  onChange={(event) =>
                    updateFilters({ sort: event.target.value as Sort })
                  }
                >
                  <option value="featured">精选推荐</option>
                  <option value="price-asc">价格从低到高</option>
                  <option value="price-desc">价格从高到低</option>
                </select>
                <ChevronDown size={14} aria-hidden="true" />
              </div>
              <button
                className="mobile-filter-button"
                aria-label="打开筛选与排序"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal size={18} aria-hidden="true" />
                <span>筛选</span>
              </button>
            </div>
          </div>
          <div className="results-meta">
            <p role="status" aria-live="polite">
              共 <strong>{products.length}</strong> 件好物
              {filters.scene !== "all" && (
                <span>
                  {" "}
                  · {scenes.find((scene) => scene.id === filters.scene)!.label}
                </span>
              )}
              {filters.query && <span> · 搜索“{filters.query}”</span>}
            </p>
            {hasFilters && (
              <button className="reset-filters" onClick={reset}>
                清空条件
                <X size={13} aria-hidden="true" />
              </button>
            )}
          </div>
          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  quantity={
                    cart.find((item) => item.id === product.id)?.quantity ?? 0
                  }
                  onOpen={openProduct}
                  onAdd={add}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Search size={34} strokeWidth={1.2} aria-hidden="true" />
              <h3>还没找到这件好物</h3>
              <p>试试“台灯”“杯子”或减少筛选条件。</p>
              <button className="primary-button" onClick={reset}>
                查看全部好物
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          )}
          {products.length > 0 && (
            <div className="collection-end">
              <span />
              <span>好物不多，每一件都刚刚好</span>
              <span />
            </div>
          )}
        </section>
        <section className="brand-note">
          <div className="page-width brand-note-inner">
            <div className="brand-note-copy">
              <Leaf size={27} strokeWidth={1.25} aria-hidden="true" />
              <h2>
                生活的美好，
                <br />
                藏在你认真挑选的细节里。
              </h2>
              <p>
                我们相信，让人喜欢的家，从来不是一次完成的。
                <br />
                它是每一天，一点一点积攒的喜欢。
              </p>
            </div>
            <div className="brand-values">
              <div>
                <HeartHandshake
                  size={25}
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
                <span>
                  <strong>为日常而选</strong>
                  <small>关注好看，也关注好用</small>
                </span>
              </div>
              <div>
                <Armchair size={25} strokeWidth={1.4} aria-hidden="true" />
                <span>
                  <strong>为舒适留白</strong>
                  <small>简单一点，自在一点</small>
                </span>
              </div>
              <div>
                <Gift size={25} strokeWidth={1.4} aria-hidden="true" />
                <span>
                  <strong>为喜欢而买</strong>
                  <small>每一份心意，都有归处</small>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer page-width">
        <div>
          <a href={import.meta.env.BASE_URL} className="footer-brand">
            舒隅<span>.</span>
          </a>
          <p>给日常，留一处喜欢的角落。</p>
        </div>
        <div className="footer-meta">
          <span>商品与价格均为模拟数据 · 仅供选购体验演示</span>
          <span>当前使用人民币标价 · 暂不提供真实交易</span>
        </div>
        <a className="back-top" href="#hero-title">
          回到顶部
          <ArrowDown size={14} aria-hidden="true" />
        </a>
      </footer>
      {storageError && (
        <div className="storage-warning" role="alert">
          浏览器暂时无法保存购物车，刷新后可能丢失；当前页面仍可继续选购。
        </div>
      )}
      <ProductDetail
        product={selected}
        inCart={cart.find((item) => item.id === selected?.id)?.quantity ?? 0}
        onClose={closeProduct}
        onAdd={add}
        onCart={openCart}
        opener={detailOpener}
        notification={notification}
      />
      <CartDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onQuantity={(id, quantity) =>
          dispatch({ type: "quantity", id, quantity })
        }
        onRemove={remove}
        opener={cartOpener}
        notification={notification}
      />
      <Dialog.Root open={filterOpen} onOpenChange={setFilterOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="modal-overlay" />
          <Dialog.Content className="filter-dialog">
            <header>
              <Dialog.Title>筛选与排序</Dialog.Title>
              <Dialog.Close className="icon-button" aria-label="关闭筛选">
                <X size={21} aria-hidden="true" />
              </Dialog.Close>
            </header>
            <Dialog.Description>
              按场景与价格，找到心仪好物。
            </Dialog.Description>
            <fieldset>
              <legend>生活场景</legend>
              <div className="filter-options">
                {scenes.map((scene) => (
                  <button
                    key={scene.id}
                    aria-pressed={filters.scene === scene.id}
                    className={filters.scene === scene.id ? "active" : ""}
                    onClick={() => updateFilters({ scene: scene.id })}
                  >
                    {scene.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>商品排序</legend>
              <div className="filter-options">
                {(["featured", "price-asc", "price-desc"] as Sort[]).map(
                  (sort, index) => (
                    <button
                      key={sort}
                      aria-pressed={filters.sort === sort}
                      className={filters.sort === sort ? "active" : ""}
                      onClick={() => updateFilters({ sort })}
                    >
                      {["精选推荐", "价格从低到高", "价格从高到低"][index]}
                    </button>
                  ),
                )}
              </div>
            </fieldset>
            <Dialog.Close className="primary-button">
              查看 {products.length} 件好物
              <ArrowRight size={17} aria-hidden="true" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {!selected && !cartOpen && !filterOpen && notification}
    </>
  );
}
