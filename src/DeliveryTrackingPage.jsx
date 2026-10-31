import { ArrowLeft, Bike, Check, Clock3, Headphones, House, MapPin, PackageCheck, Phone, Store } from 'lucide-react'
import './DeliveryTrackingPage.css'

function TrackingTimeline({ placedAt }) {
  const base = new Date(placedAt || Date.now())
  const timeAt = (minutes) => new Date(base.getTime() + minutes * 60_000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const steps = [
    { title: 'Order Placed', time: timeAt(0), description: 'Your order is confirmed', icon: Check, state: 'complete' },
    { title: 'Preparing', time: 'In progress', description: 'The kitchen is preparing your food', icon: PackageCheck, state: 'current' },
    { title: 'Out for Delivery', time: 'Coming up', description: 'Rider will be assigned soon', icon: Bike, state: '' },
    { title: 'Delivered', time: 'Coming up', description: 'Enjoy your meal', icon: Check, state: '' },
  ]
  return <section className="tracking-timeline-card"><div className="tracking-panel-heading"><h2>Order Progress</h2><span><Clock3 size={16} /> Estimated delivery <b>25–45 mins</b></span></div><ol className="tracking-timeline">{steps.map(({ title, time, description, icon: Icon, state }, index) => <li className={state} key={title}><span className="tracking-step-icon"><Icon size={20} /></span><strong>{title}</strong><small>{time}</small><p>{description}</p>{index < steps.length - 1 && <i className={index === 0 ? 'complete' : ''} />}</li>)}</ol></section>
}

function RoutePreview({ address }) {
  return <div className="tracking-map" role="img" aria-label={`Illustrative route from Tasty Bites restaurant to ${address}`}>
    <div className="map-block map-block-one" /><div className="map-block map-block-two" /><div className="map-block map-block-three" /><div className="map-block map-block-four" /><div className="map-block map-block-five" />
    <svg className="map-route" viewBox="0 0 900 300" preserveAspectRatio="none" aria-hidden="true"><path className="map-route-under" d="M95 175 C170 175 170 130 260 150 S375 220 470 174 S610 105 680 156 S760 185 820 120"/><path className="map-route-line" d="M95 175 C170 175 170 130 260 150 S375 220 470 174 S610 105 680 156 S760 185 820 120"/></svg>
    <span className="map-marker restaurant-marker"><Store size={21} /></span><span className="map-label restaurant-label">Restaurant</span><span className="map-marker home-marker"><House size={22} /></span><span className="map-label home-label">Your Location</span>
    <span className="map-live-note"><span className="map-live-dot" /> Route preview <small>Live rider tracking starts after pickup</small></span>
    <span className="map-road-label road-label-one">MAIN ROAD</span><span className="map-road-label road-label-two">MARKET ROAD</span>
  </div>
}

export default function DeliveryTrackingPage({ order, formatMoney, onBack, onSupport }) {
  const address = order?.deliveryAddress || {}
  const fullAddress = [address.house, address.street, address.city, address.pincode].filter(Boolean).join(', ')
  return <main className="delivery-tracking-area">
    <div className="tracking-topbar"><button onClick={onBack} aria-label="Back to confirmation"><ArrowLeft size={19} /></button><div><h1>Track Your Order</h1><p>Follow your order as the restaurant prepares it.</p></div><span className="tracking-estimate"><Clock3 size={22} /><small>Estimated Delivery</small><strong>25–45 mins</strong></span></div>
    <div className="delivery-tracking-grid">
      <div className="tracking-main-column">
        <TrackingTimeline placedAt={order?.placedAt} />
        <section className="tracking-route-card"><RoutePreview address={fullAddress} /><div className="tracking-rider-row"><span className="tracking-rider-icon"><Bike size={28} /></span><div><strong>Delivery Partner</strong><small>Your rider will be assigned when the order is ready.</small></div><button onClick={onSupport}><Headphones size={17} /> Contact Support</button></div></section>
      </div>
      <aside className="tracking-side-column">
        <section className="tracking-summary-card"><div className="tracking-panel-heading"><h2>Order Summary</h2><span>{order?.itemCount} {order?.itemCount === 1 ? 'item' : 'items'}</span></div><div className="tracking-items">{(order?.items || []).map((item) => <article key={item.id}><img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=140&q=80`} alt=""/><div><strong>{item.name}</strong><small>{formatMoney(item.price)}</small></div><span>Qty: {item.quantity}<b>{formatMoney(item.price * item.quantity)}</b></span></article>)}</div><div className="tracking-bill"><span>Item Total</span><b>{formatMoney(order?.subtotal || 0)}</b><span>Delivery Fee</span><b>{formatMoney(order?.deliveryFee || 0)}</b><span>GST (5%)</span><b>{formatMoney(order?.tax || 0)}</b><strong>Amount Due</strong><strong>{formatMoney(order?.total || 0)}</strong></div><p className="tracking-payment-note">Payment can be completed later.</p></section>
        <section className="tracking-address-card"><div className="tracking-panel-heading"><h2><MapPin size={19} /> Delivery Details</h2></div><div className="tracking-address"><span><House size={20} /></span><div><strong>{address.fullName}</strong><small>{address.phone}</small><p><MapPin size={15} /> {fullAddress}</p></div></div><div className="tracking-order-id"><PackageCheck size={17} /><span>Order ID</span><strong>#{order?.orderId}</strong></div><button className="tracking-contact-button" onClick={onSupport}><Phone size={17} /> Need help with your order?</button></section>
      </aside>
    </div>
  </main>
}
