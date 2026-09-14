import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerLayout } from './layouts/CustomerLayout';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/customer/SearchResultsPage';
import { CategoryPage } from './pages/customer/CategoryPage';
import { CategoriesIndexPage } from './pages/customer/CategoriesIndexPage';
import { ProductPage } from './pages/customer/ProductPage';
import { DealsPage } from './pages/customer/DealsPage';
import { BrandsIndexPage } from './pages/customer/BrandsIndexPage';
import { BrandDetailPage } from './pages/customer/BrandDetailPage';
import { BestOfPage } from './pages/customer/BestOfPage';

// ── Admin Module (isolated under /admin/*) ──────────────────────────────────
import { AdminLayout }          from './admin/layouts/AdminLayout';
import { AdminDashboardPage }   from './admin/pages/admin/AdminDashboardPage';
import { AdminProductsPage }    from './admin/pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './admin/pages/admin/AdminProductFormPage';
import { AdminImportsPage }     from './admin/pages/admin/AdminImportsPage';
import { CampaignListPage }       from './admin/pages/admin/campaigns/CampaignListPage';
import { CampaignEditorPage }     from './admin/pages/admin/campaigns/CampaignEditorPage';
import { CampaignReviewPage }     from './admin/pages/admin/campaigns/CampaignReviewPage';
import { AudienceListPage }       from './admin/pages/admin/audience/AudienceListPage';
import { AdminUsersPage }       from './admin/pages/admin/AdminUsersPage';
import { LoginPage }            from './admin/pages/LoginPage';
import { ProductProvider }      from './admin/lib/ProductContext';
// ────────────────────────────────────────────────────────────────────────────

// Placeholder generic page
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="container">
      <h1 style={{ marginTop: 'var(--space-8)' }}>{title}</h1>
      <p>Placeholder content for {title}.</p>
    </div>
  );
}

// Initialize theme on load to prevent flash of unstyled content
const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};
document.documentElement.setAttribute('data-theme', getInitialTheme());

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Customer Routes (Primary Application) ── */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="categories" element={<CategoriesIndexPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="best-of" element={<BestOfPage />} />
          <Route path="deals" element={<DealsPage />} />
          <Route path="brands" element={<BrandsIndexPage />} />
          <Route path="brand/:slug" element={<BrandDetailPage />} />
          <Route path="blog" element={<PlaceholderPage title="Blog" />} />
        </Route>

        {/* ── Standalone Auth ── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── Admin Module (Add-on, isolated) ── */}
        <Route path="/admin" element={
          <ProductProvider>
            <AdminLayout />
          </ProductProvider>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductFormPage />} />
          <Route path="products/:id/edit" element={<AdminProductFormPage />} />
          <Route path="imports" element={<AdminImportsPage />} />
          <Route path="campaigns" element={<CampaignListPage />} />
          <Route path="campaigns/new" element={<CampaignEditorPage />} />
          <Route path="campaigns/:id/edit" element={<CampaignEditorPage />} />
          <Route path="campaigns/:id/review" element={<CampaignReviewPage />} />
          <Route path="audience" element={<AudienceListPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

