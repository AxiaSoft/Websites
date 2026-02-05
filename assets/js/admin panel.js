// ═══════════════════════════════════════════════════════════════
// ADMIN PANEL (GPT‑5 FINAL, WITH PER‑PRODUCT REVIEWS MANAGEMENT
// + NEW SUPPORT MESSENGER, URGENT TICKETS & QUICK REPLIES)
// File: assets/js/admin panel.js
// ═══════════════════════════════════════════════════════════════

/* ========== Global state bootstrapping ========== */

state.reviews = Array.isArray(state.reviews) ? state.reviews : [];
state.adminReviewsSelectedProductId = state.adminReviewsSelectedProductId || null;
state.adminReviewsListOpen = typeof state.adminReviewsListOpen === 'boolean' ? state.adminReviewsListOpen : true;

// Support filters + selection + quick replies
state.supportFilter = state.supportFilter || { status: '', priority: '', view: 'all' };
state.adminSupportSelectedTicketId = state.adminSupportSelectedTicketId || null;
state.supportQuickReplies = Array.isArray(state.supportQuickReplies)
  ? state.supportQuickReplies
  : [
      { id: 'qr1', label: 'تشکر از تماس', text: 'سلام، ممنون از پیام شما. درخواست شما در حال بررسی است.' },
      { id: 'qr2', label: 'اطلاع از پیگیری', text: 'درخواست شما ثبت شد و به زودی نتیجه را اطلاع می‌دهیم.' }
    ];

state.orderFilter = state.orderFilter || { status: '' };
state.adminTab = state.adminTab || 'dashboard';

state.categoryModal = state.categoryModal || null;

/* ========== Root admin panel renderer ========== */

function renderAdminPanel() {
  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'داشبورد' },
    { id: 'products', icon: '📦', label: 'محصولات' },
    { id: 'orders', icon: '🛒', label: 'سفارشات' },
    { id: 'categories', icon: '🗂️', label: 'دسته‌بندی‌ها' },
    { id: 'reviews', icon: '📝', label: 'نظرات' },
    { id: 'support', icon: '💬', label: 'پشتیبانی' }
  ];

  const pendingReviewsCount = (state.reviews || []).filter(r => r.status === 'pending').length;

  return `
    <div class="flex flex-col lg:flex-row min-h-screen">
      <!-- Sidebar -->
      <aside class="hidden lg:flex w-72 glass-dark border-l border-white/5 flex-col fixed right-0 top-0 h-screen overflow-y-auto">
        <div class="p-6 border-b border-white/5">
          <div class="flex items-center gap-3">
            <span class="text-3xl">⚙️</span>
            <div>
              <h1 class="font-black text-lg">پنل مدیریت</h1>
              <p class="text-xs text-white/60">مدیریت فروشگاه</p>
            </div>
          </div>
        </div>
        <nav class="flex-1 p-4">
          ${tabs
            .map(
              tab => `
            <button 
              onclick="state.adminTab='${tab.id}'; render()"
              class="sidebar-item w-full text-right px-5 py-4 flex items-center justify-between text-sm ${
                state.adminTab === tab.id ? 'active' : ''
              }" type="button"
            >
              <div class="flex items-center gap-3">
                <span class="relative text-xl">
                  ${tab.icon}
                  ${
                    tab.id === 'reviews' && pendingReviewsCount > 0
                      ? `<span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          ${pendingReviewsCount}
                         </span>`
                      : ''
                  }
                </span>
                <span class="font-medium">${tab.label}</span>
              </div>
            </button>
          `
            )
            .join('')}
        </nav>
        <div class="p-4 border-t border-white/5 space-y-2">
          <button onclick="goTo('home')" class="w-full btn-ghost py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium" type="button">🏠 مشاهده سایت</button>
          <button onclick="logout()" class="w-full bg-rose-500/10 text-rose-400 py-3 rounded-xl hover:bg-rose-500/20 flex items-center justify-center gap-2 text-sm font-medium transition-all" type="button">🚪 خروج</button>
        </div>
      </aside>

      <!-- Mobile Header -->
      <header class="lg:hidden glass-dark border-b border-white/5 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl">⚙️</span>
            <h1 class="font-bold">پنل مدیریت</h1>
          </div>
          <div class="flex gap-2">
            <button onclick="goTo('home')" class="p-2 glass rounded-xl text-sm" type="button">🏠</button>
            <button onclick="logout()" class="p-2 glass rounded-xl text-rose-400 text-sm" type="button">🚪</button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-4 lg:p-8 overflow-auto overflow-x-hidden pb-24 lg:pb-8 lg:mr-72 mr-0">
        ${state.adminTab === 'dashboard' ? renderAdminDashboard() : ''}
        ${state.adminTab === 'products' ? renderAdminProductsEditor() : ''}
        ${state.adminTab === 'orders' ? renderAdminOrdersSafe() : ''}
        ${state.adminTab === 'categories' ? renderAdminCategoriesEditor() : ''}
        ${state.adminTab === 'reviews' ? renderAdminReviews() : ''}
        ${state.adminTab === 'support' ? renderAdminSupportSafe() : ''}
      </main>

      <!-- Mobile Navigation -->
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 glass-dark border-t border-white/5 px-4 py-3 z-50 safe-bottom">
        <div class="flex justify-around">
          ${tabs
            .map(
              tab => `
            <button 
              onclick="state.adminTab='${tab.id}'; render()"
              class="flex flex-col items-center py-2 px-5 rounded-xl transition-all ${
                state.adminTab === tab.id ? 'bg-violet-500/20 text-violet-400' : 'text-white/60'
              }" type="button"
            >
              <span class="relative text-xl mb-0.5">
                ${tab.icon}
                ${
                  tab.id === 'reviews' && pendingReviewsCount > 0
                    ? `<span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] px-1 py-0.5 rounded-full">
                        ${pendingReviewsCount}
                       </span>`
                    : ''
                }
              </span>
              <span class="text-[10px] font-medium">${tab.label}</span>
            </button>
          `
            )
            .join('')}
        </div>
      </nav>

      ${renderCategoryModal()}
    </div>
  `;
}

