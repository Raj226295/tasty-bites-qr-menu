import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, CreditCard,
  QrCode, Store, Utensils, LoaderCircle, ShieldCheck, Bell, Eye, Phone, PackageCheck,
} from 'lucide-react'
import './DineInPaymentPage.css'
import { motion, useReducedMotion } from 'framer-motion'
import FoodSuccessAnimation from './components/FoodSuccessAnimation.jsx'

function PaymentStepper({ step = 2 }) {
  const steps = ['Cart', 'Payment', 'Confirm']
  return <ol className="payment-stepper" aria-label={`Checkout step ${step} of 3`}>
    {steps.map((label, index) => {
      const number = index + 1
      const complete = number < step
      const active = number === step
      return <li className={`payment-step ${complete ? 'complete' : ''} ${active ? 'active' : ''}`} key={label}>
        <span className="payment-step-marker">{complete ? <Check size={21} strokeWidth={3} /> : number}</span>
        <span className="payment-step-label">{label}</span>
        {index < steps.length - 1 && <span className={`payment-step-line ${number < step ? 'complete' : ''}`} aria-hidden="true" />}
      </li>
    })}
  </ol>
}

function DineInOrderSummary({ tableNumber, itemCount, total, formatMoney }) {
  return <section className="payment-order-summary" aria-label="Dine-in order summary">
    <span className="payment-summary-icon"><Utensils size={35} strokeWidth={2.4} /></span>
    <div className="payment-summary-table"><strong>Table No. {tableNumber || 'Not assigned'}</strong><span>Dine-in Order</span></div>
    <div className="payment-summary-total"><span>Total Amount</span><strong>{formatMoney(total)}</strong><small>{itemCount} {itemCount === 1 ? 'item' : 'items'}</small></div>
  </section>
}

function PaymentMethodCard({ value, selected, onSelect, icon: Icon, title, description }) {
  return <button type="button" role="radio" aria-checked={selected} className={`payment-method-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(value)}>
    <span className="payment-method-choice">{selected ? <Check size={17} strokeWidth={3} /> : <Circle size={25} />}</span>
    <span className="payment-method-icon"><Icon size={43} strokeWidth={2.1} /></span>
    <strong>{title}</strong>
    <span className="payment-method-description">{description}</span>
  </button>
}

function PaymentActions({ onBack, onContinue, loading, continueLabel = 'Continue' }) {
  return <div className="payment-actions">
    <button className="payment-back-button" onClick={onBack}><ArrowLeft size={20} /> Back to Cart</button>
    <button className="payment-continue-button" onClick={onContinue} disabled={loading}>
      {loading ? <><LoaderCircle className="payment-loading-icon" size={20} /> Processing…</> : <>{continueLabel} <ArrowRight size={22} /></>}
    </button>
  </div>
}

function PaymentError({ message }) {
  return message ? <p className="payment-error" role="alert">{message}</p> : null
}

function OrderSummaryPanel({ order, formatMoney }) {
  const items = order?.items || []
  return <section className="confirmation-summary-panel" aria-labelledby="confirmed-summary-title">
    <h2 id="confirmed-summary-title">Order Summary</h2>
    <div className="confirmed-item-list">{items.map((item) => <article className="confirmed-item" key={item.id}>
      <img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=180&q=82`} alt="" />
      <div><strong>{item.name}</strong><small>{item.quantity} × {formatMoney(item.price)}</small></div>
      <b>{formatMoney(item.price * item.quantity)}</b>
    </article>)}</div>
    <div className="confirmed-bill"><span>Item Total</span><strong>{formatMoney(order?.subtotal || 0)}</strong><span>GST (5%)</span><strong>{formatMoney(order?.tax || 0)}</strong><div><b>Total</b><strong>{formatMoney(order?.total || 0)}</strong></div></div>
    <div className={`confirmed-payment ${order?.paymentStatus === 'paid' ? 'paid' : ''}`}><CreditCard size={16} /><span>{order?.paymentStatus === 'paid' ? 'Paid online' : 'Pay at counter · Pending'}</span></div>
  </section>
}

function OrderProgressTimeline({ order }) {
  const status = String(order?.orderStatus || 'placed').toLowerCase().replaceAll('_', ' ')
  const currentStep = status.includes('served') || status.includes('completed') ? 3 : status.includes('ready') ? 2 : status.includes('prepar') ? 1 : 0
  const placedDate = order?.placedAt ? new Date(order.placedAt) : null
  const placedTime = placedDate && !Number.isNaN(placedDate.getTime()) ? placedDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Confirmed'
  const steps = [
    { title: 'Order Placed', description: placedTime, icon: PackageCheck },
    { title: 'Preparing', description: currentStep === 1 ? 'In Progress' : 'Waiting for kitchen', icon: Utensils },
    { title: 'Ready to Serve', description: currentStep >= 2 ? 'Ready' : 'Coming up', icon: Bell },
    { title: 'Served', description: currentStep >= 3 ? 'Completed' : 'Next', icon: CheckCircle2 },
  ]
  return <ol className="order-progress-timeline" aria-label="Order progress">
    {steps.map(({ title, description, icon: Icon }, index) => <li className={`${index <= currentStep ? 'reached' : ''} ${index === currentStep ? 'current' : ''}`} key={title}>
      <span className="progress-step-icon"><Icon size={19} /></span><strong>{title}</strong><small>{description}</small>
      {index < steps.length - 1 && <span className={`progress-step-line ${index < currentStep ? 'reached' : ''}`} aria-hidden="true" />}
    </li>)}
  </ol>
}

