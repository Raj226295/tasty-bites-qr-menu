import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowDownWideNarrow, Bell, BellRing, Bike, CalendarDays, Check, CheckCircle2, ChefHat, ChevronDown, Clock3, CreditCard, Eye, Grid2X2, LayoutDashboard, ListFilter, LogOut, MapPin, Menu, Package, PackageCheck, Phone, Plus, Printer, QrCode, RefreshCw, Search, Settings, ShoppingBag, Sofa, Sparkles, Store, Table2, TrendingUp, Truck, Users, Utensils, Volume2, X, Navigation, LocateFixed, UserRound, ClipboardCheck } from 'lucide-react'
import './AdminDashboard.css'
import './AdminClay.css'
import MenuManagementPage from './MenuManagementPage'
import CategoriesManagementPage from './CategoriesManagementPage'
import TableManagementPage from './TableManagementPage'
import CustomersManagementPage from './CustomersManagementPage'
import PaymentManagementPage from './PaymentManagementPage'
import AnimatedCounter from './AnimatedCounter'
import ReportsAnalyticsPage from './ReportsAnalyticsPage'
import SettingsManagementPage from './SettingsManagementPage'

const nav = [['Dashboard', LayoutDashboard], ['Live Orders', ShoppingBag], ['Menu Management', Utensils], ['Categories', Grid2X2], ['Table Management', Table2], ['Customers', Users], ['Delivery Management', Truck], ['Payments', CreditCard], ['Reports & Analytics', TrendingUp], ['Settings', Settings]]
const initialOrders = [
  { id: '#1001', age: '2 mins ago', place: 'Table 03', type: 'Dine-in', items: '2 × Burger, 1 × Cold Coffee', price: 350, status: 'New', image: 'photo-1568901346375-23c9450c58cd' },
  { id: '#1000', age: '5 mins ago', place: 'Rahul Kumar', customer: 'Rahul Kumar', phone: '+91 98765 43210', address: 'Kankarbagh, Patna, Bihar', lat: 25.5948, lng: 85.1376, type: 'Delivery', items: '1 × Pizza, 1 × Garlic Bread', price: 580, status: 'Preparing', image: 'photo-1579751626657-72bc17010498' },
  { id: '#0999', age: '12 mins ago', place: 'Table 07', type: 'Dine-in', items: '1 × Biryani, 2 × Coke', price: 420, status: 'Accepted', image: 'photo-1589302168068-964664d93dc0' },
  { id: '#0998', age: '18 mins ago', place: 'Priya Singh', customer: 'Priya Singh', phone: '+91 91234 56789', address: 'Boring Road, Patna, Bihar', lat: 25.6104, lng: 85.1052, type: 'Delivery', items: '2 × Pasta, 1 × Mojito', price: 650, status: 'Ready', image: 'photo-1645112411341-6c4fd023714a' },
  { id: '#0997', age: '25 mins ago', place: 'Table 01', type: 'Dine-in', items: '1 × Pizza, 1 × Fries', price: 320, status: 'Served', image: 'photo-1579751626657-72bc17010498' },
  { id: '#0996', age: '32 mins ago', place: 'Table 04', type: 'Dine-in', items: '1 × Chicken Tikka, 1 × Naan', price: 480, status: 'Completed', image: 'photo-1599487488170-d11ec9c172f0' },
  { id: '#0995', age: '38 mins ago', place: 'Amit Verma', customer: 'Amit Verma', address: 'Rajendra Nagar, Patna, Bihar', lat: 25.6022, lng: 85.1578, type: 'Delivery', items: '1 × Biryani, 1 × Lassi', price: 390, status: 'Out for Delivery', rider: 'Ravi Kumar', image: 'photo-1589302168068-964664d93dc0' },
  { id: '#0994', age: '44 mins ago', place: 'Neha Patel', customer: 'Neha Patel', address: 'Gandhi Maidan, Patna, Bihar', lat: 25.6208, lng: 85.1422, type: 'Delivery', items: '1 × Paneer Tikka, 2 × Dosa', price: 560, status: 'Packed', image: 'photo-1567188040759-fb8a883dc6d8' },
  { id: '#0993', age: '51 mins ago', place: 'Table 02', type: 'Dine-in', items: '2 × Masala Dosa, 1 × Coffee', price: 450, status: 'New', image: 'photo-1668236543090-82eba5ee5976' },
  { id: '#0992', age: '58 mins ago', place: 'Table 06', type: 'Dine-in', items: '1 × Pasta Alfredo, 1 × Fries', price: 390, status: 'Preparing', image: 'photo-1645112411341-6c4fd023714a' },
  { id: '#0991', age: '1 hr ago', place: 'Table 08', type: 'Dine-in', items: '1 × Farmhouse Pizza', price: 320, status: 'Ready', image: 'photo-1579751626657-72bc17010498' },
  { id: '#0990', age: '1 hr ago', place: 'Kiran Das', type: 'Delivery', items: '1 × Burger, 1 × Fries', price: 300, status: 'Cancelled', image: 'photo-1568901346375-23c9450c58cd' },
]
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=120&q=80`
const kotItemImage = (name, fallback) => {
  const item = name.toLowerCase()
  const known = [
    [/burger/, 'photo-1568901346375-23c9450c58cd'],
    [/coffee|cappuccino|mocha/, 'photo-1461023058943-07fcbe16d735'],
    [/pizza/, 'photo-1579751626657-72bc17010498'],
    [/biryani/, 'photo-1589302168068-964664d93dc0'],
    [/pasta/, 'photo-1645112411341-6c4fd023714a'],
    [/fries|potato/, 'photo-1573080496219-bb080dd4f877'],
    [/tikka|paneer/, 'photo-1567188040759-fb8a883dc6d8'],
    [/dosa/, 'photo-1668236543090-82eba5ee5976'],
    [/chicken/, 'photo-1599487488170-d11ec9c172f0'],
  ].find(([pattern]) => pattern.test(item))
  return img(known?.[1] || fallback)
}
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const chartData = [{ t: '8 AM', o: 4, d: 1, v: 0 }, { t: '10 AM', o: 7, d: 2, v: 1 }, { t: '12 PM', o: 8, d: 2, v: 2 }, { t: '2 PM', o: 14, d: 5, v: 2 }, { t: '4 PM', o: 8, d: 3, v: 1 }, { t: '6 PM', o: 7, d: 3, v: 1 }, { t: '8 PM', o: 16, d: 7, v: 2 }, { t: '10 PM', o: 10, d: 4, v: 1 }, { t: '11 PM', o: 12, d: 5, v: 1 }]

const deliveryRiders = ['Ravi Kumar', 'Amit Singh', 'Suresh Das']
const deliverySteps = ['Preparing', 'Ready', 'Out for Delivery', 'Delivered']
const deliveryStatus = (status) => status === 'New' || status === 'Accepted' ? 'Pending' : status === 'Packed' ? 'Ready' : status
const formatDeliveryAddress = (address) => {
  if (typeof address === 'string') return address.trim()
  if (!address || typeof address !== 'object') return ''
  return [address.house, address.street, address.area, address.landmark, address.city, address.state, address.pincode].filter(Boolean).join(', ')
}

function DeliveryManagementPage({ orders, onAdvance, onAssign, onCreate }) {
  const [selectedId, setSelectedId] = useState('')
  const [filter, setFilter] = useState('All Orders')
  const [query, setQuery] = useState('')
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [notice, setNotice] = useState('')
  const [mapProvider, setMapProvider] = useState('google')
  const [mapFailed, setMapFailed] = useState(false)
  const deliveries = orders.filter((order) => order.type === 'Delivery' || order.type === 'Home Delivery')
  useEffect(() => {
    if (!deliveries.some((order) => order.id === selectedId)) setSelectedId(deliveries[0]?.id || '')
  }, [deliveries, selectedId])
  const selected = deliveries.find((order) => order.id === selectedId) || deliveries[0]
  const visibleOrders = deliveries.filter((order) => {
    const status = deliveryStatus(order.status)
    const matchesFilter = filter === 'All Orders' || (filter === 'Pending' ? ['Pending', 'Preparing'].includes(status) : status === filter)
    return matchesFilter && `${order.id} ${order.place} ${order.customer || ''} ${order.phone || ''} ${order.address || ''}`.toLowerCase().includes(query.toLowerCase())
  })
  const activeCount = deliveries.filter((order) => !['Delivered', 'Cancelled', 'Completed'].includes(order.status)).length
  const assignedCount = deliveries.filter((order) => order.rider && !['Delivered', 'Cancelled', 'Completed'].includes(order.status)).length
  const nextStatus = (order) => {
    const status = deliveryStatus(order.status)
    if (status === 'Pending') return 'Preparing'
    if (status === 'Preparing') return 'Ready'
    if (status === 'Ready') return 'Out for Delivery'
    if (status === 'Out for Delivery') return 'Delivered'
    return null
  }
  const setFlash = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600) }
  const fullAddress = formatDeliveryAddress(selected?.address || selected?.deliveryAddress) || 'Delivery address not provided'
  const locationAvailable = Boolean(selected && ((selected.lat != null && selected.lng != null) || formatDeliveryAddress(selected.address || selected.deliveryAddress)))
  const mapQuery = encodeURIComponent(selected?.lat != null && selected?.lng != null ? `${selected.lat},${selected.lng}` : `${fullAddress}, India`)
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=driving`
  const mapSrc = mapProvider === 'google'
    ? `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`
    : selected?.lat != null && selected?.lng != null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${selected.lng - 0.035}%2C${selected.lat - 0.025}%2C${selected.lng + 0.035}%2C${selected.lat + 0.025}&layer=mapnik&marker=${selected.lat}%2C${selected.lng}`
      : `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`
  useEffect(() => { setMapFailed(false) }, [selected?.id, mapProvider, mapSrc])
  const handleCreate = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const customer = String(form.get('customer')).trim()
    const address = String(form.get('address')).trim()
    const id = `#${Math.max(1000, ...orders.map((order) => Number(String(order.id).replace(/\D/g, '')) || 0)) + 1}`
    onCreate({ id, age: 'Just now', place: customer, customer, phone: String(form.get('phone')).trim(), address, type: 'Delivery', items: '1 × New order', price: Number(form.get('amount')), status: 'New', image: 'photo-1579751626657-72bc17010498', lat: Number(form.get('lat')) || undefined, lng: Number(form.get('lng')) || undefined })
    setSelectedId(id); setFilter('All Orders'); setQuery(''); setShowNewOrder(false); setFlash(`Delivery order ${id} created`)
  }
  return <div className="delivery-page">
    <header className="delivery-heading"><div><h1>Delivery Management</h1><p>Manage orders, assign riders and track deliveries</p></div><button className="delivery-primary" onClick={() => setShowNewOrder((open) => !open)}><span className="delivery-button-icon"><Plus size={17}/></span>{showNewOrder ? 'Close form' : 'New Delivery Order'}</button></header>
    {showNewOrder && <form className="delivery-create-form" onSubmit={handleCreate}><div className="delivery-create-title"><div><strong>Create a delivery order</strong><small>Add an address to open its location on the map.</small></div><button type="button" onClick={() => setShowNewOrder(false)} aria-label="Close form"><X size={19}/></button></div><label>Customer name<input name="customer" placeholder="e.g. Aman Kumar" required/></label><label>Phone<input name="phone" type="tel" placeholder="10-digit phone number" required/></label><label className="delivery-address-field">Delivery address<input name="address" placeholder="House, street, area, city, PIN" required/></label><label>Amount (₹)<input name="amount" type="number" min="1" step="1" placeholder="420" required/></label><div className="delivery-create-coordinates"><label>Latitude <input name="lat" type="number" step="any" placeholder="Optional"/></label><label>Longitude <input name="lng" type="number" step="any" placeholder="Optional"/></label></div><button className="delivery-primary" type="submit"><Check size={17}/>Create order</button></form>}
    <section className="delivery-summary" aria-label="Delivery summary"><article><span className="delivery-stat-icon orange"><Package size={20}/></span><div><strong>{deliveries.length}</strong><small>Total delivery orders</small></div></article><article><span className="delivery-stat-icon green"><Bike size={20}/></span><div><strong>{activeCount}</strong><small>Active deliveries</small></div></article><article><span className="delivery-stat-icon blue"><CheckCircle2 size={20}/></span><div><strong>{deliveries.filter((order) => ['Delivered', 'Completed'].includes(order.status)).length}</strong><small>Delivered</small></div></article><article><span className="delivery-stat-icon red"><UserRound size={20}/></span><div><strong>{Math.max(0, activeCount - assignedCount)}</strong><small>Need a rider</small></div></article></section>
    <div className="delivery-toolbar"><div className="delivery-tabs">{['All Orders', 'Pending', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'].map((tab) => <button type="button" key={tab} className={filter === tab ? 'active' : ''} onClick={() => setFilter(tab)}>{tab}<b>{tab === 'All Orders' ? deliveries.length : deliveries.filter((order) => tab === 'Pending' ? ['New', 'Accepted', 'Preparing'].includes(order.status) : deliveryStatus(order.status) === tab).length}</b></button>)}</div><label className="delivery-search"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order, customer, address…"/></label></div>
    <div className="delivery-workspace"><section className="delivery-order-list" aria-label="Delivery orders">{visibleOrders.length ? visibleOrders.map((order) => <button type="button" key={order.id} className={`delivery-order-row ${selected?.id === order.id ? 'selected' : ''}`} onClick={() => setSelectedId(order.id)}><span className="delivery-order-thumb"><img src={img(order.image)} alt=""/></span><span className="delivery-order-copy"><strong>{order.id} <small>{order.age || ''}</small></strong><b>{order.customer || order.place}</b><small className="delivery-address-preview"><MapPin size={12}/>{formatDeliveryAddress(order.address || order.deliveryAddress) || 'Address not provided'}</small><small>{order.items}</small></span><span className="delivery-order-meta"><b>₹{Number(order.price || order.amount || 0).toLocaleString('en-IN')}</b><i className={`delivery-status status-${deliveryStatus(order.status).toLowerCase().replaceAll(' ', '-')}`}>{deliveryStatus(order.status)}</i><small>{order.rider || 'Rider needed'}</small></span></button>) : <div className="delivery-empty"><Truck size={28}/><strong>No matching delivery orders</strong><span>Try another filter or add a new delivery order.</span></div>}</section>
      <section className="delivery-map-panel"><div className="delivery-map-heading"><div><h2><span className="delivery-map-icon"><Navigation size={16}/></span>Delivery location</h2><span>{selected ? `Order ${selected.id} · ${selected.customer || selected.place}` : 'Select an order to view its location'}</span></div><div className="delivery-map-tools">{selected && locationAvailable && <div className="delivery-map-providers" aria-label="Map provider"><button type="button" className={mapProvider === 'google' ? 'active' : ''} onClick={() => setMapProvider('google')}>Google</button><button type="button" className={mapProvider === 'osm' ? 'active' : ''} disabled={selected.lat == null || selected.lng == null} onClick={() => setMapProvider('osm')}>OSM</button></div>}{selected && locationAvailable && <a className="delivery-map-directions" href={directionsUrl} target="_blank" rel="noreferrer" aria-label="Get directions to delivery address" title="Get directions"><Navigation size={16}/></a>}</div></div>{selected ? <><div className="delivery-map-frame">{!locationAvailable ? <div className="delivery-map-fallback"><span className="delivery-map-fallback-pin"><MapPin size={25}/></span><strong>Delivery address missing</strong><p>Add this order’s street address to show its map location.</p></div> : mapFailed ? <div className="delivery-map-fallback"><span className="delivery-map-fallback-pin"><MapPin size={25}/></span><strong>Map could not load here</strong><p>{fullAddress}</p><a href={directionsUrl} target="_blank" rel="noreferrer">Open directions in Google Maps <Navigation size={15}/></a></div> : <iframe key={`${selected.id}-${mapProvider}`} title={`Map showing delivery for ${selected.id}`} src={mapSrc} loading="eager" onError={() => setMapFailed(true)}/>}</div><div className="delivery-map-caption"><MapPin size={15}/><span>{fullAddress}</span>{locationAvailable && <a href={directionsUrl} target="_blank" rel="noreferrer">Directions <Navigation size={13}/></a>}</div></> : <div className="delivery-map-empty"><MapPin size={24}/><span>Choose an order to load its map</span></div>}</section>
      <aside className="delivery-detail-panel">{selected ? <><div className="delivery-detail-top"><div><small>ORDER DETAILS</small><h2>{selected.id}</h2></div><span className={`delivery-status status-${deliveryStatus(selected.status).toLowerCase().replaceAll(' ', '-')}`}>{deliveryStatus(selected.status)}</span></div><div className="delivery-customer"><span className="delivery-customer-avatar">{(selected.customer || selected.place || 'C').split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><strong>{selected.customer || selected.place}</strong><a href={selected.phone ? `tel:${selected.phone.replace(/[^+\d]/g, '')}` : undefined}>{selected.phone || 'Phone not provided'}</a></div>{selected.phone && <a className="delivery-icon-button" href={`tel:${selected.phone.replace(/[^+\d]/g, '')}`} aria-label="Call customer"><Phone size={16}/><span>Call</span></a>}</div><div className="delivery-address-detail"><strong><span className="delivery-section-icon"><MapPin size={14}/></span>Delivery address</strong><p><MapPin size={16}/>{fullAddress}</p></div><div className="delivery-items-detail"><strong><span className="delivery-section-icon items"><Package size={14}/></span>Order items</strong><p>{selected.items || 'Items not listed'}</p><b>Order total <span>₹{Number(selected.price || selected.amount || 0).toLocaleString('en-IN')}</span></b></div><label className="delivery-rider-select"><span><span className="delivery-section-icon rider"><Bike size={14}/></span>Assign rider</span><select value={selected.rider || ''} onChange={(event) => { onAssign(selected.id, event.target.value); setFlash(event.target.value ? `${event.target.value} assigned to ${selected.id}` : 'Rider unassigned') }}><option value="">Unassigned</option>{deliveryRiders.map((rider) => <option key={rider}>{rider}</option>)}</select></label><div className="delivery-step-list">{deliverySteps.map((step, index) => { const at = deliverySteps.indexOf(deliveryStatus(selected.status)); const isDone = at >= index; return <span key={step} className={isDone ? 'done' : ''}><i>{isDone ? <Check size={12}/> : index + 1}</i>{step}</span> })}</div><div className="delivery-detail-actions">{nextStatus(selected) && <button className="delivery-next-action" onClick={() => { if (nextStatus(selected) === 'Out for Delivery' && !selected.rider) { setFlash('Assign a rider before dispatching this order'); return } onAdvance(selected.id, nextStatus(selected)); setFlash(`${selected.id} marked ${nextStatus(selected)}`) }}><span className="delivery-action-icon">{nextStatus(selected) === 'Out for Delivery' ? <Navigation size={15}/> : <Check size={15}/>}</span>{({ Preparing: 'Start Preparing', Ready: 'Mark Ready', 'Out for Delivery': 'Dispatch order', Delivered: 'Mark Delivered' })[nextStatus(selected)]}</button>}{!['Delivered', 'Cancelled', 'Completed'].includes(selected.status) && <button className="delivery-cancel-action" onClick={() => { onAdvance(selected.id, 'Cancelled'); setFlash(`${selected.id} cancelled`) }}><X size={15}/>Cancel</button>}</div></> : <div className="delivery-detail-empty">Select a delivery order to manage it.</div>}</aside>
    </div>{notice && <div className="delivery-toast" role="status">{notice}</div>}
  </div>
}

function LiveOrdersPage({ orders, onAdvance, onRefresh, onEditItems }) {
  const pageRef = useRef(null)
  const [selectedId, setSelectedId] = useState(orders[0]?.id)
  const [kind, setKind] = useState('All Orders')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('Newest first')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [sound, setSound] = useState(false)
  const [detailTab, setDetailTab] = useState('Order details')
  const [dateFilter, setDateFilter] = useState('Today')
  const [notice, setNotice] = useState('')
  const [notificationCount, setNotificationCount] = useState(3)
  const previousNewCount = useRef(orders.filter((order) => order.status === 'New').length)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const context = gsap.context(() => gsap.fromTo('.live-summary-item', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.34, stagger: 0.055, ease: 'power2.out' }), pageRef)
    return () => context.revert()
  }, [])
  useEffect(() => {
    if (!autoRefresh) return undefined
    const timer = window.setInterval(onRefresh, 3000)
    const sync = (event) => { if (event.key === 'tastybites-admin-orders') onRefresh() }
    window.addEventListener('storage', sync)
    return () => { window.clearInterval(timer); window.removeEventListener('storage', sync) }
  }, [autoRefresh, onRefresh])
  useEffect(() => {
    const newCount = orders.filter((order) => order.status === 'New').length
    const arrivals = newCount - previousNewCount.current
    if (arrivals > 0) {
      setNotificationCount((count) => count + arrivals)
      setNotice(`${arrivals} new order${arrivals === 1 ? '' : 's'} received`)
      window.setTimeout(() => setNotice(''), 3000)
      if (sound) {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext
          if (AudioContextClass) {
            const audio = new AudioContextClass()
            const oscillator = audio.createOscillator()
            const gain = audio.createGain()
            oscillator.frequency.value = 740
            gain.gain.setValueAtTime(0.08, audio.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.24)
            oscillator.connect(gain); gain.connect(audio.destination)
            oscillator.start(); oscillator.stop(audio.currentTime + 0.24)
            oscillator.onended = () => audio.close()
          }
        } catch { /* Sound is optional; visual alert still appears. */ }
      }
    }
    previousNewCount.current = newCount
  }, [orders, sound])
  const selected = orders.find((order) => order.id === selectedId) || orders[0]
  const filtered = orders.filter((order) => {
    const matchesKind = kind === 'All Orders' || order.type === kind
    const matchesStatus = statusFilter === 'All Statuses' || order.status === statusFilter
    const matchesQuery = `${order.id} ${order.place} ${order.items} ${order.phone || ''} ${order.customer || ''} ${order.table || ''}`.toLowerCase().includes(query.toLowerCase())
    const matchesDate = dateFilter !== 'Today' || !order.date || order.date === 'Today'
    return matchesKind && matchesStatus && matchesQuery && matchesDate
  })
  const visibleOrders = [...filtered].sort((a, b) => {
    if (sort === 'Newest first') return Number(b.id.replace(/\D/g, '')) - Number(a.id.replace(/\D/g, ''))
    if (sort === 'Oldest first') return Number(a.id.replace(/\D/g, '')) - Number(b.id.replace(/\D/g, ''))
    if (sort === 'Highest amount') return b.price - a.price
    if (sort === 'Lowest amount') return a.price - b.price
    return 0
  })
  const summary = [
    [ShoppingBag, 'Total Orders', orders.length, 'orange'],
    [BellRing, 'New Orders', orders.filter((order) => order.status === 'New').length, 'red'],
    [ChefHat, 'Preparing', orders.filter((order) => order.status === 'Preparing').length, 'amber'],
    [CheckCircle2, 'Ready', orders.filter((order) => order.status === 'Ready').length, 'green'],
    [Truck, 'Out for Delivery', orders.filter((order) => order.status === 'Out for Delivery').length, 'blue'],
    [PackageCheck, 'Completed', orders.filter((order) => order.status === 'Completed').length, 'slate'],
  ]
  const nextAction = selected?.status === 'New' ? ['Accept Order', 'Accepted'] : selected?.status === 'Accepted' ? ['Start Preparing', 'Preparing'] : selected?.status === 'Preparing' ? ['Mark Ready', 'Ready'] : selected?.status === 'Ready' ? [selected.type === 'Delivery' ? 'Pack Order' : 'Serve to Table', selected.type === 'Delivery' ? 'Packed' : 'Served'] : selected?.status === 'Packed' ? ['Out for Delivery', 'Out for Delivery'] : selected?.status === 'Out for Delivery' ? ['Mark Delivered', 'Delivered'] : selected?.status === 'Served' || selected?.status === 'Delivered' ? ['Complete Order', 'Completed'] : null
  const changeStatus = (order, requestedStatus) => {
    const routes = { New: 'Accepted', Accepted: 'Preparing', Preparing: 'Ready', Ready: order.type === 'Delivery' ? 'Packed' : 'Served', Packed: 'Out for Delivery', 'Out for Delivery': 'Delivered', Served: 'Completed', Delivered: 'Completed' }
    if (routes[order.status] !== requestedStatus) return
    if (order.status === 'New' && requestedStatus === 'Accepted' && !window.confirm(`Accept order ${order.id}?`)) return
    onAdvance(order.id, requestedStatus)
    setNotice(`${order.id} moved to ${requestedStatus}`)
    window.setTimeout(() => setNotice(''), 2400)
  }
  const reject = (order) => {
    if (!['New', 'Accepted', 'Preparing'].includes(order.status)) return
    if (order.status === 'Preparing' && !window.confirm('This order is already being prepared. Cancel it and notify the customer?')) return
    const reason = window.prompt('Enter a reason for rejecting this order:')
    if (!reason?.trim()) return
    onAdvance(order.id, 'Cancelled', reason.trim())
    setNotice(`Order ${order.id} cancelled`)
    window.setTimeout(() => setNotice(''), 2400)
  }
  const updateQuantity = (order, rowIndex, delta) => {
    if (!['New', 'Accepted'].includes(order.status)) return
    if (order.status === 'Accepted' && !window.confirm(`Update items for accepted order ${order.id}?`)) return
    const rows = order.items.split(', ').map((line) => {
      const match = line.match(/^(\d+)\s*×\s*(.+)$/)
      return { quantity: Number(match?.[1] || 1), name: match?.[2] || line }
    })
    rows[rowIndex].quantity = Math.max(1, rows[rowIndex].quantity + delta)
    const totalCount = rows.reduce((sum, row) => sum + row.quantity, 0)
    const baseSubtotal = Math.round(order.price / 1.05)
    const averageUnitPrice = baseSubtotal / Math.max(1, itemRows.reduce((sum, row) => sum + Number(row.quantity), 0))
    const nextPrice = Math.round(averageUnitPrice * totalCount * 1.05)
    onEditItems(order.id, rows.map((row) => `${row.quantity} × ${row.name}`).join(', '), nextPrice)
  }
  const printKot = (order) => {
    const paymentStatus = String(order.paymentStatus || 'pending').toLowerCase() === 'paid' ? 'PAID' : 'UNPAID'
    const totalAmount = Number(order.total ?? order.price ?? 0)
    const isDelivery = /delivery/i.test(order.type || '')
    const locationLabel = isDelivery ? 'Delivery Location' : 'Table No.'
    const addressData = order.address || order.deliveryAddress
    const deliveryAddress = typeof addressData === 'string'
      ? addressData
      : addressData && typeof addressData === 'object'
        ? [addressData.house, addressData.street, addressData.area, addressData.city, addressData.state, addressData.pincode].filter(Boolean).join(', ')
        : ''
    const customerName = order.customerName || order.customer?.fullName || (typeof order.customer === 'string' ? order.customer : '') || order.place || ''
    const customerPhone = order.phone || order.customerPhone || order.customer?.phone || ''
    const locationValue = isDelivery
      ? (deliveryAddress || 'Not provided')
      : (order.tableNumber || order.table || order.place || 'Not assigned')
    const rows = order.items.split(', ').map((line) => {
      const match = line.match(/^(\d+)\s*×\s*(.+)$/)
      const quantity = match?.[1] || '1'
      const name = match?.[2] || line
      return `<li><img src="${escapeHtml(kotItemImage(name, order.image))}" alt=""><span><b>${escapeHtml(quantity)} × ${escapeHtml(name)}</b></span></li>`
    }).join('')
    const ticket = window.open('', '_blank', 'width=420,height=620')
    if (!ticket) { setNotice('Allow pop-ups to print the kitchen ticket.'); return }
    ticket.document.write(`<html><head><title>KOT ${escapeHtml(order.id)}</title><style>*{box-sizing:border-box}body{font:15px Arial,sans-serif;padding:20px;color:#111;max-width:480px;margin:0 auto}.ticket-brand{text-align:center;margin:0 0 16px}.ticket-brand img{display:block;width:72px;height:72px;object-fit:contain;margin:0 auto 8px}.ticket-brand h1{font-size:22px;margin:0}.ticket-brand small{font-size:15px}hr{border:0;border-top:1px dashed #777;margin:12px 0}ul{list-style:none;padding:0;margin:0}li{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid #eee;break-inside:avoid}li img{width:68px;height:60px;object-fit:cover;border-radius:5px}li span{font-size:16px}.customer-details{padding:8px 0;line-height:1.5}.bill-total{display:flex;justify-content:space-between;font-size:18px;font-weight:bold;margin:14px 0}.payment-status{font-weight:bold;letter-spacing:.5px}small{color:#444}@media print{body{padding:8px}}</style></head><body><header class="ticket-brand"><img src="${escapeHtml(new URL('/admin-logo.png', window.location.href).href)}" alt="Tasty Bites logo"><h1>Tasty Bites<br><small>Kitchen Order Ticket</small></h1></header><hr><b>Order ${escapeHtml(order.id)}</b><p>${escapeHtml(order.type)}</p>${isDelivery ? `<section class="customer-details"><b>Customer Details</b><br>Name: ${escapeHtml(customerName || 'Not provided')}<br>Phone: ${escapeHtml(customerPhone || 'Not provided')}<br>Address: ${escapeHtml(deliveryAddress || 'Not provided')}</section>` : `<p><b>${locationLabel}:</b> ${escapeHtml(locationValue)}</p>`}<small>${escapeHtml(new Date().toLocaleString())}</small><hr><ul>${rows}</ul><hr><p class="bill-total"><span>Total Amount</span><span>₹${escapeHtml(totalAmount.toLocaleString('en-IN'))}</span></p><p class="payment-status">Payment: ${paymentStatus}</p><hr><p>Instructions: ${escapeHtml(order.instructions || '—')}</p><script>window.onload=()=>{const images=[...document.images];Promise.all(images.map(image=>image.decode?.().catch(()=>{})||Promise.resolve())).then(()=>window.print())}</script></body></html>`)
    ticket.document.close()
  }
  const itemRows = selected?.items.split(', ').map((line) => {
    const match = line.match(/^(\d+)\s*×\s*(.+)$/)
    return { quantity: match?.[1] || '1', name: match?.[2] || line }
  }) || []

  return <div className="live-orders-page" ref={pageRef}>
    <div className="live-orders-heading">
      <div><h1>Live Orders <span className="live-page-indicator"/><small>Real-time updates</small></h1><p>Review incoming orders and keep service moving.</p></div>
      <div className="live-order-tools"><button className="live-notification-button" onClick={() => setNotificationCount(0)} aria-label={`${notificationCount} unread notifications`}><Bell size={17}/>{notificationCount > 0 && <b>{notificationCount}</b>}</button><button className={`live-toggle ${autoRefresh ? 'on' : ''}`} aria-pressed={autoRefresh} onClick={() => setAutoRefresh((value) => !value)}><span/><RefreshCw size={15}/><b>Auto refresh</b></button><button className={`sound-toggle ${sound ? 'active' : ''}`} aria-pressed={sound} onClick={() => setSound((value) => !value)}>{sound ? <BellRing size={16}/> : <Volume2 size={16}/>}Sound {sound ? 'On' : 'Off'}</button></div>
    </div>
    <div className="live-order-summary">{summary.map(([Icon, label, value, tone]) => <button className={`live-summary-item ${statusFilter === label.replace(' Orders', '') ? 'active' : ''}`} key={label} onClick={() => setStatusFilter(label === 'Total Orders' ? 'All Statuses' : label === 'New Orders' ? 'New' : label)}><span className={`live-summary-icon ${tone}`}><Icon size={22} strokeWidth={2.3}/></span><div><strong>{value}</strong><small>{label}</small></div></button>)}</div>
    <div className="live-order-toolbar">
      <div className="live-order-tabs" role="tablist" aria-label="Order type">{[['All Orders', orders.length], ['Dine-in', orders.filter((order) => order.type === 'Dine-in').length], ['Delivery', orders.filter((order) => order.type === 'Delivery').length]].map(([label, count]) => <button key={label} role="tab" aria-selected={kind === label} className={kind === label ? 'active' : ''} onClick={() => setKind(label)}>{label}<b>{count}</b></button>)}</div>
      <div className="live-order-filters"><label className="live-order-search"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order ID, customer, table..."/></label><label className="live-select"><ListFilter size={15}/><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All Statuses</option>{['New', 'Accepted', 'Preparing', 'Ready', 'Packed', 'Out for Delivery', 'Delivered', 'Served', 'Completed', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={14}/></label><label className="live-select live-date"><CalendarDays size={15}/><select aria-label="Order date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}><option>Today</option><option>All dates</option></select><ChevronDown size={14}/></label><label className="live-select live-sort"><ArrowDownWideNarrow size={15}/><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest first</option><option>Oldest first</option><option>Highest amount</option><option>Lowest amount</option></select><ChevronDown size={14}/></label></div>
    </div>
    <div className="live-orders-workspace">
      <section className="live-order-list" aria-label="Orders">{visibleOrders.length ? visibleOrders.map((order) => {
        const action = order.status === 'New' ? ['Accept', 'Accepted'] : order.status === 'Accepted' ? ['Start Preparing', 'Preparing'] : order.status === 'Preparing' ? ['Mark Ready', 'Ready'] : order.status === 'Ready' ? [order.type === 'Delivery' ? 'Pack Order' : 'Serve to Table', order.type === 'Delivery' ? 'Packed' : 'Served'] : order.status === 'Packed' ? ['Out for Delivery', 'Out for Delivery'] : order.status === 'Out for Delivery' ? ['Mark Delivered', 'Delivered'] : order.status === 'Served' || order.status === 'Delivered' ? ['Complete', 'Completed'] : null
        return <article className={`live-order-card ${selected?.id === order.id ? 'selected' : ''}`} key={order.id} onClick={() => setSelectedId(order.id)}>
          <img src={img(order.image)} alt=""/><div className="live-order-main"><div className="live-order-id"><strong>{order.id}</strong><time><Clock3 size={13}/>{order.age}</time></div><div className="live-order-location"><span className={`order-kind ${order.type === 'Delivery' ? 'delivery' : 'dinein'}`}>{order.type === 'Delivery' ? <Bike size={13}/> : <Sofa size={13}/>} {order.type}</span><b>{order.place}</b></div><p><Package size={13}/>{order.items}</p></div>
          <div className="live-order-card-actions"><span className={`live-status status-${order.status.toLowerCase().replaceAll(' ', '-')}`}><i/>{order.status}</span><strong>₹{order.price}</strong><div>{action ? <button onClick={(event) => { event.stopPropagation(); changeStatus(order, action[1]) }}>{action[0]}</button> : <button className="view-order-button" onClick={(event) => { event.stopPropagation(); setSelectedId(order.id) }}><Eye size={14}/>View</button>}</div></div>
        </article>
      }) : <div className="live-orders-empty"><Search size={24}/><strong>No matching orders</strong><span>Try changing the order type, status, or search.</span></div>}</section>
      {selected && <aside className="live-order-detail">
        <div className="live-detail-top"><div><span className="detail-eyebrow">Selected order</span><h2>{selected.id}</h2><p><Clock3 size={14}/>{selected.age}</p></div><span className={`live-status status-${selected.status.toLowerCase().replaceAll(' ', '-')}`}><i/>{selected.status}</span></div>
        <div className="live-detail-actions">{['New', 'Accepted', 'Preparing'].includes(selected.status) && <button className="reject-order" onClick={() => reject(selected)}><X size={16}/>{selected.status === 'New' ? 'Reject' : 'Cancel'}</button>}{nextAction && <button className="accept-order" onClick={() => changeStatus(selected, nextAction[1])}><Check size={16}/>{nextAction[0]}</button>}</div>
        <div className="live-detail-tabs" role="tablist" aria-label="Order information">{['Order details', 'Customer', 'Timeline'].map((tab) => <button key={tab} role="tab" aria-selected={detailTab === tab} className={detailTab === tab ? 'active' : ''} onClick={() => setDetailTab(tab)}>{tab}</button>)}</div>
        {detailTab === 'Order details' ? <>
          <div className="live-detail-facts"><div><small>Order type</small><strong>{selected.type === 'Delivery' ? <Bike size={17}/> : <Sofa size={17}/>} {selected.type}</strong></div><div><small>{selected.type === 'Delivery' ? 'Delivery location' : 'Table number'}</small><strong><MapPin size={16}/>{selected.place}</strong></div></div>
          <div className="live-detail-items"><h3>Items <span>({itemRows.reduce((count, item) => count + Number(item.quantity), 0)})</span></h3>{itemRows.map((item, index) => <div className="live-detail-item" key={`${item.name}-${index}`}><span className="detail-item-icon"><Utensils size={16}/></span><strong>{item.name}<small>Qty {item.quantity}</small></strong><div className="detail-quantity"><button aria-label={`Decrease ${item.name}`} disabled={!['New', 'Accepted'].includes(selected.status) || Number(item.quantity) <= 1} onClick={() => updateQuantity(selected, index, -1)}><span>−</span></button><button aria-label={`Increase ${item.name}`} disabled={!['New', 'Accepted'].includes(selected.status)} onClick={() => updateQuantity(selected, index, 1)}><Plus size={13}/></button></div></div>)}</div>
          <div className="live-bill"><span>Subtotal</span><b>₹{Math.round(selected.price / 1.05)}</b><span>GST (5%)</span><b>₹{selected.price - Math.round(selected.price / 1.05)}</b></div><div className="live-detail-total"><span>Total amount</span><strong>₹{selected.price}</strong></div>
        </> : detailTab === 'Customer' ? <div className="live-detail-customer"><span><Users size={20}/></span><div><strong>{selected.type === 'Delivery' ? selected.place : 'Walk-in customer'}</strong>{selected.phone && <small><Phone size={13}/> {selected.phone}</small>}{selected.type === 'Delivery' && <small>{selected.address || 'Delivery address not provided in demo data.'}</small>}<small>Payment: Pay at counter · Pending</small><small>Instructions: {selected.instructions || 'No special instructions'}</small></div></div> : <div className="live-detail-timeline"><div><i/><span><strong>Order placed</strong><small>{selected.age}</small></span></div>{(selected.events || []).map((event, index) => <div key={`${event.status}-${index}`}><i/><span><strong>{event.status}</strong><small>{new Date(event.at).toLocaleTimeString()}</small></span></div>)}<div><i/><span><strong>Current status</strong><small>{selected.status}</small></span></div><div><i/><span><strong>Next step</strong><small>{nextAction?.[0] || 'No further action pending'}</small></span></div></div>}
        <div className="live-detail-footer"><button onClick={() => printKot(selected)}><Printer size={16}/>Print KOT</button><button className="kitchen-action" onClick={() => { if (selected.status === 'Accepted') changeStatus(selected, 'Preparing'); else { setNotice('Kitchen ticket is already in the active workflow.'); window.setTimeout(() => setNotice(''), 2400) } }}><ChefHat size={16}/>Send to Kitchen</button></div>
      </aside>}
    </div>
    {notice && <div className="live-order-toast" role="status">{notice}</div>}
  </div>
}