/* ========== Helper wrapper to align legacy select to new API ========== */

function updateOrderStatus(order, nextStatus) {
  if (!order || !order.id) return;
  updateOrder(order.id, { status: nextStatus });
}

/* ========== Categories: modal-based CRUD + product assignment ========== */

function openCategoryModal(mode, id = null) {
  if (mode === 'add') {
    state.categoryModal = {
      mode: 'add',
      id: null,
      title: '',
      selectedProducts: []
    };
  } else {
    const cat = (state.categories || []).find(c => c.id === id);
    if (!cat) return;

    const selectedProducts = (state.products || []).filter(p => p.category === id).map(p => p.id);

    state.categoryModal = {
      mode: 'edit',
      id,
      title: cat.title,
      selectedProducts
    };
  }
  render();
}

function closeCategoryModal() {
  state.categoryModal = null;
  render();
}

function saveCategoryModal() {
  const m = state.categoryModal;
  if (!m) return;

  const title = (m.title || '').trim();
  if (!title) {
    toast('نام دسته‌بندی الزامی است', 'warning');
    return;
  }

  if (m.mode === 'add') {
    const id = utils.generateId();
    state.categories.push({ id, title });

    (state.products || []).forEach(p => {
      if (m.selectedProducts.includes(p.id)) {
        p.category = id;
      }
    });

    toast('دسته‌بندی اضافه شد', 'success');
  } else {
    const cat = (state.categories || []).find(c => c.id === m.id);
    if (!cat) return;

    cat.title = title;

    (state.products || []).forEach(p => {
      if (p.category === m.id) p.category = '';
    });

    (state.products || []).forEach(p => {
      if (m.selectedProducts.includes(p.id)) {
        p.category = m.id;
      }
    });

    toast('دسته‌بندی بروزرسانی شد', 'success');
  }

  closeCategoryModal();
}

function deleteCategoryWithConfirm(id) {
  const cat = (state.categories || []).find(c => c.id === id);
  if (!cat) return;

  state.categoryModal = null;

  state.confirmModal = {
    type: 'delete-category',
    title: 'حذف دسته',
    message: `آیا از حذف «${cat.title}» مطمئن هستید؟`,
    icon: '🗑️',
    confirmText: 'حذف',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      state.categories = (state.categories || []).filter(c => c.id !== id);
      (state.products || []).forEach(p => {
        if (p.category === id) p.category = '';
      });
      state.confirmModal = null;
      render();
    }
  };
  render();
}

