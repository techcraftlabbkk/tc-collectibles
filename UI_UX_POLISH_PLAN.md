# 🎨 TC Collectibles — 3-Day UI/UX Polish Sprint
## Bold & Energetic Pokémon Marketplace Design

**Timeline:** May 12-14 (Launch: May 16)  
**Theme:** Bold, Energetic, Vibrant with Premium Collectibles Feel  
**Tech Stack:** Next.js 14, Tailwind CSS, TypeScript

---

## 📊 Design System

### Color Palette
```
Primary Blue:      #667eea (current) or #4f46e5 (deeper)
Primary Purple:    #7c3aed (accent for headers)
Gold/Amber:        #f59e0b (CTAs, highlights, premium feel)
Green Success:     #10b981
Red/Error:         #ef4444
Neutral Gray:      #6b7280 (text), #e5e7eb (borders)
Background:        #f9fafb (light), #ffffff (cards)
```

### Typography
```
Headers:    Font-weight 700-800, tracking tight (letter-spacing: -0.02em)
Body:       Font-weight 400-500, tracking normal
CTAs:       Font-weight 600-700, uppercase, letter-spacing 0.05em
Sizes:      H1: 2.25rem, H2: 1.875rem, H3: 1.5rem, Body: 1rem
```

### Spacing & Layout
```
Hero section:     py-24 (96px height) — bold, full-width
Card margins:     gap-6 (24px)
Section padding:  px-6 py-16 (mobile/desktop)
Grid cols:        grid-cols-1 (mobile), grid-cols-2 (tablet), grid-cols-4 (desktop)
Border radius:    sm: rounded-lg (8px), md: rounded-xl (12px), lg: rounded-2xl (16px)
```

---

## 🏠 PAGE 1: HOMEPAGE

### Hero Section (HIGH PRIORITY)
**Current:** Plain blue background  
**Target:** Gradient + Pokémon imagery + bold text

```html
<!-- Hero Banner -->
<section class="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 
                text-white overflow-hidden">
  <!-- Background pattern/image -->
  <div class="absolute inset-0 opacity-10">
    <!-- Pokémon-themed background SVG or image -->
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:py-40">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Left: Text -->
      <div>
        <h1 class="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
          Authentic PSA Pokémon Cards
        </h1>
        <p class="text-xl text-gray-100 mb-8 max-w-lg">
          Verified. Graded. Shipped from Bangkok. The only marketplace you trust for premium collectibles.
        </p>
        <button class="bg-amber-400 hover:bg-amber-500 text-gray-900 px-8 py-4 
                       rounded-lg font-bold text-lg transition-all duration-200 
                       transform hover:scale-105 shadow-lg">
          Shop Premium Cards
        </button>
      </div>
      
      <!-- Right: Image (Charizard or featured card) -->
      <div class="relative h-96 lg:h-full">
        <img src="/hero-card.png" alt="Featured Charizard" 
             class="w-full h-full object-contain drop-shadow-2xl" />
      </div>
    </div>
  </div>
</section>
```

### Featured Cards Section
**Current:** "No products found"  
**Target:** Show actual products with images + grades

```html
<section class="py-16 bg-gray-50">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-gray-900 mb-2">Featured Cards</h2>
      <p class="text-lg text-gray-600">Hand-picked gems. Verified authentic.</p>
    </div>
    
    <!-- Product Grid (use existing products from DB) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <div key={product.id} 
             class="bg-white rounded-xl shadow-md hover:shadow-xl 
                    transition-all duration-200 overflow-hidden cursor-pointer
                    transform hover:-translate-y-2">
          <!-- Product Image -->
          <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
            <img src={product.image_url} alt={product.title}
                 class="w-full h-full object-cover" />
            <!-- Grade Badge -->
            <div class="absolute top-3 right-3 bg-amber-400 text-gray-900 
                        px-3 py-1 rounded-full font-bold text-sm">
              {product.grade}
            </div>
          </div>
          
          <!-- Card Info -->
          <div class="p-4">
            <h3 class="font-bold text-gray-900 mb-2 line-clamp-2">
              {product.title}
            </h3>
            <p class="text-lg font-bold text-purple-600 mb-3">
              ฿{product.price.toLocaleString()}
            </p>
            <button class="w-full bg-purple-600 hover:bg-purple-700 text-white 
                           py-2 rounded-lg font-semibold transition-colors">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### Trust Section
**Keep existing but enhance styling:**
```html
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Trusted -->
      <div class="text-center p-8 rounded-xl border-2 border-purple-200 
                  hover:border-amber-400 transition-colors">
        <div class="text-5xl mb-4">🛡️</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">100% Authentic</h3>
        <p class="text-gray-600">Every card verified by our expert team.</p>
      </div>
      
      <!-- Verified -->
      <div class="text-center p-8 rounded-xl border-2 border-purple-200 
                  hover:border-amber-400 transition-colors">
        <div class="text-5xl mb-4">✓</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">PSA Graded</h3>
        <p class="text-gray-600">Professional authentication & grading.</p>
      </div>
      
      <!-- Secure -->
      <div class="text-center p-8 rounded-xl border-2 border-purple-200 
                  hover:border-amber-400 transition-colors">
        <div class="text-5xl mb-4">🔒</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h3>
        <p class="text-gray-600">PromptPay & Supabase encryption.</p>
      </div>
    </div>
  </div>
