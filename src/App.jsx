import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight, ArrowUpDown, BadgePercent, CalendarDays, Check, CheckCircle2, ChefHat, CircleHelp, CreditCard,
  ChartNoAxesColumnIncreasing, ChevronDown, ChevronLeft, ChevronRight,
  CircleX, Clock3, Coffee, FileText,
  ConciergeBell, Eye, Flame, Grid2X2, Headphones, House, Mail, MessageCircle, Minus,
  List, PackageCheck, Pencil, Plus, Search, Send, ShoppingCart, SlidersHorizontal,
  Leaf, LifeBuoy, Sparkles, Star, Tag, Trash2, Truck, Users, Utensils, X,
} from 'lucide-react'
import './App.css'
import BellAnimation from './BellAnimation.jsx'

const dishes = [
  { id: 1, name: 'Paneer Tikka', category: 'Starters', price: 220, oldPrice: 260, off: '15% OFF', veg: true, popular: true, description: 'Marinated cottage cheese grilled to perfection.', image: 'photo-1567188040759-fb8a883dc6d8' },
  { id: 2, name: 'Masala Dosa', category: 'Starters', price: 180, veg: true, popular: true, description: 'Crispy dosa served with sambar and chutney.', image: 'photo-1668236543090-82eba5ee5976' },
  { id: 3, name: 'Chicken Biryani', category: 'Main Course', price: 280, veg: false, popular: true, description: 'Fragrant basmati rice with tender chicken.', image: 'photo-1589302168068-964664d93dc0' },
  { id: 4, name: 'French Fries', category: 'Starters', price: 120, veg: true, description: 'Crispy golden fries, served with ketchup.', image: 'photo-1573080496219-bb080dd4f877' },
  { id: 5, name: 'Farmhouse Pizza', category: 'Main Course', price: 250, veg: true, description: 'Garden vegetables and bubbling mozzarella.', image: 'photo-1579751626657-72bc17010498' },
  { id: 6, name: 'Chicken Burger', category: 'Main Course', price: 200, veg: false, description: 'Grilled chicken, crisp lettuce and house sauce.', image: 'photo-1568901346375-23c9450c58cd' },
  { id: 7, name: 'Garlic Bread', category: 'Starters', price: 140, veg: true, description: 'Toasted bread brushed with garlic and herbs.', image: 'photo-1573140247632-f8fd74997d5c' },
  { id: 8, name: 'Chocolate Brownie', category: 'Desserts', price: 180, veg: true, description: 'Rich chocolate brownie with vanilla ice cream.', image: 'photo-1606313564200-e75d5e30476c' },
  { id: 9, name: 'Pasta Alfredo', category: 'Main Course', price: 260, veg: true, description: 'Creamy pasta finished with parmesan.', image: 'photo-1645112411341-6c4fd023714a' },
  { id: 10, name: 'Paneer Butter Masala', category: 'Main Course', price: 290, veg: true, description: 'Soft paneer in a rich tomato butter gravy.', image: 'photo-1631452180519-c014fe946bc7' },
  { id: 11, name: 'Chicken Tandoori', category: 'Starters', price: 320, veg: false, description: 'Smoky tandoori chicken with warming spices.', image: 'photo-1599487488170-d11ec9c172f0' },
  { id: 12, name: 'Cold Coffee', category: 'Beverages', price: 90, veg: true, description: 'Chilled coffee topped with creamy foam.', image: 'photo-1461023058943-07fcbe16d735' },
  { id: 13, name: 'Mango Lassi', category: 'Beverages', price: 110, veg: true, description: 'Sweet mango blended with cool, creamy yogurt.', image: 'photo-1527661591475-527312dd65f5' },
  { id: 14, name: 'Gulab Jamun', category: 'Desserts', price: 100, veg: true, description: 'Soft khoya dumplings in fragrant sugar syrup.', image: 'photo-1666190092159-2e68a6e7b038' },
  { id: 15, name: 'Veg Spring Rolls', category: 'Starters', price: 160, veg: true, description: 'Golden rolls packed with crunchy vegetables.', image: 'photo-1544025162-d76694265947' },
  { id: 16, name: 'Dal Makhani', category: 'Main Course', price: 240, veg: true, description: 'Slow-cooked black lentils with a buttery finish.', image: 'photo-1546833999-b9f581a1996d' },
]

const categories = [
  { name: 'All', icon: Grid2X2 },
  { name: 'Starters', icon: Utensils },
  { name: 'Main Course', icon: ConciergeBell },
  { name: 'Beverages', icon: Coffee },
  { name: 'Desserts', icon: Sparkles },
]

const helpFaqs = [
  { question: 'How do I place an order?', answer: 'Add dishes to your cart, choose Dine-in or Home Delivery, then review your items and tap Place Order.' , icon: Utensils, tone: 'orange' },
  { question: 'What payment methods are accepted?', answer: 'Payment options can vary by restaurant. Please confirm the available method with the restaurant team before placing your order.', icon: CreditCard, tone: 'green' },
  { question: 'Is home delivery available?', answer: 'Delivery availability can vary by dish and restaurant. Check the order type options in your cart for this menu.', icon: Truck, tone: 'blue' },
  { question: 'Can I track my order?', answer: 'Open My Orders to review the order status available for your recent orders.', icon: Clock3, tone: 'orange' },
  { question: 'How do I apply an offer?', answer: 'Open Offers, choose an available dish, and add it to your cart at the displayed offer price.', icon: BadgePercent, tone: 'purple' },
  { question: 'What if I receive the wrong item?', answer: 'Use Call Waiter while dining in, or contact the restaurant team using the support options on this page.', icon: CircleX, tone: 'red' },
  { question: 'Can I change my order after placing it?', answer: 'Please contact the restaurant team as soon as possible. Changes depend on the order’s preparation status.', icon: FileText, tone: 'blue' },
  { question: 'How can I request help at my table?', answer: 'Open Call Waiter and send a request from the table QR menu.', icon: ConciergeBell, tone: 'green' },
]

const helpTopics = [
  { title: 'Order Issues', description: 'Missing item, wrong order, refunds etc.', icon: FileText, tone: 'orange', subject: 'Order support' },
  { title: 'Payment Support', description: 'Payment failed, refund status, payment methods', icon: CreditCard, tone: 'blue', subject: 'Payment support' },
  { title: 'Delivery Support', description: 'Track order, delivery delay, address issues', icon: Truck, tone: 'purple', subject: 'Delivery support' },
  { title: 'Technical Support', description: 'App/website issues, login problems, other help', icon: LifeBuoy, tone: 'green', subject: 'Technical support' },
]