export default function AdminDashboard({ onLogout }) {
  const [section, setSection] = useState('Dashboard')
  const [filter, setFilter] = useState('All Orders')
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('tastybites-admin-orders') || 'null') || initialOrders } catch { return initialOrders }
  })
  useEffect(() => { window.localStorage.setItem('tastybites-admin-orders', JSON.stringify(orders)) }, [orders])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [range, setRange] = useState('Today')
  const [appearance, setAppearance] = useState(() => {
    try { return { primaryColor: '#ff6900', theme: 'light', ...JSON.parse(window.localStorage.getItem('tastybites-admin-settings') || '{}')?.appearance } } catch { return { primaryColor: '#ff6900', theme: 'light' } }
  })
  const updateAppearance = useCallback((next) => setAppearance((current) => ({ ...current, ...next })), [])
  const shown = useMemo(() => orders.filter(o => filter === 'All Orders' || o.type === filter), [orders, filter])
  const progress = (order) => ({ New: ['Accept', 'Preparing'], Accepted: ['Mark Ready', 'Ready'], Preparing: ['Mark Ready', 'Ready'], Ready: [order.type === 'Delivery' ? 'Out for Delivery' : 'Serve', order.type === 'Delivery' ? 'Out for Delivery' : 'Served'], Served: ['Complete', 'Completed'], 'Out for Delivery': ['Delivered', 'Delivered'] })[order.status]
  const advance = (id, status, reason) => setOrders(current => current.map(o => o.id === id ? { ...o, status, cancelReason: reason || o.cancelReason, updatedAt: new Date().toISOString(), events: [...(o.events || []), { status, at: new Date().toISOString(), reason }] } : o))
  const title = section === 'Dashboard' ? 'Dashboard' : section
  return <div className="admin-dashboard" data-theme={appearance.theme} style={{ '--admin-accent': appearance.primaryColor }}>
    <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="admin-brand"><span className="admin-logo-mark"><img src="/admin-logo.png" alt="" /></span><div><strong>Tasty <i>Bites</i></strong><small>Restaurant Admin</small></div><button className="admin-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X /></button></div>
      <nav>{nav.map(([label, Icon]) => <button key={label} className={section === label ? 'selected' : ''} onClick={() => { setSection(label); setMobileOpen(false) }}><Icon size={19} /><span>{label}</span>{label === 'Live Orders' && <b className="nav-count">5</b>}</button>)}</nav>
      <button className="sidebar-logout-button" onClick={onLogout}><LogOut size={19}/><span>Logout</span></button>
    </aside>
    {mobileOpen && <button className="admin-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
    <main className="admin-main">
      <header className="admin-topbar"><button className="admin-menu-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></button><label className="admin-search"><Search size={19} /><input placeholder="Search orders, menu, customers..." /></label><div className="admin-profile"><button className="notification" aria-label="Notifications"><Bell size={21} /><b>3</b></button><div className="avatar admin-avatar">RV</div><span><strong>Raj Vardhan</strong><small>Admin</small></span><button className="profile-chevron" aria-label="Profile menu"><ChevronDown size={17} /></button><button className="logout-button" onClick={onLogout} title="Logout"><LogOut size={18} /></button></div></header>
      <div className={`admin-content ${['Live Orders', 'Delivery Management', 'Settings'].includes(section) ? 'live-orders-content' : ''}`}>{section === 'Live Orders' ? <LiveOrdersPage orders={orders} onAdvance={advance} onEditItems={(id, items, price) => setOrders(current => current.map(order => order.id === id ? { ...order, items, price } : order))} onRefresh={() => { try { const synced = JSON.parse(window.localStorage.getItem('tastybites-admin-orders') || 'null'); if (synced) setOrders(current => JSON.stringify(current) === JSON.stringify(synced) ? current : synced) } catch { /* keep the current local demo state */ } }}/> : section === 'Delivery Management' ? <DeliveryManagementPage orders={orders} onAdvance={advance} onAssign={(id, rider) => setOrders(current => current.map(order => order.id === id ? { ...order, rider: rider || '' } : order))} onCreate={(order) => setOrders(current => [order, ...current])}/> : section === 'Menu Management' ? <MenuManagementPage/> : section === 'Categories' ? <CategoriesManagementPage/> : section === 'Table Management' ? <TableManagementPage/> : section === 'Customers' ? <CustomersManagementPage orders={orders}/> : section === 'Payments' ? <PaymentManagementPage/> : section === 'Reports & Analytics' ? <ReportsAnalyticsPage/> : section === 'Settings' ? <SettingsManagementPage onAppearanceChange={updateAppearance} onResetData={() => { setOrders(initialOrders); setAppearance({ primaryColor: '#ff6900', theme: 'light' }); setSection('Dashboard') }}/> : <><div className="admin-page-heading"><div><p>Saturday, October 31, 2026</p><h1>{title}</h1></div>{section !== 'Dashboard' && <span className="mock-notice">Demo workspace · sample data</span>}</div>
        <section className="stat-grid">
          {[[ShoppingBag, 18, 'Total Orders', '12%', 'orange'], [Sofa, 10, 'Dine-in Orders', '8%', 'green'], [Bike, 8, 'Delivery Orders', '33%', 'blue'], [CreditCard, 12450, 'Total Revenue', '18%', 'pink']].map(([Icon, value, label, growth, tone]) => <article className="stat-card glass" key={label}><span className={`stat-icon ${tone}`}><Icon size={28} /></span><div className="stat-copy"><strong><AnimatedCounter value={value} prefix={label === 'Total Revenue' ? '₹' : ''} minWidthCh={label === 'Total Revenue' ? 8 : 3}/></strong><span>{label}</span></div><div className="stat-growth"><b>↗ {growth}</b><small>Today</small></div></article>)}
        </section>
        <div className="admin-columns"><section className="orders-panel glass"><div className="panel-heading"><div><h2>Live Orders <i className="live-dot"/> <small>Real-time demo</small></h2></div><button className="text-link" onClick={() => setSection('Live Orders')}>View All <span>→</span></button></div><div className="order-tabs">{[['All Orders', '18'], ['Dine-in', '10'], ['Delivery', '8']].map(([name, count]) => <button key={name} className={filter === name ? 'active' : ''} onClick={() => setFilter(name)}>{name}<b>{count}</b></button>)}</div><div className="order-list">{shown.map(order => { const action = progress(order); return <article className="order-row" key={order.id}><img src={img(order.image)} alt=""/><div className="order-description"><div className="order-meta"><strong>{order.id}</strong><span>{order.age}</span></div><b>{order.place} <i>·</i> {order.type}</b><small>{order.items}</small></div><div className="order-controls"><span className={`order-status status-${order.status.toLowerCase().replaceAll(' ', '-')}`}>{order.status}</span><strong>₹{order.price}</strong>{action ? <button onClick={() => advance(order.id, action[1])}>{action[0]}</button> : <button className="done-button" disabled>Completed</button>}</div></article> })}</div></section>
          <div className="right-stack"><section className="chart-panel glass"><div className="panel-heading"><h2>Today's Overview</h2><select value={range} onChange={e => setRange(e.target.value)} aria-label="Chart date range"><option>Today</option><option>This Week</option><option>This Month</option></select></div><div className="chart-legend"><span><i className="legend-orange"/>Total Orders</span><span><i className="legend-green"/>Dine-in</span><span><i className="legend-blue"/>Delivery</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff6900" stopOpacity={0.2}/><stop offset="100%" stopColor="#ff6900" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#edf0f4" vertical/><XAxis dataKey="t" tick={{ fontSize: 10, fill: '#687386' }} axisLine={false} tickLine={false}/><YAxis tick={{ fontSize: 10, fill: '#687386' }} axisLine={false} tickLine={false}/><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e8edf3', boxShadow: '0 8px 24px #17203318' }}/><Area type="monotone" dataKey="o" name="Orders" stroke="#ff6900" strokeWidth={2.5} fill="url(#ordersFill)"/><Area type="monotone" dataKey="d" name="Dine-in" stroke="#12a65a" strokeWidth={2} fill="transparent"/><Area type="monotone" dataKey="v" name="Delivery" stroke="#2783f5" strokeWidth={2} fill="transparent"/></AreaChart></ResponsiveContainer></div></section>
            <section className="quick-panel glass"><h2>Quick Actions</h2><div className="quick-grid">{[[Plus, 'Add Food Item', 'orange'], [Grid2X2, 'Manage Categories', 'green'], [QrCode, 'Generate QR Code', 'blue'], [Store, 'Add New Table', 'purple']].map(([Icon, label, tone]) => <button key={label} onClick={() => setSection(({ 'Add Food Item': 'Menu Management', 'Manage Categories': 'Categories', 'Generate QR Code': 'QR Codes', 'Add New Table': 'Table Management' })[label])}><span className={tone}><Icon size={22}/></span>{label}</button>)}</div></section>
            <section className="tables-panel glass"><div className="panel-heading"><h2>Table Status</h2><button className="text-link" onClick={() => setSection('Table Management')}>View All →</button></div><div className="table-grid">{[['T1','Available'],['T2','Occupied'],['T3','Occupied'],['T4','Available'],['T5','Occupied'],['T6','Cleaning']].map(([table, status]) => <button key={table} className={`table-tile ${status.toLowerCase()}`} onClick={() => setSection('Table Management')}><strong>{table}</strong><small>{status}</small></button>)}</div></section></div></div>
        <div className="bottom-grid"><section className="bottom-panel glass"><div className="panel-heading"><h2>Top Selling Items</h2><button onClick={() => setSection('Menu Management')}>View All →</button></div>{[['photo-1589302168068-964664d93dc0','Chicken Biryani','45 orders','₹180'],['photo-1579751626657-72bc17010498','Margherita Pizza','38 orders','₹220'],['photo-1568901346375-23c9450c58cd','Chicken Burger','32 orders','₹150'],['photo-1645112411341-6c4fd023714a','Pasta Alfredo','28 orders','₹200']].map(([image,name,count,price],i)=><div className="compact-row" key={name}><b className={`rank rank-${i+1}`}>{i+1}</b><img src={img(image)} alt=""/><strong>{name}<small>{count}</small></strong><b>{price}</b></div>)}</section><section className="bottom-panel glass"><div className="panel-heading"><h2>Recent Customers</h2><button onClick={() => setSection('Customers')}>View All →</button></div>{[['Rahul Kumar','5 orders','₹1,250'],['Priya Singh','3 orders','₹880'],['Amit Verma','2 orders','₹640'],['Neha Patel','4 orders','₹1,120']].map(([name,count,spend],i)=><div className="customer-row" key={name}><div className={`avatar customer-avatar c${i}`}>{name.split(' ').map(n=>n[0]).join('')}</div><strong>{name}<small>{count}</small></strong><b>{spend}</b></div>)}</section><section className="bottom-panel glass"><div className="panel-heading"><h2>Delivery Management</h2><button onClick={() => setSection('Delivery Management')}>View All →</button></div>{[['Suresh Kumar','2 active deliveries','On Delivery'],['Ravi Singh','1 active delivery','On Delivery'],['Imran Khan','Available','Available'],['Deepak Yadav','Offline','Offline']].map(([name,detail,status],i)=><div className="delivery-row" key={name}><div className={`avatar customer-avatar c${i}`}>{name.split(' ').map(n=>n[0]).join('')}</div><strong>{name}<small>{detail}</small></strong><span className={`staff-status ${status.toLowerCase().replaceAll(' ','-')}`}>{status}</span></div>)}</section></div>
        <p className="dashboard-footnote"><Clock3 size={13}/> Sample dashboard data · orders and metrics are not connected to a live backend.</p>
      </>}
      </div>
    </main>
  </div>
}