function renderCategoryModal() {
  const m = state.categoryModal;
  if (!m) return '';

  const uncategorized = (state.products || []).filter(p => !p.category || p.category === m.id);

  return `
    <div class="fixed inset-0 z-[200] flex items-center justify-center p-4 modal-overlay">
      <div class="glass-strong rounded-3xl p-6 lg:p-8 max-w-lg w-full max-h-[90%] overflow-y-auto animate-scale">

        <h2 class="text-xl font-black mb-6">
          ${m.mode === 'add' ? '➕ دسته‌بندی جدید' : '✏️ ویرایش دسته‌بندی'}
        </h2>

        <div class="space-y-5">

          <div>
            <label class="block text-sm text-white/70 mb-2">نام دسته *</label>
            <input 
              type="text"
              class="w-full input-style"
              value="${m.title}"
              oninput="state.categoryModal.title=this.value"
              placeholder="نام دسته را وارد کنید"
            >
          </div>

          <div>
            <label class="block text-sm text-white/70 mb-2">محصولات بدون دسته</label>
            <div class="flex gap-3 overflow-x-auto pb-2">
              ${
                uncategorized.length === 0
                  ? `<p class="text-white/40 text-sm">محصول بدون دسته وجود ندارد</p>`
                  : uncategorized
                      .map(
                        p => `
                    <label class="glass rounded-xl p-3 flex-shrink-0 w-40 cursor-pointer hover:bg-white/10 transition">
                      <div class="w-full h-24 bg-white/5 rounded-lg overflow-hidden mb-2">
                        ${
                          p.image || p.main_image
                            ? `<img src="${p.image || p.main_image}" class="w-full h-full object-cover">`
                            : `<div class="w-full h-full flex items-center justify-center text-3xl">📦</div>`
                        }
                      </div>

                      <div class="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          class="w-4 h-4"
                          ${m.selectedProducts.includes(p.id) ? 'checked' : ''}
                          onchange="
                            if(this.checked){
                              if(!state.categoryModal.selectedProducts.includes('${p.id}')){
                                state.categoryModal.selectedProducts.push('${p.id}');
                              }
                            } else {
                              state.categoryModal.selectedProducts = state.categoryModal.selectedProducts.filter(x => x !== '${p.id}');
                            }
                            render();
                          "
                        >
                        <span class="text-xs line-clamp-2">${p.title}</span>
                      </div>
                    </label>
                  `
                      )
                      .join('')
              }
            </div>
          </div>

        </div>

        <div class="flex gap-4 mt-8">
          ${
            m.mode === 'edit'
              ? `<button 
                  type="button" 
                  onclick="deleteCategoryWithConfirm('${m.id}')"
                  class="flex-1 btn-danger py-4 rounded-xl font-semibold"
                >
                  حذف دسته
                </button>`
              : ''
          }

          <button 
            type="button" 
            onclick="closeCategoryModal()"
            class="flex-1 btn-ghost py-4 rounded-xl font-semibold"
          >
            انصراف
          </button>

          <button 
            type="button" 
            onclick="saveCategoryModal()"
            class="flex-1 btn-primary py-4 rounded-xl font-semibold"
          >
            ثبت
          </button>
        </div>

      </div>
    </div>
  `;
}

function renderAdminCategoriesEditor() {
  return `
    <div class="animate-fade">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl lg:text-3xl font-black">مدیریت دسته‌بندی‌ها (${(state.categories || []).length})</h1>
        <button class="btn-primary px-5 py-3 rounded-xl font-semibold text-sm" type="button" onclick="openCategoryModal('add')">
          افزودن دسته
        </button>
      </div>

      <div class="grid gap-3">
        ${(state.categories || [])
          .map(
            (c, i) => `
          <div class="glass rounded-xl p-4 flex items-center justify-between animate-fade" style="animation-delay:${i *
            0.05}s">
            <div>
              <div class="font-semibold">${c.title}</div>
              <div class="text-xs text-white/40">${c.id}</div>
            </div>
            <div class="flex gap-2">
              <button class="p-2 glass rounded-xl" type="button" onclick="openCategoryModal('edit', '${c.id}')">✏️</button>
              <button class="p-2 glass rounded-xl text-rose-400 hover:bg-rose-500/20" type="button" onclick="deleteCategoryWithConfirm('${c.id}')">🗑️</button>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

/* ========== Orders: safe render (handles items array or JSON string) ========== */