const sampleOrders = [
  { id: 'TB1256', type: 'Dine-in', place: 'Table 5', items: [1, 3, 2], extra: 1, amount: 420, date: '28 Oct 2026', time: '12:45 PM', status: 'Completed' },
  { id: 'TB1255', type: 'Home Delivery', place: 'Karpuri Nagar, Purnea', items: [10, 1, 3], extra: 2, amount: 380, date: '27 Oct 2026', time: '08:20 AM', status: 'Delivered' },
  { id: 'TB1254', type: 'Dine-in', place: 'Table 3', items: [1, 10, 3], extra: 1, amount: 260, date: '26 Oct 2026', time: '07:15 PM', status: 'Completed' },
  { id: 'TB1253', type: 'Home Delivery', place: 'Line Bazar, Purnea', items: [2, 10, 4], extra: 1, amount: 310, date: '24 Oct 2026', time: '02:30 PM', status: 'Preparing' },
  { id: 'TB1252', type: 'Dine-in', place: 'Table 2', items: [3, 4, 10], extra: 1, amount: 480, date: '22 Oct 2026', time: '01:20 PM', status: 'Completed' },
  { id: 'TB1251', type: 'Dine-in', place: 'Table 4', items: [6, 4, 12], extra: 0, amount: 350, date: '21 Oct 2026', time: '08:10 AM', status: 'Completed' },
  { id: 'TB1250', type: 'Home Delivery', place: 'Khatihar, Purnea', items: [10, 1, 2], extra: 1, amount: 290, date: '20 Oct 2026', time: '06:45 PM', status: 'Delivered' },
  { id: 'TB1249', type: 'Dine-in', place: 'Table 6', items: [4, 12, 3], extra: 0, amount: 210, date: '19 Oct 2026', time: '01:15 AM', status: 'Preparing' },
  { id: 'TB1248', type: 'Home Delivery', place: 'Karpuri Nagar, Purnea', items: [6, 4, 10], extra: 2, amount: 520, date: '18 Oct 2026', time: '07:40 PM', status: 'Delivered' },
  { id: 'TB1247', type: 'Dine-in', place: 'Table 1', items: [1, 10, 3], extra: 1, amount: 330, date: '17 Oct 2026', time: '12:05 PM', status: 'Cancelled' },
  { id: 'TB1246', type: 'Home Delivery', place: 'Bhatta Bazar, Purnea', items: [9, 8, 12], extra: 1, amount: 460, date: '16 Oct 2026', time: '05:25 PM', status: 'Completed' },
  { id: 'TB1245', type: 'Dine-in', place: 'Table 7', items: [2, 14, 12], extra: 0, amount: 240, date: '15 Oct 2026', time: '09:10 AM', status: 'Cancelled' },
]