</section>
```

---

## 📦 PAGE 2: PRODUCTS PAGE

**Current:** Basic grid  
**Target:** Enhanced product cards with filters, better sorting

```html
<section class="max-w-7xl mx-auto px-6 py-16">
  <!-- Header -->
  <div class="mb-12">
    <h1 class="text-4xl font-bold text-gray-900 mb-2">Premium PSA Cards</h1>
    <p class="text-lg text-gray-600">Shop verified authentic collectibles</p>
  </div>
  
  <!-- Filters & Sort -->
  <div class="flex gap-4 mb-8 pb-8 border-b-2 border-purple-200">
    <select class="px-4 py-2 border-2 border-purple-300 rounded-lg 
                   focus:outline-none focus:border-amber-400">
      <option>Sort: Featured</option>
      <option>Price: Low to High</option>
      <option>Price: High to Low</option>
      <option>Grade: Best</option>
    </select>
    <select class="px-4 py-2 border-2 border-purple-300 rounded-lg 
                   focus:outline-none focus:border-amber-400">
      <option>Grade: All</option>
      <option>PSA 10 Gem Mint</option>
      <option>PSA 9 Mint</option>
      <option>PSA 8-9</option>
    </select>
  </div>
  
  <!-- Product Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Same card component as homepage */}
  </div>
</section>
```

---

## 🎴 PAGE 3: PRODUCT DETAIL

**Current:** Basic layout  
**Target:** Premium showcase with gallery, specs, related cards

```html
<section class="max-w-7xl mx-auto px-6 py-16">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
    
    <!-- Left: Product Images -->
    <div>
      <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl 
                  p-8 mb-6 aspect-square flex items-center justify-center">
        <img src={product.image_url} alt={product.title}
             class="w-full h-full object-contain drop-shadow-xl" />
      </div>
      <!-- Thumbnails (if multiple images) -->
    </div>
    
    <!-- Right: Product Info -->
    <div>
      <!-- Grade Badge -->
      <div class="inline-block bg-amber-400 text-gray-900 px-4 py-2 
                  rounded-full font-bold mb-4">
        {product.grade}
      </div>
      
      <!-- Title -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        {product.title}
      </h1>
      
      <!-- Price -->
      <p class="text-5xl font-bold text-purple-600 mb-6">
        ฿{product.price.toLocaleString()}
      </p>
      
      <!-- Description -->
      <p class="text-lg text-gray-700 mb-8 leading-relaxed">
        {product.description}
      </p>
      
      <!-- Specs -->
      <div class="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 class="font-bold text-lg text-gray-900 mb-4">Card Details</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><span class="text-gray-600">Set:</span> Base Set</div>
          <div><span class="text-gray-600">Card:</span> Charizard #4</div>
          <div><span class="text-gray-600">Condition:</span> Gem Mint</div>
          <div><span class="text-gray-600">Year:</span> 1999</div>
        </div>
      </div>
      
      <!-- CTA -->
      <button class="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 
                     py-4 rounded-lg font-bold text-lg transition-all 
                     transform hover:scale-105 shadow-lg mb-4">
        Add to Cart
      </button>
      <button class="w-full border-2 border-purple-600 text-purple-600 
                     hover:bg-purple-50 py-4 rounded-lg font-bold text-lg">
        Continue Shopping
      </button>
    </div>
  </div>
  
  <!-- Related Cards Section -->
  <div class="mt-16 pt-12 border-t-2 border-purple-200">
    <h2 class="text-3xl font-bold text-gray-900 mb-8">Related Cards</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Show 4 related cards */}
    </div>
  </div>
</section>
```

---

## 🛒 PAGE 4: CART & CHECKOUT

### Cart Page
- Add product images to line items
- Better subtotal/tax/total display
- Enhanced CTAs with better contrast

### Checkout Page
- Progress indicator (steps: Address → Payment → Confirm)
- Better form styling
- Clear section separations

---

## 🎯 IMPLEMENTATION PRIORITY

**MUST DO (Day 1-2):**
1. ✅ Homepage hero redesign (gradient, text, CTA)
2. ✅ Featured cards styling (with actual products)
3. ✅ Products page card grid
4. ✅ Product detail layout

**SHOULD DO (Day 2-3):**
5. ✅ Cart page product images
6. ✅ Checkout styling & progress indicator
7. ✅ Trust section enhancement
8. ✅ Color/typography consistency

**NICE TO HAVE (if time):**
9. Hover animations & transitions
10. Mobile responsiveness polish
11. Loading skeletons
12. Page transitions

---

## 🚀 GO-LIVE CHECKLIST

- [ ] Homepage hero looks premium
- [ ] Featured cards display with real products
- [ ] Products page responsive & styled
- [ ] Product detail premium layout
- [ ] Cart shows images properly
- [ ] Checkout is clear & easy
- [ ] All colors consistent
- [ ] No broken images
- [ ] Mobile preview looks good
- [ ] E2E test checkout flow
- [ ] Ready for May 16! 🎉

---

**Next:** Should I help you implement these changes? Start with the homepage hero?
