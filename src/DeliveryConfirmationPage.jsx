import { ArrowRight, Bike, Check, Clock3, Headphones, House, MapPin, PackageCheck, Phone, Truck } from 'lucide-react'
import FoodSuccessAnimation from './components/FoodSuccessAnimation.jsx'
import { motion, useReducedMotion } from 'framer-motion'
import './DeliveryConfirmationPage.css'

function DeliveryProgress({ placedAt }) {
  const time = new Date(placedAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const steps = [
    { title: 'Order Placed', caption: time, icon: Check },
    { title: 'Preparing', caption: 'Your food is being prepared', icon: PackageCheck },
    { title: 'Out for Delivery', caption: 'Coming soon', icon: Bike },
    { title: 'Delivered', caption: 'Enjoy your meal', icon: Check },
  ]
  return <section className="delivery-confirm-status">
    <div className="delivery-confirm-status-heading"><h2>Order Status</h2><span><Clock3 size={17} strokeWidth={2.2} /> Estimated delivery <b>25–45 mins</b></span></div>
    <ol>{steps.map(({ title, caption, icon: Icon }, index) => <li className={index === 0 ? 'reached' : index === 1 ? 'current' : ''} key={title}>
      <span className="delivery-progress-icon"><Icon size={19} strokeWidth={2.2} /></span><strong>{title}</strong><small>{caption}</small>{index < steps.length - 1 && <i className={index === 0 ? 'reached' : ''} />}
    </li>)}</ol>
  </section>
}

export default function DeliveryConfirmationPage({ order, formatMoney, onTrack, onSupport }) {
  const reduceMotion = useReducedMotion()
  const address = order?.deliveryAddress || {}
  const fullAddress = [address.house, address.street, address.city, address.state, address.pincode].filter(Boolean).join(', ')
  const placedDate = order?.placedAt ? new Date(order.placedAt) : new Date()
  const placedTime = placedDate.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return <main className="delivery-confirm-area">
    <div className="delivery-confirm-grid">
      <section className="delivery-confirm-success">
        <div className="delivery-confirm-hero">
          <FoodSuccessAnimation key={order?.orderId} orderId={order?.orderId} />
          <div className="delivery-confirm-hero-copy"><motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .55, delay: reduceMotion ? 0 : .4, ease: 'easeOut' }}>Order Placed Successfully!</motion.h1>
          <p>Your order is confirmed and is being prepared for delivery.</p></div>
        </div>
        <div className="delivery-confirm-meta">
          <span className="delivery-confirm-rider"><Truck size={31} strokeWidth={2.2} /></span>
          <div><small>Delivering to</small><strong>{fullAddress || 'Delivery address saved'}</strong></div>
          <div className="delivery-confirm-order-id"><small>Order ID</small><strong>#{order?.orderId}</strong><small>{placedTime}</small></div>
        </div>
        <div className="delivery-success-details" aria-label="Order details">
          <div><small>Total Amount</small><strong>{formatMoney(order?.total || 0)}</strong></div>
          <div><small>Payment Method</small><strong>Pay on delivery</strong></div>
          <div><small>Order Status</small><strong className="delivery-success-status">{order?.orderStatus || 'Placed'}</strong></div>
          <div><small>Delivery Type</small><strong>Home delivery</strong></div>
        </div>
        <button className="delivery-track-button" onClick={onTrack}><Truck size={19} strokeWidth={2.2} /> Track Your Order <ArrowRight size={19} strokeWidth={2.2} /></button>
        <div className="delivery-help-strip"><span><Phone size={17} strokeWidth={2.2} /> Need help with your order?</span><button onClick={onSupport}><Headphones size={17} strokeWidth={2.2} /> Contact Support</button></div>
      </section>

      <section className="delivery-confirm-panel delivery-confirm-summary" id="delivery-confirm-summary">
        <div className="delivery-confirm-panel-title"><h2>Order Summary</h2><span>{order?.itemCount} {order?.itemCount === 1 ? 'item' : 'items'}</span></div>
        <div className="delivery-confirm-items">{(order?.items || []).map((item) => <article key={item.id}>
          <img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=140&q=80`} alt="" />
          <div><strong>{item.name}</strong><small>{formatMoney(item.price)}</small></div>
          <span>Qty: {item.quantity}<b>{formatMoney(item.quantity * item.price)}</b></span>
        </article>)}</div>
        <div className="delivery-confirm-bill"><span>Item Total</span><b>{formatMoney(order?.subtotal || 0)}</b><span>Delivery Fee</span><b>{formatMoney(order?.deliveryFee || 0)}</b><span>GST (5%)</span><b>{formatMoney(order?.tax || 0)}</b><strong>Amount Due</strong><strong>{formatMoney(order?.total || 0)}</strong></div>
      </section>

      <DeliveryProgress placedAt={order?.placedAt} />

      <section className="delivery-confirm-panel delivery-address-card">
        <div className="delivery-confirm-panel-title"><h2><MapPin size={19} strokeWidth={2.2} /> Delivery Details</h2></div>
        <div className="delivery-address-person"><span><House size={20} strokeWidth={2.2} /></span><div><strong>{address.fullName}</strong><small>{address.phone}</small><p><MapPin size={15} strokeWidth={2.2} /> {fullAddress}</p></div></div>
        <div className="delivery-partner"><span><Bike size={23} strokeWidth={2.2} /></span><div><strong>Delivery Partner</strong><small>Will be assigned soon</small><p>You’ll get rider details when your order is out for delivery.</p></div><button onClick={onSupport} aria-label="Contact support"><Phone size={18} strokeWidth={2.2} /></button></div>
      </section>
    </div>
  </main>
}