function renderAdminOrdersSafe() {
  let filteredOrders = Array.isArray(state.orders) ? [...state.orders] : [];
  if (state.orderFilter.status) {
    filteredOrders = filteredOrders.filter(o => o.status === state.orderFilter.status);
  }

  return `
    <div class="animate-fade">
      <h1 class="text-2xl lg:text-3xl font-black mb-8">سفارشات (${filteredOrders.length})</h1>

      <div class="glass rounded-2xl p-5 mb-6">
        <div class="flex flex-wrap gap-2">
          <button onclick="state.orderFilter.status = ''; render()" class="px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            !state.orderFilter.status ? 'bg-violet-500 text-white' : 'glass hover:bg-white/10'
          }">همه</button>
          ${
            [
              { value: 'pending', label: '⏳ در انتظار', color: 'bg-amber-500' },
              { value: 'processing', label: '⚙️ پردازش', color: 'bg-blue-500' },
              { value: 'shipped', label: '🚚 ارسال شده', color: 'bg-cyan-500' },
              { value: 'delivered', label: '✅ تحویل', color: 'bg-emerald-500' }
            ]
              .map(
                opt => `
              <button onclick="state.orderFilter.status = '${opt.value}'; render()" class="px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  state.orderFilter.status === opt.value ? opt.color + ' text-white' : 'glass hover:bg-white/10'
                }">${opt.label}</button>
            `
              )
              .join('')
          }
        </div>
      </div>

      ${
        filteredOrders.length > 0
          ? `
          <div class="space-y-4">
            ${filteredOrders
              .map(order => {
                let items = [];
                if (Array.isArray(order.items)) {
                  items = order.items;
                } else {
                  try {
                    items = JSON.parse(order.items || '[]');
                  } catch {
                    items = [];
                  }
                }

                return `
                <div class="glass rounded-2xl p-6 animate-fade">
                  <div class="flex flex-wrap items-center justify-between gap-4 mb-5">
                    <div>
                      <span class="font-mono font-bold">#${(order.id || '').slice(-8)}</span>
                      <p class="text-xs text-white/60 mt-1">${utils.formatDateTime(order.created_at || order.createdAt || '')}</p>
                    </div>
                    <div>
                      <label for="status-${order.id}" class="sr-only">وضعیت سفارش</label>
                      <select 
                        id="status-${order.id}"
                        onchange="updateOrder('${order.id}', { status: this.value })"
                        class="bg-white/10 border border-white/20 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-violet-500"
                      >
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>⏳ در انتظار</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>⚙️ پردازش</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>🚚 ارسال شده</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>✅ تحویل</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="grid md:grid-cols-3 gap-4">
                    <div class="glass rounded-xl p-4">
                      <p class="text-xs text-white/60 mb-2">مشتری</p>
                      <p class="font-semibold">${order.user_name || 'بدون نام'}</p>
                      <p class="text-sm font-mono text-white/70">${order.user_phone || order.userPhone || ''}</p>
                    </div>
                    
                    <div class="glass rounded-xl p-4 hidden md:block">
                      <p class="text-xs text-white/60 mb-2">آدرس</p>
                      <p class="text-sm line-clamp-2">${order.address || '-'}</p>
                    </div>
                    
                    <div class="glass rounded-xl p-4">
                      <p class="text-xs text-white/60 mb-2">مبلغ کل</p>
                      <p class="text-xl font-black text-emerald-400">${utils.formatPrice(
                        order.total || (order.subtotal || 0) + (order.shipping || 0)
                      )}</p>
                      <p class="text-xs text-white/60">${items.length} کالا</p>
                    </div>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        `
          : `
          <div class="glass rounded-3xl p-16 text-center">
            <div class="text-7xl mb-6">🛒</div>
            <h3 class="text-2xl font-bold">سفارشی یافت نشد</h3>
          </div>
        `
      }
    </div>
  `;
}

/* ========== Reviews: per-product management + collapsible drawer ========== */

function getProductById(id) {
  return (state.products || []).find(p => p.id === id) || null;
}

function getProductReviews(productId) {
  return (state.reviews || []).filter(r => r.product_id === productId || r.productId === productId);
}

function setReviewStatus(reviewId, status) {
  const r = (state.reviews || []).find(x => x.id === reviewId);
  if (!r) return;
  r.status = status;
  if (window.AppState) AppState.set({ reviews: state.reviews });
  render();
}

function deleteReview(reviewId) {
  state.reviews = (state.reviews || []).filter(r => r.id !== reviewId);
  if (window.AppState) AppState.set({ reviews: state.reviews });
  render();
}

function toggleReviewsListOpen() {
  state.adminReviewsListOpen = !state.adminReviewsListOpen;
  render();
}

function renderAdminReviews() {
  const products = Array.isArray(state.products) ? state.products : [];
  const reviews = Array.isArray(state.reviews) ? state.reviews : [];

  // فقط محصولاتی که نظر دارند
  const productIdsWithReviews = [...new Set(reviews.map(r => r.product_id || r.productId))];
  const productsWithReviews = products.filter(p => productIdsWithReviews.includes(p.id));

  if (!state.adminReviewsSelectedProductId && productsWithReviews.length > 0) {
    state.adminReviewsSelectedProductId = productsWithReviews[0].id;
  }

  const activeProduct =
    productsWithReviews.find(p => p.id === state.adminReviewsSelectedProductId) || productsWithReviews[0] || null;

  const activeReviews = activeProduct ? getProductReviews(activeProduct.id) : [];

  const pendingCount = activeReviews.filter(r => r.status === 'pending').length;

  const drawerIcon = state.adminReviewsListOpen ? '▼' : '▲';

  return `
    <div class="animate-fade">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl lg:text-3xl font-black flex items-center gap-2">
          <span>نظرات کاربران</span>
          ${
            pendingCount > 0
              ? `<span class="badge bg-rose-500/20 text-rose-300 text-xs px-2 py-1 rounded-xl">در انتظار: ${pendingCount}</span>`
              : ''
          }
        </h1>

        <!-- کشوی لیست محصولات: فلش مثلثی -->
        <button 
          type="button"
          class="lg:hidden flex items-center gap-2 text-xs glass px-3 py-1.5 rounded-xl"
          onclick="toggleReviewsListOpen()"
        >
          <span>${drawerIcon}</span>
          <span>لیست محصولات دارای نظر</span>
        </button>
      </div>

      <div class="glass rounded-2xl p-3 lg:p-4 flex flex-col lg:flex-row gap-4 min-h-[380px]">

        <!-- Product list drawer -->
        <div class="${
          state.adminReviewsListOpen ? 'block' : 'hidden lg:block'
        } w-full lg:w-72 lg:max-w-xs flex-shrink-0">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-sm font-semibold text-white/80">محصولات دارای نظر</h2>
            <span class="text-[11px] text-white/50">${productsWithReviews.length} محصول</span>
          </div>
          <div class="max-h-[260px] lg:max-h-[70vh] overflow-y-auto flex flex-col gap-2 pr-1">
            ${
              productsWithReviews.length === 0
                ? `<div class="text-xs text-white/60 px-2 py-3">هنوز نظری ثبت نشده است.</div>`
                : productsWithReviews
                    .map(p => {
                      const count = getProductReviews(p.id).length;
                      const isActive = activeProduct && activeProduct.id === p.id;
                      const imgSrc = p.image || p.main_image || '';
                      return `
                        <button
                          type="button"
                          onclick="state.adminReviewsSelectedProductId='${p.id}'; render()"
                          class="w-full text-right glass rounded-xl px-3 py-2 flex items-center gap-3 text-xs ${
                            isActive ? 'border border-violet-500/60 bg-violet-500/10' : ''
                          }"
                        >
                          <div class="w-9 h-9 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center flex-shrink-0">
                            ${
                              imgSrc
                                ? `<img src="${imgSrc}" class="w-full h-full object-cover">`
                                : `<span class="text-lg">📦</span>`
                            }
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="font-semibold line-clamp-1">${p.title}</div>
                            <div class="text-[10px] text-white/50">${count} نظر</div>
                          </div>
                        </button>
                      `;
                    })
                    .join('')
            }
          </div>
        </div>

        <!-- Reviews list + actions -->
        <div class="flex-1 min-w-0 glass rounded-2xl p-3 lg:p-4">
          ${
            !activeProduct
              ? `<div class="h-full flex items-center justify-center text-sm text-white/60">محصولی با نظر یافت نشد.</div>`
              : `
            <div class="flex items-center justify-between mb-3">
              <div>
                <h2 class="font-bold text-sm lg:text-base line-clamp-1">${activeProduct.title}</h2>
                <p class="text-[11px] text-white/50 mt-0.5">
                  ${
                    (state.categories || []).find(c => c.id === activeProduct.category)?.title ||
                    'بدون دسته‌بندی'
                  }
                </p>
              </div>
              <div class="text-[11px] text-white/50">
                مجموع نظرات: ${activeReviews.length}
              </div>
            </div>

            <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              ${
                activeReviews.length === 0
                  ? `<div class="text-xs text-white/60 px-2 py-3">برای این محصول نظری ثبت نشده است.</div>`
                  : activeReviews
                      .map(r => {
                        const status = r.status || 'pending';
                        const rating = Number(r.rating || 0);
                        const stars =
                          rating > 0
                            ? '⭐'.repeat(Math.min(5, rating))
                            : 'بدون امتیاز';
                        const created = utils.formatDateTime(r.created_at || r.createdAt || '');
                        const name = r.user_name || r.userName || 'کاربر';
                        const phone = r.user_phone || r.userPhone || '';
                        const statusLabel =
                          status === 'approved'
                            ? 'تایید شده'
                            : status === 'rejected'
                            ? 'رد شده'
                            : 'در انتظار';
                        const statusClass =
                          status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : status === 'rejected'
                            ? 'bg-rose-500/15 text-rose-300'
                            : 'bg-amber-500/15 text-amber-300';

                        return `
                          <div class="glass rounded-xl p-3 text-xs flex flex-col gap-2">
                            <div class="flex items-center justify-between gap-2">
                              <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[11px]">
                                  ${name.trim()[0] || 'ک'}
                                </div>
                                <div>
                                  <div class="font-semibold">${name}</div>
                                  <div class="text-[10px] text-white/50">${phone}</div>
                                </div>
                              </div>
                              <div class="text-right">
                                <div class="text-[10px] text-white/50 mb-1">${created}</div>
                                <div class="flex items-center gap-1 justify-end">
                                  <span class="text-[11px]">${stars}</span>
                                  <span class="px-2 py-0.5 rounded-xl text-[10px] ${statusClass}">
                                    ${statusLabel}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div class="text-[11px] text-white/80 whitespace-pre-line border-t border-white/5 pt-2 mt-1">
                              ${r.text || r.comment || ''}
                            </div>

                            <div class="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                class="btn-ghost px-3 py-1 rounded-lg text-[11px]"
                                onclick="setReviewStatus('${r.id}', 'approved')"
                              >
                                تایید
                              </button>
                              <button
                                type="button"
                                class="btn-ghost px-3 py-1 rounded-lg text-[11px]"
                                onclick="setReviewStatus('${r.id}', 'rejected')"
                              >
                                رد
                              </button>
                              <button
                                type="button"
                                class="btn-ghost px-3 py-1 rounded-lg text-[11px] text-rose-300"
                                onclick="deleteReview('${r.id}')"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        `;
                      })
                      .join('')
              }
            </div>
          `
          }
        </div>
      </div>
    </div>
  `;
}

/* ========== Support: messenger-style, responsive, urgent + quick replies ========== */

function getTicketMessages(t) {
  if (!t) return [];
  if (Array.isArray(t.messages)) return t.messages;
  try {
    const parsed = JSON.parse(t.messages || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setTicketMessages(t, msgs) {
  t.messages = Array.isArray(msgs) ? msgs : [];
}

function addTicketMessage(ticket, payload) {
  if (!ticket) return Promise.resolve(false);
  const text = String(payload.text || '').trim();
  if (!text) return Promise.resolve(false);

  const msgs = getTicketMessages(ticket);
  msgs.push({
    from: payload.from || 'admin',
    text,
    at: new Date().toISOString()
  });
  setTicketMessages(ticket, msgs);

  if (window.AppState) AppState.set({ tickets: state.tickets });

  render();
  return Promise.resolve(true);
}

function updateTicketStatus(ticket, status) {
  if (!ticket) return;
  ticket.status = status;
  if (window.AppState) AppState.set({ tickets: state.tickets });
  render();
}

function closeTicket(ticket) {
  if (!ticket) return;
  ticket.status = 'closed';
  if (window.AppState) AppState.set({ tickets: state.tickets });
  render();
}

/* Quick replies CRUD */

function addQuickReply(label, text) {
  const lbl = String(label || '').trim();
  const txt = String(text || '').trim();
  if (!lbl || !txt) {
    toast('عنوان و متن پاسخ آماده الزامی است', 'warning');
    return;
  }
  const id = (utils && utils.uid ? utils.uid() : 'qr_' + Date.now());
  state.supportQuickReplies.push({ id, label: lbl, text: txt });
  if (window.AppState) AppState.set({ supportQuickReplies: state.supportQuickReplies });
  toast('پاسخ آماده اضافه شد', 'success');
  render();
}

function deleteQuickReply(id) {
  state.supportQuickReplies = (state.supportQuickReplies || []).filter(q => q.id !== id);
  if (window.AppState) AppState.set({ supportQuickReplies: state.supportQuickReplies });
  toast('پاسخ آماده حذف شد', 'success');
  render();
}

function renderAdminSupportQuickReplies() {
  const list = Array.isArray(state.supportQuickReplies) ? state.supportQuickReplies : [];

  return `
    <div class="glass rounded-2xl p-4 lg:p-6 animate-fade">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg lg:text-xl font-bold flex items-center gap-2">
          <span>⚡</span><span>مدیریت پاسخ‌های آماده</span>
        </h2>
      </div>

      <form class="grid gap-3 mb-5" onsubmit="event.preventDefault(); addQuickReply(this.label.value, this.text.value); this.reset();">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div class="lg:col-span-1">
            <label class="block text-xs text-white/60 mb-1">عنوان پاسخ *</label>
            <input name="label" class="input-style w-full" placeholder="مثال: تشکر از تماس" required>
          </div>
          <div class="lg:col-span-2">
            <label class="block text-xs text-white/60 mb-1">متن پاسخ *</label>
            <textarea name="text" class="input-style w-full resize-none" rows="2" placeholder="متن کامل پاسخ آماده..." required></textarea>
          </div>
        </div>
        <div class="flex justify-end">
          <button class="btn-primary px-4 py-2 rounded-xl text-sm font-semibold" type="submit">افزودن پاسخ آماده</button>
        </div>
      </form>

      <div class="space-y-2 max-h-[55vh] overflow-y-auto">
        ${
          list.length === 0
            ? `<div class="text-sm text-white/60">پاسخ آماده‌ای ثبت نشده است.</div>`
            : list
                .map(
                  q => `
              <div class="glass rounded-xl p-3 flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-sm mb-1">${q.label}</div>
                  <div class="text-xs text-white/70 whitespace-pre-line">${q.text}</div>
                </div>
                <button type="button" class="btn-ghost text-rose-400 text-xs px-3 py-1 rounded-lg" onclick="deleteQuickReply('${q.id}')">حذف</button>
              </div>
            `
                )
                .join('')
        }
      </div>
    </div>
  `;
}

function handleSupportSendMessage(form, ticketId) {
  event.preventDefault();
  const text = (form.message.value || '').trim();
  if (!text) return;
  const ticket = (state.tickets || []).find(t => t.id === ticketId);
  if (!ticket) return;
  addTicketMessage(ticket, { from: 'admin', text }).then(ok => {
    if (ok) form.reset();
  });
}

function applyQuickReplyToTicket(ticketId, replyId) {
  const ticket = (state.tickets || []).find(t => t.id === ticketId);
  if (!ticket) return;
  const reply = (state.supportQuickReplies || []).find(q => q.id === replyId);
  if (!reply) return;
  addTicketMessage(ticket, { from: 'admin', text: reply.text });
}

/* Main support renderer (with scrollable ticket list + chat) */

function renderAdminSupportSafe() {
  const allTickets = Array.isArray(state.tickets) ? state.tickets : [];

  // Filters
  let filtered = allTickets;
  if (state.supportFilter.status) {
    filtered = filtered.filter(t => t.status === state.supportFilter.status);
  }
  if (state.supportFilter.priority) {
    filtered = filtered.filter(t => (t.priority || 'normal') === state.supportFilter.priority);
  }
  if (state.supportFilter.view === 'urgent') {
    filtered = filtered.filter(t => (t.priority || 'normal') === 'urgent');
  }

  // Sort: urgent first, then newest
  filtered = [...filtered].sort((a, b) => {
    const pa = a.priority === 'urgent' ? 1 : 0;
    const pb = b.priority === 'urgent' ? 1 : 0;
    if (pa !== pb) return pb - pa;
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  // Selected ticket
  if (!state.adminSupportSelectedTicketId && filtered.length > 0) {
    state.adminSupportSelectedTicketId = filtered[0].id;
  }
  const activeTicket = filtered.find(t => t.id === state.adminSupportSelectedTicketId) || filtered[0] || null;
  const activeMessages = activeTicket ? getTicketMessages(activeTicket) : [];

  const statusButtons = [
    { value: '', label: 'همه' },
    { value: 'open', label: 'باز' },
    { value: 'closed', label: 'بسته' }
  ];

  const priorityButtons = [
    { value: '', label: 'همه' },
    { value: 'urgent', label: 'فوری' },
    { value: 'normal', label: 'عادی' }
  ];

  return `
    <div class="animate-fade">
      <h1 class="text-2xl lg:text-3xl font-black mb-4">پشتیبانی و تیکت‌ها 💬</h1>

      <!-- Filters -->
      <div class="glass rounded-2xl p-4 mb-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div class="flex flex-wrap gap-2">
          <span class="text-xs text-white/60">وضعیت:</span>
          ${statusButtons
            .map(
              b => `
            <button
              type="button"
              onclick="state.supportFilter.status='${b.value}'; render()"
              class="px-3 py-1.5 rounded-xl text-xs ${
                state.supportFilter.status === b.value ? 'bg-violet-500 text-white' : 'glass'
              }"
            >
              ${b.label}
            </button>
          `
            )
            .join('')}
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="text-xs text-white/60">اولویت:</span>
          ${priorityButtons
            .map(
              b => `
            <button
              type="button"
              onclick="state.supportFilter.priority='${b.value}'; render()"
              class="px-3 py-1.5 rounded-xl text-xs ${
                state.supportFilter.priority === b.value ? 'bg-amber-500 text-white' : 'glass'
              }"
            >
              ${b.label}
            </button>
          `
            )
            .join('')}
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            onclick="state.supportFilter.view='all'; render()"
            class="px-3 py-1.5 rounded-xl text-xs ${
              state.supportFilter.view === 'all' ? 'bg-emerald-500 text-white' : 'glass'
            }"
          >
            همه تیکت‌ها
          </button>
          <button
            type="button"
            onclick="state.supportFilter.view='urgent'; render()"
            class="px-3 py-1.5 rounded-xl text-xs ${
              state.supportFilter.view === 'urgent' ? 'bg-rose-500 text-white' : 'glass'
            }"
          >
            تیکت‌های فوری
          </button>
          <button
            type="button"
            onclick="state.supportFilter.view='quick'; render()"
            class="px-3 py-1.5 rounded-xl text-xs ${
              state.supportFilter.view === 'quick' ? 'bg-blue-500 text-white' : 'glass'
            }"
          >
            پاسخ‌های آماده
          </button>
        </div>
      </div>

      ${
        state.supportFilter.view === 'quick'
          ? renderAdminSupportQuickReplies()
          : `
        <!-- Messenger layout -->
        <div class="glass rounded-2xl p-3 lg:p-4 flex flex-col lg:flex-row gap-3 min-h-[420px] lg:min-h-[480px]">

          <!-- Ticket list (scrollable) -->
          <div class="w-full lg:w-80 lg:max-w-xs flex-shrink-0 flex flex-col gap-2 max-h-[260px] lg:max-h-[70vh] overflow-y-auto pr-1">
            ${
              filtered.length === 0
                ? `<div class="text-sm text-white/60 px-2 py-3">تیکتی یافت نشد.</div>`
                : filtered
                    .map(t => {
                      const isActive = activeTicket && activeTicket.id === t.id;
                      const priority = t.priority || 'normal';
                      const msgs = getTicketMessages(t);
                      const lastMsg = msgs[msgs.length - 1];
                      const name = t.user_name || 'کاربر';
                      const phone = t.user_phone || '-';
                      const initial = name.trim()[0] || 'ک';
                      const created = utils.formatDateTime(t.created_at || t.createdAt || '');
                      const priorityBadge =
                        priority === 'urgent'
                          ? '<span class="text-[10px] px-2 py-0.5 rounded-xl bg-rose-500/20 text-rose-300">فوری</span>'
                          : '<span class="text-[10px] px-2 py-0.5 rounded-xl bg-white/10 text-white/60">عادی</span>';

                      return `
                        <button
                          type="button"
                          onclick="state.adminSupportSelectedTicketId='${t.id}'; render()"
                          class="w-full text-right glass rounded-xl px-3 py-2 flex items-center gap-3 text-xs ${
                            isActive ? 'border border-violet-500/60 bg-violet-500/10' : ''
                          }"
                        >
                          <div class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                            <span class="text-[13px]">${initial}</span>
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between gap-2 mb-0.5">
                              <span class="font-semibold line-clamp-1">${name}</span>
                              ${priorityBadge}
                            </div>
                            <div class="text-[10px] text-white/50 line-clamp-1">
                              ${lastMsg ? lastMsg.text : 'بدون پیام'}
                            </div>
                            <div class="text-[9px] text-white/40 mt-0.5">${created}</div>
                          </div>
                        </button>
                      `;
                    })
                    .join('')
            }
          </div>

          <!-- Chat area -->
          <div class="flex-1 min-w-0 glass rounded-2xl p-3 lg:p-4 flex flex-col">
            ${
              !activeTicket
                ? `<div class="flex-1 flex items-center justify-center text-sm text-white/60">تیکتی انتخاب نشده است.</div>`
                : `
              <div class="flex items-center justify-between mb-3 text-xs">
                <div>
                  <div class="font-semibold text-sm">${activeTicket.user_name || 'کاربر'}</div>
                  <div class="text-[11px] text-white/60">${activeTicket.user_phone || '-'}</div>
                </div>
                <div class="flex items-center gap-2">
                  <select
                    class="text-[11px] bg-white/5 border border-white/15 rounded-xl px-2 py-1"
                    onchange="
                      const t = (state.tickets || []).find(x => x.id === '${activeTicket.id}');
                      if(t) updateTicketStatus(t, this.value);
                    "
                  >
                    <option value="open" ${activeTicket.status === 'open' ? 'selected' : ''}>باز</option>
                    <option value="closed" ${activeTicket.status === 'closed' ? 'selected' : ''}>بسته</option>
                  </select>
                  <button
                    type="button"
                    class="btn-ghost px-3 py-1 rounded-lg text-[11px]"
                    onclick="
                      const t = (state.tickets || []).find(x => x.id === '${activeTicket.id}');
                      if(t) closeTicket(t);
                    "
                  >
                    بستن تیکت
                  </button>
                </div>
              </div>

              <div class="flex-1 min-h-0 max-h-[260px] lg:max-h-[60vh] overflow-y-auto mb-3 space-y-2 pr-1">
                ${
                  activeMessages.length === 0
                    ? `<div class="text-xs text-white/60 px-2 py-3">هنوز پیامی در این تیکت ثبت نشده است.</div>`
                    : activeMessages
                        .map(m => {
                          const isAdmin = m.from === 'admin';
                          const align = isAdmin ? 'items-end' : 'items-start';
                          const bubble =
                            isAdmin
                              ? 'bg-violet-500/30 text-white border border-violet-400/40'
                              : 'bg-white/10 text-white border border-white/10';
                          const time = utils.formatDateTime(m.at || m.created_at || '');
                          return `
                            <div class="flex ${align}">
                              <div class="max-w-[80%] glass rounded-2xl px-3 py-2 text-xs ${bubble}">
                                <div class="whitespace-pre-line">${m.text}</div>
                                <div class="text-[9px] text-white/60 mt-1 text-left">${time}</div>
                              </div>
                            </div>
                          `;
                        })
                        .join('')
                }
              </div>

              <form
                class="mt-auto pt-2 border-t border-white/10 space-y-2"
                onsubmit="handleSupportSendMessage(this, '${activeTicket.id}')"
              >
                <div class="flex items-center gap-2">
                  <select
                    class="text-[11px] bg-white/5 border border-white/15 rounded-xl px-2 py-1"
                    onchange="if(this.value){ applyQuickReplyToTicket('${activeTicket.id}', this.value); this.value=''; }"
                  >
                    <option value="">پاسخ آماده...</option>
                    ${
                      (state.supportQuickReplies || [])
                        .map(q => `<option value="${q.id}">${q.label}</option>`)
                        .join('')
                    }
                  </select>
                  <span class="text-[10px] text-white/40">برای درج سریع پاسخ آماده</span>
                </div>
                <div class="flex items-center gap-2">
                  <textarea
                    name="message"
                    rows="1"
                    class="flex-1 input-style resize-none text-xs"
                    placeholder="نوشتن پاسخ..."
                  ></textarea>
                  <button
                    type="submit"
                    class="btn-primary px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    ارسال
                  </button>
                </div>
              </form>
            `
            }
          </div>
        </div>
      `
      }
    </div>
  `;
}
