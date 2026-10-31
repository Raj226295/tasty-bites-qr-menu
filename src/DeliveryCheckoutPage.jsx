import { ArrowLeft, ArrowRight, Check, Clock3, CreditCard, Crosshair, FileText, House, MapPin, PackageCheck, Phone, UserRound, Truck } from 'lucide-react'
import './DeliveryCheckoutPage.css'

function DeliveryPinIcon() {
  return <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M24 2C13.5 2 5 10.5 5 21c0 14.2 17.1 25.8 17.8 26.3a2 2 0 0 0 2.4 0C25.9 46.8 43 35.2 43 21 43 10.5 34.5 2 24 2Zm0 26a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" fill="currentColor" fillRule="evenodd" /></svg>
}

function LocationCompassIcon() {
  return <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="currentColor"><rect x="21" y="1" width="6" height="11" rx="3"/><rect x="21" y="36" width="6" height="11" rx="3"/><rect x="1" y="21" width="11" height="6" rx="3"/><rect x="36" y="21" width="11" height="6" rx="3"/><circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" strokeWidth="6"/><circle cx="24" cy="24" r="7"/></g></svg>
}

const fields = [
  { name: 'fullName', label: 'Full Name', placeholder: 'Enter your full name', icon: UserRound, autoComplete: 'name' },
  { name: 'phone', label: 'Phone Number', placeholder: 'Enter your phone number', icon: Phone, autoComplete: 'tel', type: 'tel' },
  { name: 'house', label: 'House / Flat No.', placeholder: 'e.g. 123, Block A', icon: House, autoComplete: 'address-line1' },
  { name: 'street', label: 'Area / Street', placeholder: 'e.g. Karpuri Nagar, Line Bazar', icon: MapPin, autoComplete: 'address-line2' },
]

function DeliveryStepper() {
  return <ol className="delivery-stepper" aria-label="Checkout step 2 of 4">
    {['Cart', 'Address', 'Payment', 'Confirm'].map((label, index) => <li className={index === 0 ? 'done' : index === 1 ? 'active' : ''} key={label}>
      <span>{index === 0 ? <Check size={17} strokeWidth={3} /> : index + 1}</span><small>{label}</small>
      {index < 3 && <i aria-hidden="true" />}
    </li>)}
  </ol>
}

export default function DeliveryCheckoutPage({ items, itemCount, subtotal, tax, deliveryFee, total, formatMoney, onBack, onPlaceOrder, loading, error }) {
  const useCurrentLocation = (event) => {
    const form = event.currentTarget.form
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`)
        const result = await response.json()
        const address = result.address || {}
        const set = (name, value) => { const input = form.elements.namedItem(name); if (input && value) input.value = value }
        set('house', [address.house_number, address.building].filter(Boolean).join(', '))
        set('street', [address.suburb, address.neighbourhood, address.road].filter(Boolean).join(', '))
        set('city', address.city || address.town || address.village || address.county || '')
        set('pincode', address.postcode || '')
      } catch { /* Manual address entry remains available if reverse lookup fails. */ }
    }, () => {})
  }
  return <main className="delivery-checkout-area">
    <header className="delivery-topbar"><button type="button" className="delivery-back" onClick={onBack} aria-label="Back to cart"><ArrowLeft size={20} /></button><span className="delivery-brand-mark"><Truck size={20} /></span><strong>Tasty <i>Bites</i></strong></header>
    <DeliveryStepper />
    <div className="delivery-checkout-grid">
      <form id="delivery-checkout-form" className="delivery-form" onSubmit={onPlaceOrder}>
        <section className="delivery-panel" aria-labelledby="delivery-address-title">
          <div className="delivery-panel-heading"><span className="delivery-heading-icon"><DeliveryPinIcon /></span><div><h1 id="delivery-address-title">Delivery Address</h1><p>Where should we bring your order?</p></div><button type="button" className="delivery-location-button" onClick={useCurrentLocation}><LocationCompassIcon /> Use Current Location</button></div>
          <div className="delivery-fields">
            {fields.map(({ name, label, placeholder, icon: Icon, autoComplete, type = 'text' }) => <label className="delivery-field" key={name}>
              <span>{label} <b>*</b></span><span className="delivery-input-wrap"><Icon size={19} /><input name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} required minLength={name === 'phone' ? 10 : undefined} maxLength={name === 'phone' ? 15 : undefined} pattern={name === 'phone' ? '[+0-9() -]{10,15}' : undefined} /></span>
            </label>)}
            <label className="delivery-field"><span>City <b>*</b></span><span className="delivery-input-wrap"><House size={19} /><input name="city" placeholder="Enter your city" autoComplete="address-level2" required /></span></label>
            <label className="delivery-field"><span>Pincode <b>*</b></span><span className="delivery-input-wrap"><PackageCheck size={19} /><input name="pincode" placeholder="6-digit pincode" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required /></span></label>
          </div>
        </section>
        <section className="delivery-panel delivery-time-panel" aria-labelledby="delivery-time-title"><div className="delivery-section-title"><Clock3 size={22} /><h2 id="delivery-time-title">Delivery Time</h2></div><label className="delivery-time-option"><input type="radio" name="deliveryTime" value="asap" defaultChecked /><span className="delivery-time-icon"><Truck size={25} /></span><span><strong>ASAP (30–45 mins)</strong><small>Get it as soon as possible</small></span><i><Check size={13} /></i></label>
          <label className="delivery-field delivery-notes"><span><FileText size={17} /> Delivery Notes <small>(Optional)</small></span><textarea name="deliveryNotes" maxLength={200} placeholder="e.g. Gate no. 2, near park, call before delivery…" /></label>
        </section>
        {error && <p className="delivery-error" role="alert">{error}</p>}
        <button className="delivery-submit mobile-submit" disabled={loading || !itemCount}>{loading ? 'Placing order…' : <>Place Order <ArrowRight size={21} /></>}</button>
      </form>
      <aside className="delivery-order-aside">
        <section className="delivery-panel delivery-items-panel"><div className="delivery-section-title"><PackageCheck size={21} /><h2>Your Order</h2><span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span></div><div className="delivery-item-list">{items.map((item) => <article className="delivery-item" key={item.id}><img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=140&q=80`} alt=""/><div><strong>{item.name}</strong><small>{item.quantity} × {formatMoney(item.price)}</small></div><b>{formatMoney(item.quantity * item.price)}</b></article>)}</div></section>
        <section className="delivery-panel delivery-bill"><div className="delivery-section-title"><CreditCard size={21} /><h2>Bill Details</h2><small>INR</small></div><div><span>Item Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span><strong>{formatMoney(subtotal)}</strong><span>Delivery Fee</span><strong>{formatMoney(deliveryFee)}</strong><span>GST (5%)</span><strong>{formatMoney(tax)}</strong><b>Total Amount</b><b>{formatMoney(total)}</b></div><button type="submit" form="delivery-checkout-form" className="delivery-submit desktop-submit" disabled={loading || !itemCount}>{loading ? 'Placing order…' : <>Place Order · {formatMoney(total)} <ArrowRight size={21} /></>}</button><p className="delivery-secure-note"><Check size={15} /> You can review your order before it’s sent</p></section>
      </aside>
    </div>
  </main>
}