export default function DineInPaymentPage({
  stage, items, itemCount, subtotal, tax, total, tableNumber, paymentMethod,
  onPaymentMethodChange, onBack, onContinue, onVerify, loading, error,
  paymentSession, placedOrder, formatMoney, onReturnToMenu, onOrders,
  onViewStatus, onCallWaiter,
}) {
  const reduceMotion = useReducedMotion()
  const currentStep = stage === 'confirmation' ? 3 : 2
  return <main className="payment-area">
    <div className="payment-mobile-brand">
      <span className="payment-brand-mark"><Utensils size={21} /></span>
      <span className="payment-brand-text">Tasty <i>Bites</i></span>
    </div>
    {stage !== 'confirmation' && <div className="mobile-page-nav offers-mobile-page-nav payment-mobile-nav"><button onClick={onBack}>Cart</button><button onClick={onOrders}>My Orders</button><button className="selected">Payment</button></div>}
    {stage !== 'confirmation' && <PaymentStepper step={currentStep} />}

    {stage === 'payment' && <section className="payment-content" aria-labelledby="payment-title">
      <header className="payment-heading"><h1 id="payment-title">Choose Payment Method</h1><p>How would you like to pay for your dine-in order?</p></header>
      <DineInOrderSummary tableNumber={tableNumber} itemCount={itemCount} total={total} formatMoney={formatMoney} />
      {!itemCount ? <PaymentError message="Your cart is empty. Go back to the menu and add an item to continue." /> : <div className="payment-method-grid" role="radiogroup" aria-label="Choose a payment method">
        <PaymentMethodCard value="online" selected={paymentMethod === 'online'} onSelect={onPaymentMethodChange} icon={QrCode} title="Pay Online" description="Scan a UPI QR code and pay securely." />
        <PaymentMethodCard value="counter" selected={paymentMethod === 'counter'} onSelect={onPaymentMethodChange} icon={Store} title="Pay at Counter" description="Place your order now and pay at the restaurant counter." />
      </div>}
      <PaymentError message={error} />
      <PaymentActions onBack={onBack} onContinue={onContinue} loading={loading} />
    </section>}

    {stage === 'onlinePayment' && <section className="payment-content payment-provider-content" aria-labelledby="online-payment-title">
      <header className="payment-heading"><h1 id="online-payment-title">Complete Your Payment</h1><p>Pay securely using the restaurant’s configured payment provider.</p></header>
      <DineInOrderSummary tableNumber={tableNumber} itemCount={itemCount} total={total} formatMoney={formatMoney} />
      <div className="online-payment-panel">
        <div className="online-qr-frame">{paymentSession?.qrCodeUrl ? <img src={paymentSession.qrCodeUrl} alt="Payment QR code" /> : <span><QrCode size={64} /></span>}</div>
        <h2>Pay {formatMoney(total)}</h2>
        <p>{paymentSession?.qrCodeUrl ? 'Scan the QR code with your UPI app. When payment is complete, verify it below.' : 'Open the secure payment page, complete payment, then verify it below.'}</p>
        {paymentSession?.paymentUrl && <a className="provider-payment-link" href={paymentSession.paymentUrl} target="_blank" rel="noreferrer"><ShieldCheck size={18} /> Open secure payment page <ArrowRight size={17} /></a>}
        <span className="payment-reference">Order reference: {paymentSession?.orderId || paymentSession?.paymentReference}</span>
      </div>
      <PaymentError message={error} />
      <PaymentActions onBack={onBack} onContinue={onVerify} loading={loading} continueLabel="Verify Payment" />
    </section>}

    {stage === 'confirmation' && <section className="payment-content confirmation-content" aria-labelledby="confirmation-title">
      <div className="confirmation-layout">
        <section className="confirmation-success-panel">
          <FoodSuccessAnimation orderId={placedOrder?.orderId} />
          <motion.h1 id="confirmation-title" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .55, delay: reduceMotion ? 0 : .4, ease: 'easeOut' }}>Order Placed Successfully!</motion.h1>
          <p className="confirmation-success-copy">Your order has been sent to the kitchen.</p>
          <div className="confirmation-table-card"><span><Utensils size={38} /></span><div><strong>Table No. {placedOrder?.tableNumber || tableNumber}</strong><small>Order ID: #{String(placedOrder?.orderId || '').replace(/^#/, '')}</small></div></div>
          <div className="confirmation-success-details" aria-label="Order details">
            <div><small>Total Amount</small><strong>{formatMoney(placedOrder?.total || total)}</strong></div>
            <div><small>Payment Method</small><strong>{placedOrder?.paymentMethod === 'upi' ? 'UPI' : 'Pay at counter'}</strong></div>
            <div><small>Order Status</small><strong>{placedOrder?.orderStatus || 'Placed'}</strong></div>
          </div>
          <button className="confirmation-status-button" onClick={onViewStatus}><Eye size={19} /> Track Order <ArrowRight size={17} /></button>
          <div className="confirmation-waiter"><span><Bell size={16} /> Need anything? Call the waiter.</span><button onClick={onCallWaiter}><Phone size={15} /> Call Waiter</button></div>
        </section>
        <OrderSummaryPanel order={placedOrder} formatMoney={formatMoney} />
      </div>
      <OrderProgressTimeline order={placedOrder} />
      <button className="confirmation-return" onClick={onReturnToMenu}>Back to Menu <ArrowRight size={18} /></button>
    </section>}
  </main>
}

export { PaymentMethodCard, PaymentStepper, DineInOrderSummary }