const money = (amount) => `₹${amount.toLocaleString('en-IN')}`
const photo = (id, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=90`

const offerItems = [
  { dishId: 3, name: 'Chicken Biryani', description: 'Aromatic basmati rice with tender chicken and spices.', category: 'Main Course', cuisine: 'Indian', price: 299, originalPrice: 499, rating: 4.6, veg: false, image: dishes[2].image, availableFor: ['Dine-in', 'Home Delivery'], available: true },
  { dishId: 9, name: 'White Sauce Pasta', description: 'Creamy and cheesy pasta with fresh herbs.', category: 'Main Course', cuisine: 'Italian', price: 195, originalPrice: 300, rating: 4.2, veg: true, image: dishes[8].image, availableFor: ['Dine-in', 'Home Delivery'], available: true },
  { dishId: 5, name: 'Margherita Pizza', description: 'Classic pizza with fresh tomatoes, cheese and basil.', category: 'Main Course', cuisine: 'Italian', price: 280, originalPrice: 400, rating: 4.5, veg: true, image: dishes[4].image, availableFor: ['Dine-in', 'Home Delivery'], available: true },
  { dishId: 6, name: 'Chicken Burger', description: 'Juicy chicken patty with fresh veggies and special sauce.', category: 'Main Course', cuisine: 'Continental', price: 180, originalPrice: 240, rating: 4.3, veg: false, image: dishes[5].image, availableFor: ['Home Delivery'], available: true },
  { dishId: 17, name: 'Chicken Momos', description: 'Steamed momos served with spicy chutney.', category: 'Starters', cuisine: 'Chinese', price: 120, originalPrice: 150, rating: 4.1, veg: false, image: 'photo-1563245372-f21724e3856d', availableFor: ['Dine-in'], available: true },
  { dishId: 1, name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection.', category: 'Starters', cuisine: 'Indian', price: 220, originalPrice: 260, rating: 4.4, veg: true, image: dishes[0].image, availableFor: ['Dine-in', 'Home Delivery'], available: true },
]
const cartProducts = [...dishes, { id: 17, name: 'Chicken Momos', category: 'Starters', price: 150, veg: false, description: 'Steamed chicken momos served with spicy chutney.', image: 'photo-1563245372-f21724e3856d' }]
const getOfferDiscount = ({ price, originalPrice }) => Math.max(0, Math.round(((originalPrice - price) / originalPrice) * 100))

function OfferCard({ offer, quantity, onQuantityChange }) {
  const sourceDish = dishes.find((dish) => dish.id === offer.dishId)
  const isPopular = offer.popular ?? sourceDish?.popular ?? false
  return <article className="offer-card">
    <div className="offer-image-wrap">
      <img className="offer-image" src={photo(offer.image, 1200)} alt={offer.name} loading="lazy" decoding="async" />
      <span className={`offer-diet-mark ${offer.veg ? 'veg' : 'nonveg'}`} role="img" aria-label={offer.veg ? 'Vegetarian' : 'Non-vegetarian'}>{offer.veg ? <span /> : <i />}</span>
      <span className="offer-rating"><Star size={16} fill="currentColor" /> {offer.rating.toFixed(1)}</span>
      {isPopular && <span className="offer-popular"><Flame size={14} fill="currentColor" /> Popular</span>}
      <span className="offer-ribbon-wrap"><i className="offer-ribbon-tail" aria-hidden="true" /><span className="offer-ribbon"><b>{getOfferDiscount(offer)}% <small>OFF</small></b></span></span>
      {!offer.available && <span className="offer-unavailable">Currently unavailable</span>}
    </div>
    <div className="offer-card-copy">
      <h2>{offer.name}</h2>
      <p>{offer.description}</p>
      <div className="offer-card-footer">
        <div className="offer-price"><strong>{money(offer.price)}</strong><del>{money(offer.originalPrice)}</del></div>
        {quantity > 0 ? <div className="quantity-control offer-quantity" aria-label={`${offer.name} quantity`}><button onClick={() => onQuantityChange(-1)} aria-label={`Remove one ${offer.name}`}><Minus size={16} /></button><span>{quantity}</span><button onClick={() => onQuantityChange(1)} aria-label={`Add one ${offer.name}`}><Plus size={16} /></button></div> : <button className="offer-add-button" disabled={!offer.available} onClick={() => onQuantityChange(1)}>{offer.available ? <>Add <Plus size={18} strokeWidth={2.5} /></> : 'Unavailable'}</button>}
      </div>
    </div>
  </article>
}

function OffersFilter({ active, setActive, counts, sortBy, setSortBy, open, setOpen, draft, setDraft, apply, clear }) {
  const filters = [
    { id: 'All Offers', label: 'All Offers', count: counts.all, icon: Tag },
    { id: 'Dine-in', label: 'Dine-in', count: counts.dineIn, icon: Utensils },
    { id: 'Home Delivery', label: 'Home Delivery', count: counts.delivery, icon: Truck },
  ]
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  return <>
    <div className="offers-filter-row">
      <div className="offers-filter-group" role="tablist" aria-label="Filter offers by order type">
        {filters.map(({ id, label, count, icon: Icon }) => <button key={id} className={`offers-filter-button ${active === id ? 'selected' : ''}`} onClick={() => setActive(id)} role="tab" aria-selected={active === id}><Icon size={19} /><span>{label} ({count})</span></button>)}
      </div>
      <div className="offers-filter-actions">
        <button className={`offers-filter-toggle ${open ? 'selected' : ''}`} aria-expanded={open} onClick={() => setOpen(!open)}><SlidersHorizontal size={18} /><span>Filters</span><ChevronDown size={15} className={open ? 'turned' : ''} /></button>
        <label className="offers-sort"><SlidersHorizontal size={18} /><span>{sortBy === 'discount' ? 'Sort By' : ({ 'price-low': 'Price Low to High', 'price-high': 'Price High to Low', rating: 'Top Rated' })[sortBy]}</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort offers"><option value="discount">Highest Discount</option><option value="price-low">Price Low to High</option><option value="price-high">Price High to Low</option><option value="rating">Top Rated</option></select><ChevronDown size={16} /></label>
      </div>
    </div>
    {open && <section className="offers-filter-panel" aria-label="Offer filters">
      <div className="offers-filter-columns">
        <fieldset><legend><Leaf size={17} /> Dietary Preference</legend>{[['all', 'All'], ['veg', 'Vegetarian'], ['nonveg', 'Non-Vegetarian']].map(([value, label]) => <label key={value}><input type="radio" name="offer-diet" checked={draft.diet === value} onChange={() => update('diet', value)} /><span>{label}</span></label>)}</fieldset>
        <fieldset><legend><ChefHat size={17} /> Cuisine</legend>{[['all', 'All'], ['Indian', 'Indian'], ['Chinese', 'Chinese'], ['Continental', 'Continental'], ['Italian', 'Italian']].map(([value, label]) => <label key={value}><input type="radio" name="offer-cuisine" checked={draft.cuisine === value} onChange={() => update('cuisine', value)} /><span>{label}</span></label>)}</fieldset>
        <fieldset><legend><span className="offers-rupee">₹</span> Price Range</legend>{[['all', 'All'], ['under100', 'Under ₹100'], ['100-200', '₹100 – ₹200'], ['200-300', '₹200 – ₹300'], ['above300', 'Above ₹300']].map(([value, label]) => <label key={value}><input type="radio" name="offer-price" checked={draft.price === value} onChange={() => update('price', value)} /><span>{label}</span></label>)}</fieldset>
        <fieldset><legend><Star size={17} /> Rating</legend>{[['all', 'All'], ['4.0', '4.0+'], ['4.5', '4.5+'], ['4.8', '4.8+']].map(([value, label]) => <label key={value}><input type="radio" name="offer-rating" checked={draft.rating === value} onChange={() => update('rating', value)} /><span>{label === 'all' ? label : <><Star size={13} fill="currentColor" /> {label}</>}</span></label>)}</fieldset>
      </div>
      <div className="offers-filter-panel-actions"><button className="offers-clear-filters" onClick={clear}><Trash2 size={15} /> Clear All</button><button className="offers-apply-filters" onClick={apply}><Search size={17} /> Apply Filters</button></div>
    </section>}
  </>
}

function MenuFilterPanel({ draft, setDraft, clear, apply }) {
  const groups = [
    { key: 'diet', title: <><Leaf size={17} /> Dietary Preference</>, options: [['all', 'All'], ['veg', 'Vegetarian'], ['nonveg', 'Non-Vegetarian']] },
    { key: 'cuisine', title: <><ChefHat size={17} /> Cuisine</>, options: [['all', 'All'], ['Indian', 'Indian'], ['Chinese', 'Chinese'], ['Continental', 'Continental'], ['Italian', 'Italian']] },
    { key: 'price', title: <><span className="offers-rupee">₹</span> Price Range</>, options: [['all', 'All'], ['under100', 'Under ₹100'], ['100-200', '₹100 – ₹200'], ['200-300', '₹200 – ₹300'], ['above300', 'Above ₹300']] },
    { key: 'rating', title: <><Star size={17} /> Rating</>, options: [['all', 'All'], ['4', '4.0+'], ['4.5', '4.5+'], ['4.8', '4.8+']] },
  ]
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  return <section className="offers-filter-panel menu-expanded-filter" aria-label="Menu filters">
    <div className="offers-filter-columns">
      {groups.map(({ key, title, options }) => <fieldset key={key}><legend>{title}</legend>{options.map(([value, label]) => <label key={value}><input type="radio" name={`menu-${key}`} checked={draft[key] === value} onChange={() => update(key, value)} /><span>{label}</span></label>)}</fieldset>)}
    </div>
    <div className="offers-filter-panel-actions"><button className="menu-clear-filters" onClick={clear}><Trash2 size={14} /> Clear All</button><button className="menu-apply-filters" onClick={apply}><Search size={17} /> Apply Filters</button></div>
  </section>
}

function StatusBadge({ status }) {
  const Icon = status === 'Preparing' ? Clock3 : status === 'Delivered' ? Truck : status === 'Cancelled' ? CircleX : CheckCircle2
  return <span className={`status-badge status-${status.toLowerCase()}`}><Icon size={15} />{status}{status === 'Preparing' && <small>Order sent to kitchen</small>}</span>
}

function ChartIcon() {
  return <ChartNoAxesColumnIncreasing className="summary-trend" size={21} />
}

function ListIcon() {
  return <List size={19} />
}

function App() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [menuFiltersOpen, setMenuFiltersOpen] = useState(false)
  const [menuFilterDraft, setMenuFilterDraft] = useState({ diet: 'all', cuisine: 'all', price: 'all', rating: 'all' })
  const [menuFacetFilters, setMenuFacetFilters] = useState({ diet: 'all', cuisine: 'all', price: 'all', rating: 'all' })
  const [menuSort, setMenuSort] = useState('recommended')
  const [cart, setCart] = useState({})
  const [orderType, setOrderType] = useState('Dine-in')
  const [instructions, setInstructions] = useState('')
  const [notice, setNotice] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [page, setPage] = useState('menu')
  const [orderQuery, setOrderQuery] = useState('')
  const [orderTypeFilter, setOrderTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [ordersPage, setOrdersPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [dateRange, setDateRange] = useState('Last 30 days')
  const [offerFilter, setOfferFilter] = useState('All Offers')
  const [offersSearch, setOffersSearch] = useState('')
  const [offersSort, setOffersSort] = useState('discount')
  const [offersFiltersOpen, setOffersFiltersOpen] = useState(false)
  const [offerFilterDraft, setOfferFilterDraft] = useState({ diet: 'all', cuisine: 'all', price: 'all', rating: 'all' })
  const [offerFacetFilters, setOfferFacetFilters] = useState({ diet: 'all', cuisine: 'all', price: 'all', rating: 'all' })
  const [cartPriceOverrides, setCartPriceOverrides] = useState({})
  const [waiterState, setWaiterState] = useState('idle')
  const [waiterMessage, setWaiterMessage] = useState('')
  const [bellRinging, setBellRinging] = useState(false)
  const waiterTimer = useRef(null)
  const waiterRequestPending = useRef(false)
  const audioContext = useRef(null)
  const [openFaq, setOpenFaq] = useState(-1)
  const [showAllFaqs, setShowAllFaqs] = useState(false)
  const [supportTopic, setSupportTopic] = useState('General support')
  const [supportFeedback, setSupportFeedback] = useState('')
  const supportFormRef = useRef(null)
  const qrTableId = new URLSearchParams(window.location.search).get('table') || window.sessionStorage.getItem('tableId') || ''
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'hello@tastybites.example'

  const submitSupportMessage = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const subject = encodeURIComponent(`Tasty Bites — ${supportTopic}`)
    const body = encodeURIComponent(`Name: ${form.get('name')}\nMobile: ${form.get('phone')}\nEmail: ${form.get('email') || 'Not provided'}\n\n${form.get('message')}`)
    setSupportFeedback('Opening your email app with this message. It will only be sent after you confirm there.')
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`
  }

  const selectSupportTopic = (topic) => {
    setSupportTopic(topic)
    supportFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  useEffect(() => () => {
    window.clearTimeout(waiterTimer.current)
    if (audioContext.current && audioContext.current.state !== 'closed') audioContext.current.close()
  }, [])

  const playBellSound = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return
      if (audioContext.current && audioContext.current.state !== 'closed') audioContext.current.close()
      const context = new AudioContextClass()
      audioContext.current = context
      const now = context.currentTime
      ;[0, 0.18].forEach((offset) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(880, now + offset)
        oscillator.frequency.exponentialRampToValueAtTime(620, now + offset + 0.35)
        gain.gain.setValueAtTime(0.0001, now + offset)
        gain.gain.exponentialRampToValueAtTime(0.12, now + offset + 0.015)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.45)
        oscillator.connect(gain)
        gain.connect(context.destination)
        oscillator.start(now + offset)
        oscillator.stop(now + offset + 0.46)
      })
      window.setTimeout(() => { if (context.state !== 'closed') context.close() }, 900)
    } catch { /* Sound is optional; the waiter request remains usable. */ }
  }

  const callWaiter = async () => {
    if (waiterRequestPending.current) return
    setBellRinging(true)
    playBellSound()
    window.clearTimeout(waiterTimer.current)
    waiterTimer.current = window.setTimeout(() => setBellRinging(false), 3000)
    setWaiterMessage('')
    const endpoint = import.meta.env.VITE_WAITER_REQUEST_ENDPOINT
    if (!endpoint) {
      setWaiterState('error')
      setWaiterMessage('Waiter requests are not connected to a backend yet.')
      return
    }
    if (!qrTableId) {
      setWaiterState('error')
      setWaiterMessage('Table details are missing. Please reopen this menu using your table QR code.')
      return
    }
    waiterRequestPending.current = true
    setWaiterState('loading')
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tableId: qrTableId }) })
      if (!response.ok) throw new Error('The waiter request could not be sent. Please try again.')
      setWaiterState('success')
      setWaiterMessage('Our staff will be with you shortly.')
    } catch (error) {
      setWaiterState('error')
      setWaiterMessage(error instanceof Error ? error.message : 'The waiter request could not be sent. Please try again.')
    } finally {
      waiterRequestPending.current = false
    }
  }

  const visibleDishes = useMemo(() => {
    const filtered = dishes.filter((dish) => {
      const matchesCategory = category === 'All' || dish.category === category
      const matchesSearch = `${dish.name} ${dish.description} ${dish.category}`.toLowerCase().includes(query.trim().toLowerCase())
      const matchesDiet = menuFacetFilters.diet === 'all' || (menuFacetFilters.diet === 'veg' ? dish.veg : !dish.veg)
      const cuisine = offerItems.find((offer) => offer.dishId === dish.id)?.cuisine
      const rating = offerItems.find((offer) => offer.dishId === dish.id)?.rating
      const matchesCuisine = menuFacetFilters.cuisine === 'all' || cuisine === menuFacetFilters.cuisine
      const matchesPrice = menuFacetFilters.price === 'all' || (menuFacetFilters.price === 'under100' ? dish.price < 100 : menuFacetFilters.price === '100-200' ? dish.price >= 100 && dish.price <= 200 : menuFacetFilters.price === '200-300' ? dish.price > 200 && dish.price <= 300 : dish.price > 300)
      const matchesRating = menuFacetFilters.rating === 'all' || (rating != null && rating >= Number(menuFacetFilters.rating))
      return matchesCategory && matchesSearch && matchesDiet && matchesCuisine && matchesPrice && matchesRating
    })
    if (menuSort === 'price-low') return filtered.sort((first, second) => first.price - second.price)
    if (menuSort === 'price-high') return filtered.sort((first, second) => second.price - first.price)
    if (menuSort === 'name') return filtered.sort((first, second) => first.name.localeCompare(second.name))
    if (menuSort === 'popular') return filtered.sort((first, second) => Number(second.popular) - Number(first.popular))
    return filtered
  }, [category, query, menuFacetFilters, menuSort])

  const cartEntries = cartProducts.filter((dish) => cart[dish.id] > 0).map((dish) => ({ ...dish, ...cartPriceOverrides[dish.id] }))
  const itemCount = cartEntries.reduce((total, dish) => total + cart[dish.id], 0)
  const subtotal = cartEntries.reduce((total, dish) => total + dish.price * cart[dish.id], 0)
  const tax = Math.round(subtotal * 0.05)
  const setQuantity = (id, delta, offer = null) => {
    const nextQuantity = Math.max(0, (cart[id] || 0) + delta)
    setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + delta) }))
    if (offer) setCartPriceOverrides((current) => ({ ...current, [id]: { name: offer.name, price: offer.price, description: offer.description, offerOriginalPrice: offer.originalPrice } }))
    else if (!nextQuantity) setCartPriceOverrides((current) => { const next = { ...current }; delete next[id]; return next })
  }
  const clearCart = () => { setCart({}); setCartPriceOverrides({}) }

  const offerCounts = {
    all: offerItems.filter((offer) => offer.available).length,
    dineIn: offerItems.filter((offer) => offer.available && offer.availableFor.includes('Dine-in')).length,
    delivery: offerItems.filter((offer) => offer.available && offer.availableFor.includes('Home Delivery')).length,
  }
  const visibleOffers = useMemo(() => {
    const searchTerm = offersSearch.trim().toLowerCase()
    const filtered = offerItems.filter((offer) => {
      const matchesType = offerFilter === 'All Offers' || offer.availableFor.includes(offerFilter)
      const matchesSearch = `${offer.name} ${offer.description} ${offer.category}`.toLowerCase().includes(searchTerm)
      const matchesDiet = offerFacetFilters.diet === 'all' || (offerFacetFilters.diet === 'veg' ? offer.veg : !offer.veg)
      const matchesCuisine = offerFacetFilters.cuisine === 'all' || offer.cuisine === offerFacetFilters.cuisine
      const matchesPrice = offerFacetFilters.price === 'all' || (offerFacetFilters.price === 'under100' ? offer.price < 100 : offerFacetFilters.price === '100-200' ? offer.price >= 100 && offer.price < 200 : offerFacetFilters.price === '200-300' ? offer.price >= 200 && offer.price <= 300 : offer.price > 300)
      const matchesRating = offerFacetFilters.rating === 'all' || offer.rating >= Number(offerFacetFilters.rating)
      return offer.available && matchesType && matchesSearch && matchesDiet && matchesCuisine && matchesPrice && matchesRating
    })
    return filtered.sort((first, second) => {
      if (offersSort === 'price-low') return first.price - second.price
      if (offersSort === 'price-high') return second.price - first.price
      if (offersSort === 'rating') return second.rating - first.rating
      return getOfferDiscount(second) - getOfferDiscount(first)
    })
  }, [offerFilter, offersSearch, offersSort, offerFacetFilters])

  const filteredOrders = useMemo(() => sampleOrders.filter((order) => {
    const matchesQuery = `${order.id} ${order.place} ${order.items.map((id) => dishes.find((dish) => dish.id === id)?.name).join(' ')}`.toLowerCase().includes(orderQuery.toLowerCase())
    const matchesType = orderTypeFilter === 'All' || (orderTypeFilter === 'Delivery' ? order.type === 'Home Delivery' : order.type === orderTypeFilter)
    const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter
    const matchesDate = dateRange !== 'Last 7 days' || new Date(order.date).getTime() >= new Date('23 Oct 2026').getTime()
    return matchesQuery && matchesType && matchesStatus && matchesDate
  }), [orderQuery, orderTypeFilter, statusFilter, dateRange])
  const pageOrders = filteredOrders.slice((ordersPage - 1) * 10, ordersPage * 10)
  const orderCounts = {
    total: sampleOrders.length,
    completed: sampleOrders.filter((order) => order.status === 'Completed').length,
    delivered: sampleOrders.filter((order) => order.status === 'Delivered').length,
    cancelled: sampleOrders.filter((order) => order.status === 'Cancelled').length,
    dineIn: sampleOrders.filter((order) => order.type === 'Dine-in').length,
    delivery: sampleOrders.filter((order) => order.type === 'Home Delivery').length,
  }

  const placeOrder = () => {
    if (!itemCount) {
      setNotice('Add a dish to your cart to get started.')
      return
    }
    setNotice(`Order placed for ${itemCount} ${itemCount === 1 ? 'item' : 'items'} · ${orderType}`)
    clearCart()
    setInstructions('')
    window.setTimeout(() => setNotice(''), 3800)
  }

  return (
    <div className={`app-shell ${page === 'orders' ? 'orders-mode' : ''} ${page === 'offers' ? 'offers-mode' : ''} ${page === 'waiter' ? 'waiter-mode' : ''} ${page === 'help' ? 'help-mode' : ''}`}>
      <aside className="sidebar">
        <a className="brand" href="#menu" aria-label="Tasty Bites home">
          <span className="brand-mark"><ChefHat size={27} strokeWidth={2.1} /></span>
          <span className="brand-type"><strong>Tasty <i>Bites</i></strong><small>RESTAURANT</small></span>
        </a>
        <nav className="side-nav" aria-label="Main navigation">
          <button className={`side-link ${page === 'menu' ? 'active' : ''}`} onClick={() => setPage('menu')}><Grid2X2 size={19} /><span>Menu</span></button>
          <button className={`side-link ${page === 'orders' ? 'active' : ''}`} onClick={() => { setPage('orders'); setOrdersPage(1); setCartOpen(false) }}><Clock3 size={19} /><span>My Orders</span></button>
          <button className={`side-link ${page === 'offers' ? 'active' : ''}`} onClick={() => { setPage('offers'); setCartOpen(false) }}><BadgePercent size={19} /><span>Offers</span><span className="nav-new">{offerCounts.all}</span></button>
          <button className={`side-link ${page === 'waiter' ? 'active' : ''}`} onClick={() => { setPage('waiter'); setCartOpen(false) }}><ConciergeBell size={19} /><span>Call Waiter</span></button>
          <button className={`side-link ${page === 'help' ? 'active' : ''}`} onClick={() => { setPage('help'); setCartOpen(false) }}><Headphones size={19} /><span>Help &amp; Support</span></button>
        </nav>
        <section className="table-card" id="table" aria-label="Table information">
          <div className="table-top"><span><Users size={18} /> Table No. 5</span><button className="icon-button subtle" aria-label="Edit table"><Pencil size={16} /></button></div>
          <p><Clock3 size={17} /> 10:00 AM – 11:00 PM</p>
          <p className="open-status"><span /> Open Now</p>
        </section>
      </aside>

      {page === 'offers' ? <main className="offers-area" id="offers">
        <div className="mobile-brand"><a className="brand" href="#menu" onClick={(event) => { event.preventDefault(); setPage('menu') }}><span className="brand-mark"><ChefHat size={25} /></span><span className="brand-type"><strong>Tasty <i>Bites</i></strong><small>RESTAURANT</small></span></a><button className="mobile-cart" onClick={() => { setPage('menu'); setCartOpen(true) }} aria-label={`Open cart, ${itemCount} items`}><ShoppingCart size={20} />{itemCount > 0 && <b>{itemCount}</b>}</button></div>
        <div className="mobile-page-nav offers-mobile-page-nav"><button onClick={() => setPage('menu')}>Menu</button><button onClick={() => setPage('orders')}>My Orders</button><button className="selected" onClick={() => setPage('offers')}>Offers</button></div>
        <div className="offers-topbar">
          <label className="offers-search"><Search size={20} /><input value={offersSearch} onChange={(event) => setOffersSearch(event.target.value)} placeholder="Search for dishes..." aria-label="Search offers" />{offersSearch && <button className="icon-button subtle" onClick={() => setOffersSearch('')} aria-label="Clear offer search"><X size={16} /></button>}</label>
        </div>
        <OffersFilter active={offerFilter} setActive={setOfferFilter} counts={offerCounts} sortBy={offersSort} setSortBy={setOffersSort} open={offersFiltersOpen} setOpen={setOffersFiltersOpen} draft={offerFilterDraft} setDraft={setOfferFilterDraft} apply={() => { setOfferFacetFilters(offerFilterDraft); setOffersFiltersOpen(false) }} clear={() => { const empty = { diet: 'all', cuisine: 'all', price: 'all', rating: 'all' }; setOfferFilterDraft(empty); setOfferFacetFilters(empty) }} />
        <div className="offers-grid grid gap-4 sm:gap-5">
          {visibleOffers.map((offer) => <OfferCard key={offer.dishId} offer={offer} quantity={cart[offer.dishId] || 0} onQuantityChange={(delta) => setQuantity(offer.dishId, delta, delta > 0 ? offer : null)} />)}
          {!visibleOffers.length && <div className="offers-empty"><Search size={25} /><h2>No offers found</h2><p>Try another search or switch to a different offer filter.</p><button onClick={() => { setOffersSearch(''); setOfferFilter('All Offers') }}>Show all offers</button></div>}
        </div>
      </main> : page === 'menu' ? <main className="menu-area" id="menu">
        <div className="mobile-brand"><a className="brand" href="#menu"><span className="brand-mark"><ChefHat size={25} /></span><span className="brand-type"><strong>Tasty <i>Bites</i></strong><small>RESTAURANT</small></span></a><button className="mobile-cart" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${itemCount} items`}><ShoppingCart size={20} />{itemCount > 0 && <b>{itemCount}</b>}</button></div>
        <div className="mobile-page-nav"><button className="selected" onClick={() => setPage('menu')}>Menu</button><button onClick={() => setPage('orders')}>My Orders</button></div>
        <div className="search-row">
          <label className="search-box"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for dishes..." aria-label="Search dishes" />{query && <button aria-label="Clear search" className="icon-button subtle" onClick={() => setQuery('')}><X size={16} /></button>}</label>
        </div>
        <div className="menu-nav-row">
          <div className="category-row" role="tablist" aria-label="Menu categories">
            {categories.map(({ name, icon: Icon }) => <button key={name} role="tab" aria-selected={category === name} className={`category-chip ${category === name ? 'chosen' : ''}`} onClick={() => setCategory(name)}><Icon size={18} strokeWidth={2} /><span>{name}</span></button>)}
          </div>
          <div className="menu-control-group">
          <div className="menu-filter-wrap">
            <button className={`filter-button ${Object.values(menuFacetFilters).some((value) => value !== 'all') || menuFiltersOpen ? 'selected' : ''}`} onClick={() => setMenuFiltersOpen((open) => !open)} aria-label="Filter menu dishes" aria-expanded={menuFiltersOpen} aria-controls="menu-filter-panel"><SlidersHorizontal size={18} /><span>Filters</span><ChevronDown size={14} className={menuFiltersOpen ? 'turned' : ''} /></button>
          </div>
          <label className="menu-sort"><ArrowUpDown size={17} /><span>Sort By</span><select value={menuSort} onChange={(event) => setMenuSort(event.target.value)} aria-label="Sort menu dishes"><option value="recommended">Recommended</option><option value="popular">Popular first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select><ChevronDown size={14} /></label>
          </div>
        </div>
        {menuFiltersOpen && <MenuFilterPanel draft={menuFilterDraft} setDraft={setMenuFilterDraft} clear={() => { const empty = { diet: 'all', cuisine: 'all', price: 'all', rating: 'all' }; setMenuFilterDraft(empty); setMenuFacetFilters(empty) }} apply={() => { setMenuFacetFilters(menuFilterDraft); setMenuFiltersOpen(false) }} />}
        <div className="section-heading"><div><h1>{category === 'All' ? 'All Items' : category}</h1><p>Fresh from our kitchen, made just for you.</p></div><span className="item-count">{visibleDishes.length} items</span></div>
        <div className="product-grid">
          {visibleDishes.map((dish) => (
            <article className="product-card" key={dish.id}>
              <div className="product-photo-wrap">
                <img className="product-photo" src={photo(dish.image, 1400)} alt={dish.name} loading={dish.id > 4 ? 'lazy' : 'eager'} decoding="async" />
                <span className={`diet-mark ${dish.veg ? 'veg' : 'nonveg'}`} title={dish.veg ? 'Vegetarian' : 'Non-vegetarian'}>{dish.veg ? <span /> : <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1 11 10H1L6 1Z" /></svg>}</span>
                <span className="rating-badge"><Star size={15} fill="currentColor" /> 4.4</span>
                {dish.off && <span className="discount-ribbon-wrap"><i className="discount-ribbon-tail" aria-hidden="true" /><span className="discount-ribbon"><b>{dish.off}</b></span></span>}
                {dish.popular && <span className="popular-tag"><Flame size={12} fill="currentColor" /> Popular</span>}
              </div>
              <div className="product-copy"><h2>{dish.name}</h2><p>{dish.description}</p><div className="product-footer"><div className="price-stack"><strong>{money(dish.price)}</strong>{dish.oldPrice && <del>{money(dish.oldPrice)}</del>}</div>{cart[dish.id] ? <div className="quantity-control" aria-label={`${dish.name} quantity`}><button onClick={() => setQuantity(dish.id, -1)} aria-label={`Remove one ${dish.name}`}><Minus size={15} /></button><span>{cart[dish.id]}</span><button onClick={() => setQuantity(dish.id, 1)} aria-label={`Add one ${dish.name}`}><Plus size={15} /></button></div> : <button className="add-button" onClick={() => setQuantity(dish.id, 1)}>Add <Plus size={15} strokeWidth={2.5} /></button>}</div></div>
            </article>
          ))}
          {!visibleDishes.length && <div className="empty-menu"><span><Search size={23} /></span><h2>No dishes found</h2><p>Try another search or choose a different category.</p><button onClick={() => { setQuery(''); setCategory('All'); const empty = { diet: 'all', cuisine: 'all', price: 'all', rating: 'all' }; setMenuFilterDraft(empty); setMenuFacetFilters(empty); setMenuSort('recommended') }}>Show all dishes</button></div>}
        </div>
        <footer className="menu-footer"><span>Good food, good mood.</span><span>Made with care <i>at Tasty Bites</i></span></footer>
      </main> : page === 'help' ? <main className="help-area" id="help">
        <div className="mobile-brand"><a className="brand" href="#menu" onClick={(event) => { event.preventDefault(); setPage('menu') }}><span className="brand-mark"><ChefHat size={25} /></span><span className="brand-type"><strong>Tasty <i>Bites</i></strong><small>RESTAURANT</small></span></a></div>
        <div className="mobile-page-nav offers-mobile-page-nav"><button onClick={() => setPage('menu')}>Menu</button><button onClick={() => { setPage('orders'); setOrdersPage(1) }}>My Orders</button><button className="selected" onClick={() => setPage('help')}>Help</button></div>
        <header className="help-heading"><h1>Help &amp; <em>Support</em></h1><p>Have a question or need assistance? We’re always ready to help you.</p></header>
        <div className="help-main-grid">
          <section className="help-panel faq-panel" aria-labelledby="faq-title">
            <div className="help-panel-heading"><span className="help-heading-icon orange"><CircleHelp size={24} /></span><div><h2 id="faq-title">Frequently Asked Questions</h2><p>Find quick answers to common questions</p></div><button className="help-view-all" onClick={() => setShowAllFaqs((show) => !show)}>{showAllFaqs ? 'View Less' : 'View All'} <ArrowRight size={16} /></button></div>
            <div className="faq-list">{helpFaqs.slice(0, showAllFaqs ? helpFaqs.length : 6).map(({ question, answer, icon: Icon, tone }, index) => <article className={`faq-item ${openFaq === index ? 'open' : ''}`} key={question}>
              <button className="faq-question" aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq((current) => current === index ? -1 : index)}><span className={`faq-item-icon ${tone}`}><Icon size={19} /></span><strong>{question}</strong><ChevronDown size={18} className="faq-chevron" /></button>
              {openFaq === index && <p className="faq-answer" id={`faq-answer-${index}`}>{answer}</p>}
            </article>)}</div>
          </section>
          <section className="help-panel contact-panel" aria-labelledby="contact-title">
            <div className="help-panel-heading"><span className="help-heading-icon orange"><MessageCircle size={23} /></span><div><h2 id="contact-title">Contact Us</h2><p>Still need help? Get in touch with our team.</p></div></div>
            <div className="support-contact-options">
              <button className="support-contact-option green" onClick={() => setPage('waiter')}><span><ConciergeBell size={22} /></span><strong>At your table</strong><small>Call restaurant staff</small><i>Call Waiter <ArrowRight size={14} /></i></button>
              <button className="support-contact-option orange" onClick={() => { setPage('orders'); setOrdersPage(1) }}><span><PackageCheck size={22} /></span><strong>Order help</strong><small>View recent orders</small><i>My Orders <ArrowRight size={14} /></i></button>
              <a className="support-contact-option blue" href={`mailto:${supportEmail}`}><span><Mail size={22} /></span><strong>Email Us</strong><small>{supportEmail}</small><i>Send Email <ArrowRight size={14} /></i></a>
            </div>
            <div className="support-form-divider"><span>or send us a message</span></div>
            <form className="support-form" ref={supportFormRef} onSubmit={submitSupportMessage}>
              <div className="support-input-row"><label><Users size={16} /><input name="name" placeholder="Your Name" aria-label="Your name" required /></label><label><ConciergeBell size={16} /><input name="phone" type="tel" placeholder="Your Mobile Number" aria-label="Your mobile number" required /></label></div>
              <label><Mail size={16} /><input name="email" type="email" placeholder="Your Email (Optional)" aria-label="Your email (optional)" /></label>
              <label className="support-message-field"><MessageCircle size={16} /><textarea name="message" placeholder="Write your message here..." aria-label="Your message" required rows={3} /></label>
              <div className="support-form-footer"><span>Topic: {supportTopic}</span><button type="submit"><Send size={18} /> Send Message</button></div>
              {supportFeedback && <p className="support-feedback" role="status">{supportFeedback}</p>}
            </form>
          </section>
        </div>
        <section className="help-panel more-help-panel" aria-labelledby="more-help-title">
          <div className="help-panel-heading"><span className="help-heading-icon orange"><LifeBuoy size={23} /></span><div><h2 id="more-help-title">More Help Options</h2><p>Choose a topic and we’ll help you get to the right place</p></div></div>
          <div className="help-topic-grid">{helpTopics.map(({ title, description, icon: Icon, tone, subject }) => <button key={title} className={`help-topic ${tone}`} onClick={() => selectSupportTopic(subject)}><span className="help-topic-icon"><Icon size={23} /></span><span className="help-topic-copy"><strong>{title}</strong><small>{description}</small></span><ChevronRight size={19} /></button>)}</div>
        </section>
      </main> : page === 'waiter' ? <main className="waiter-area" id="waiter">
        <div className="mobile-brand"><a className="brand" href="#menu" onClick={(event) => { event.preventDefault(); setPage('menu') }}><span className="brand-mark"><ChefHat size={25} /></span><span className="brand-type"><strong>Tasty <i>Bites</i></strong><small>RESTAURANT</small></span></a><button className="mobile-cart" onClick={() => { setPage('menu'); setCartOpen(true) }} aria-label={`Open cart, ${itemCount} items`}><ShoppingCart size={20} />{itemCount > 0 && <b>{itemCount}</b>}</button></div>
        <div className="mobile-page-nav"><button onClick={() => setPage('menu')}>Menu</button><button onClick={() => setPage('orders')}>My Orders</button><button className="selected" onClick={() => setPage('waiter')}>Call Waiter</button></div>
        <section className="waiter-card" aria-labelledby="waiter-title">
          <BellAnimation ringing={bellRinging} />
          <h1 id="waiter-title"><span>Call</span> <em>Waiter</em></h1>
          <p className="waiter-subtitle">Tap the button and our staff will be with you shortly.</p>
          {qrTableId && <p className="waiter-table">Table {qrTableId}</p>}
          <button className="waiter-call-button" onClick={callWaiter} disabled={waiterState === 'loading'}>
            {waiterState === 'loading' ? <><span className="waiter-spinner" /> Sending request…</> : <><ConciergeBell size={23} /><span>Call Waiter</span><i><ArrowRight size={22} /></i></>}
          </button>
          <div className={`waiter-feedback ${waiterState}`} role="status" aria-live="polite">
            {waiterState === 'success' ? <><strong>Waiter Called Successfully!</strong><span>{waiterMessage}</span></> : waiterState === 'error' ? <span>{waiterMessage}</span> : null}
          </div>
        </section>
      </main> : <main className="orders-area" id="orders">
        <div className="mobile-brand"><a className="brand" href="#menu" onClick={(event) => { event.preventDefault(); setPage('menu') }}><span className="brand-mark"><ChefHat size={25} /></span><span className="brand-type"><strong>Tasty <i>Bites</i></strong><small>RESTAURANT</small></span></a><button className="mobile-cart" onClick={() => { setPage('menu'); setCartOpen(true) }} aria-label={`Open cart, ${itemCount} items`}><ShoppingCart size={20} />{itemCount > 0 && <b>{itemCount}</b>}</button></div>
        <div className="mobile-page-nav"><button onClick={() => setPage('menu')}>Menu</button><button className="selected" onClick={() => setPage('orders')}>My Orders</button></div>
        <div className="orders-toolbar"><label className="orders-search"><Search size={19} /><input value={orderQuery} onChange={(event) => { setOrderQuery(event.target.value); setOrdersPage(1) }} placeholder="Search by Order ID, Table No, or items..." aria-label="Search orders" />{orderQuery && <button className="icon-button subtle" aria-label="Clear search" onClick={() => setOrderQuery('')}><X size={16} /></button>}</label><label className="date-select"><CalendarDays size={18} /><select value={dateRange} onChange={(event) => setDateRange(event.target.value)} aria-label="Date range"><option>Last 30 days</option><option>Last 7 days</option><option>All time</option></select><ChevronDown size={15} /></label></div>
        <header className="orders-heading"><h1>My Orders</h1><p>View and track all your restaurant orders</p></header>
        <div className="order-summary">
          <article className="summary-card summary-total"><span className="summary-icon"><PackageCheck size={26} /></span><div><strong>{orderCounts.total}</strong><span>Total Orders</span></div><ChartIcon /></article>
          <article className="summary-card summary-complete"><span className="summary-icon"><CheckCircle2 size={29} /></span><div><strong>{orderCounts.completed}</strong><span>Completed</span></div></article>
          <article className="summary-card summary-delivered"><span className="summary-icon"><Truck size={29} /></span><div><strong>{orderCounts.delivered}</strong><span>Delivered</span></div></article>
          <article className="summary-card summary-cancelled"><span className="summary-icon"><CircleX size={29} /></span><div><strong>{orderCounts.cancelled}</strong><span>Cancelled</span></div></article>
        </div>
        <div className="orders-controls"><div className="order-type-tabs" role="tablist" aria-label="Filter by order type">{[{ label: 'All', count: orderCounts.total, icon: ListIcon }, { label: 'Dine-in', count: orderCounts.dineIn, icon: Utensils }, { label: 'Delivery', count: orderCounts.delivery, icon: Truck }].map(({ label, count, icon: Icon }) => <button key={label} className={`order-tab ${orderTypeFilter === label ? 'active' : ''}`} onClick={() => { setOrderTypeFilter(label); setOrdersPage(1) }} role="tab" aria-selected={orderTypeFilter === label}><Icon size={19} />{label} ({count})</button>)}</div><div className="order-selects"><label className="filter-select"><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setOrdersPage(1) }} aria-label="Filter by order status"><option>All Status</option><option>Completed</option><option>Delivered</option><option>Preparing</option><option>Cancelled</option></select><ChevronDown size={15} /></label><label className="date-select date-secondary"><CalendarDays size={17} /><select value={dateRange} onChange={(event) => setDateRange(event.target.value)} aria-label="Date range"><option>Last 30 days</option><option>Last 7 days</option><option>All time</option></select><ChevronDown size={15} /></label></div></div>
        <div className="orders-table-wrap"><table className="orders-table"><thead><tr><th>#</th><th>Order ID</th><th>Type</th><th>Table / Address</th><th>Items</th><th>Amount</th><th>Date &amp; Time</th><th>Status</th><th>Actions</th></tr></thead><tbody>{pageOrders.map((order, index) => <tr key={order.id} className={order.status === 'Preparing' ? 'row-preparing' : ''}><td>{(ordersPage - 1) * 10 + index + 1}</td><td className="order-id">#{order.id}</td><td><span className={`order-kind ${order.type === 'Dine-in' ? 'kind-dine' : 'kind-delivery'}`}>{order.type === 'Dine-in' ? <Utensils size={15} /> : <House size={15} />}{order.type}</span></td><td className="order-place">{order.place}</td><td><div className="order-thumbs">{order.items.map((dishId) => { const dish = dishes.find((item) => item.id === dishId); return <img key={dishId} src={photo(dish.image, 90)} alt={dish.name} title={dish.name} /> })}{order.extra > 0 && <span>+{order.extra}</span>}</div><small className="order-item-count">{order.items.length + order.extra} items</small></td><td className="order-amount">{money(order.amount)}</td><td className="order-date">{order.date}<small>{order.time}</small></td><td><StatusBadge status={order.status} /></td><td><button className="view-order" onClick={() => setSelectedOrder(order)}><Eye size={16} />View <ChevronRight size={16} /></button></td></tr>)}{!pageOrders.length && <tr><td colSpan="9"><div className="orders-empty"><Search size={22} /><strong>No matching orders</strong><span>Try another search or change your filters.</span><button onClick={() => { setOrderQuery(''); setOrderTypeFilter('All'); setStatusFilter('All Status') }}>Clear filters</button></div></td></tr>}</tbody></table></div>
        <div className="orders-pagination"><span>Showing {filteredOrders.length ? (ordersPage - 1) * 10 + 1 : 0}–{Math.min(ordersPage * 10, filteredOrders.length)} of {filteredOrders.length} orders</span><div><button aria-label="Previous page" disabled={ordersPage === 1} onClick={() => setOrdersPage((n) => n - 1)}><ChevronLeft size={18} /></button>{filteredOrders.length > 10 ? <><button className={ordersPage === 1 ? 'page-current' : ''} aria-current={ordersPage === 1 ? 'page' : undefined} onClick={() => setOrdersPage(1)}>1</button><button className={ordersPage === 2 ? 'page-current' : ''} aria-current={ordersPage === 2 ? 'page' : undefined} onClick={() => setOrdersPage(2)}>2</button></> : <button className="page-current" aria-current="page">1</button>}<button aria-label="Next page" disabled={ordersPage * 10 >= filteredOrders.length} onClick={() => setOrdersPage((n) => n + 1)}><ChevronRight size={18} /></button></div></div>
      </main>}

      <aside className={`cart-panel ${cartOpen ? 'cart-panel-open' : ''} ${page === 'orders' || page === 'help' ? 'cart-panel-hidden' : ''}`} id="cart" aria-label="Your cart">
        <div className="cart-header"><div><span className="cart-icon"><ShoppingCart size={24} /></span><h2>Your Cart <small>({itemCount} {itemCount === 1 ? 'item' : 'items'})</small></h2></div><div className="cart-header-actions">{itemCount > 0 && <button className="clear-button" onClick={clearCart}><Trash2 size={15} /> Clear All</button>}<button className="icon-button close-cart" aria-label="Close cart" onClick={() => setCartOpen(false)}><X size={19} /></button></div></div>
        <div className="cart-content">
          <div className="cart-scroll">
          {cartEntries.length ? <div className="cart-items">{cartEntries.map((dish) => <article className="cart-item" key={dish.id}><img src={photo(dish.image, 180)} alt="" /><div className="cart-item-main"><div className="cart-item-title"><div><h3>{dish.name}</h3><strong>{money(dish.price)}</strong></div><button className="remove-item" aria-label={`Remove ${dish.name}`} onClick={() => setQuantity(dish.id, -cart[dish.id])}><Trash2 size={17} /></button></div><p>{dish.description}</p><div className="quantity-control cart-quantity"><button onClick={() => setQuantity(dish.id, -1)} aria-label={`Remove one ${dish.name}`}><Minus size={14} /></button><span>{cart[dish.id]}</span><button onClick={() => setQuantity(dish.id, 1)} aria-label={`Add one ${dish.name}`}><Plus size={14} /></button></div></div></article>)}</div> : <div className="cart-empty"><span><ShoppingCart size={26} /></span><h3>Your cart is waiting</h3><p>Add something delicious from the menu.</p></div>}

          <label className="instructions-label" htmlFor="instructions"><span><Pencil size={15} /> Special Instructions <small>(Optional)</small></span><span className="char-count">{instructions.length}/200</span></label>
          <textarea id="instructions" maxLength={200} value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="e.g. Less spicy, no onion, extra chutney..." />

          <h3 className="order-heading">Order Type</h3>
          <div className="order-types">
            {[{ name: 'Dine-in', caption: 'We will serve at your table', icon: Utensils }, { name: 'Home Delivery', caption: 'Get it delivered to your address', icon: ShoppingCart }].map(({ name, caption, icon: Icon }) => <button key={name} className={`order-type ${orderType === name ? 'order-selected' : ''}`} onClick={() => setOrderType(name)} aria-pressed={orderType === name}><Icon size={31} /><span><strong>{name}</strong><small>{caption}</small></span><i className="radio"><Check size={11} /></i></button>)}
          </div>

          <section className="bill-card"><h3><span><span className="bill-icon"><Pencil size={17} /></span>Bill Details</span><small>INR</small></h3><div><span>Item Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span><strong>{money(subtotal)}</strong></div><div><span>GST (5%)</span><strong>{money(tax)}</strong></div><div className="bill-total"><span>Total Amount</span><strong>{money(subtotal + tax)}</strong></div></section>
          </div>
          <div className="cart-checkout">
            <button className="place-order" onClick={placeOrder}>{itemCount ? `Place Order · ${money(subtotal + tax)}` : 'Add items to order'} <ArrowRight size={21} /></button>
            <p className="secure-note"><Check size={13} /> You can review your order before it’s sent</p>
          </div>
        </div>
      </aside>
      {cartOpen && <button className="cart-scrim" aria-label="Close cart overlay" onClick={() => setCartOpen(false)} />}
      {selectedOrder && <div className="order-modal-backdrop" onClick={() => setSelectedOrder(null)}><section className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-modal-title" onClick={(event) => event.stopPropagation()}><button className="icon-button modal-close" onClick={() => setSelectedOrder(null)} aria-label="Close order details"><X size={19} /></button><span className="modal-order-icon"><PackageCheck size={25} /></span><h2 id="order-modal-title">Order #{selectedOrder.id}</h2><StatusBadge status={selectedOrder.status} /><div className="modal-meta"><span>{selectedOrder.type}</span><span>{selectedOrder.place}</span><span>{selectedOrder.date} · {selectedOrder.time}</span></div><div className="modal-dishes">{selectedOrder.items.map((dishId, index) => { const dish = dishes.find((item) => item.id === dishId); return <div key={`${dishId}-${index}`}><img src={photo(dish.image, 100)} alt="" /><span>{dish.name}</span><strong>{money(dish.price)}</strong></div> })}</div><div className="modal-total"><span>Order total</span><strong>{money(selectedOrder.amount)}</strong></div><button className="modal-done" onClick={() => setSelectedOrder(null)}>Done</button></section></div>}
      {notice && <div className="toast" role="status"><span><Check size={16} /></span>{notice}</div>}
    </div>
  )
}

export default App
