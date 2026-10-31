import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { AlertCircle, Check, Leaf, Minus, Plus, ShoppingCart, Star, X } from 'lucide-react'
import './ProductDetailsModal.css'

function ProductImageGallery({ product }) {
  const images = (product.gallery?.length ? product.gallery : [product.image]).filter(Boolean)
  const [activeIndex, setActiveIndex] = useState(0)
  const [imageFailed, setImageFailed] = useState(false)
  const imageRef = useRef(null)
  const galleryAnimation = useRef(null)
  const imageUrl = images[activeIndex]
    ? `https://images.unsplash.com/${images[activeIndex]}?auto=format&fit=crop&w=1200&q=90`
    : null

  useEffect(() => {
    setActiveIndex(0)
    setImageFailed(false)
  }, [product.id])

  useEffect(() => {
    if (!imageRef.current || !imageUrl) return undefined
    gsap.fromTo(imageRef.current, { autoAlpha: 0, scale: .985 }, { autoAlpha: 1, scale: 1, duration: .28, ease: 'power2.out' })
    return () => gsap.killTweensOf(imageRef.current)
  }, [imageUrl])

  const selectImage = (index) => {
    if (index === activeIndex || !imageRef.current) return
    galleryAnimation.current?.kill()
    galleryAnimation.current = gsap.to(imageRef.current, {
      autoAlpha: 0,
      scale: .985,
      duration: .13,
      ease: 'power2.out',
      onComplete: () => { setImageFailed(false); setActiveIndex(index) },
    })
  }

  return <div className="product-modal-gallery">
    <div className="product-modal-image-wrap">
      {imageUrl && !imageFailed ? <img ref={imageRef} className="product-modal-image" src={imageUrl} alt={product.name} onError={() => setImageFailed(true)} /> : <div className="product-modal-image-placeholder" role="img" aria-label={`${product.name} image unavailable`}><ShoppingCart size={36} /><span>Image unavailable</span></div>}
      <span className={`product-modal-diet ${product.veg ? 'veg' : 'nonveg'}`} title={product.veg ? 'Vegetarian' : 'Non-vegetarian'}>{product.veg ? <i /> : <b />}</span>
      <span className="product-modal-rating"><Star size={14} fill="currentColor" /> {product.rating}</span>
    </div>
    {images.length > 1 && <div className="product-modal-thumbnails" aria-label="Product photos">{images.map((image, index) => <button type="button" key={`${image}-${index}`} className={activeIndex === index ? 'active' : ''} onClick={() => selectImage(index)} aria-label={`Show product image ${index + 1}`} aria-pressed={activeIndex === index}><img src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=180&q=75`} alt="" loading="lazy" /></button>)}</div>}
  </div>
}

export default function ProductDetailsModal({ product, quantityInCart, onAddToCart, onClose }) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const overlayRef = useRef(null)
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)
  const quantityRef = useRef(null)
  const plusRef = useRef(null)
  const addButtonRef = useRef(null)
  const closeStarted = useRef(false)
  const closeTimer = useRef(null)
  const closingCallback = useRef(onClose)

  useEffect(() => { closingCallback.current = onClose }, [onClose])

  useLayoutEffect(() => {
    const originalFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const context = gsap.context(() => {
      if (reduceMotion) return
      gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: .25, ease: 'power2.out' })
      gsap.fromTo(modalRef.current, { autoAlpha: 0, scale: .92, y: 35 }, { autoAlpha: 1, scale: 1, y: 0, duration: .45, delay: .03, ease: 'power3.out' })
      gsap.fromTo('.product-modal-image-wrap', { scale: .97 }, { scale: 1, duration: .55, delay: .12, ease: 'power3.out' })
      gsap.fromTo('.product-modal-animate', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .3, delay: .16, stagger: .06, ease: 'power2.out' })
    }, modalRef)
    closeButtonRef.current?.focus({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        beginClose()
      }
      if (event.key !== 'Tab' || !modalRef.current) return
      const focusable = [...modalRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex="0"]')]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      context.revert()
      if (originalFocus instanceof HTMLElement) originalFocus.focus({ preventScroll: true })
      window.clearTimeout(closeTimer.current)
    }
  }, [reduceMotion])

  const beginClose = useCallback(() => {
    if (closeStarted.current) return
    closeStarted.current = true
    if (reduceMotion) { closingCallback.current(); return }
    const timeline = gsap.timeline({ onComplete: () => closingCallback.current() })
    timeline.to(modalRef.current, { autoAlpha: 0, scale: .96, y: 15, duration: .25, ease: 'power2.in' }, 0)
    timeline.to(overlayRef.current, { autoAlpha: 0, duration: .25, ease: 'power2.in' }, 0)
  }, [reduceMotion])

  const changeQuantity = (delta) => {
    setQuantity((current) => {
      const next = Math.max(1, current + delta)
      if (next !== current && quantityRef.current && !reduceMotion) gsap.fromTo(quantityRef.current, { y: delta > 0 ? 7 : -7, autoAlpha: .55 }, { y: 0, autoAlpha: 1, duration: .22, ease: 'back.out(2)' })
      return next
    })
    if (delta > 0 && plusRef.current && !reduceMotion) gsap.fromTo(plusRef.current, { scale: .9 }, { scale: 1, duration: .24, ease: 'back.out(3)' })
  }

  const addProduct = () => {
    if (added) return
    setAdded(true)
    onAddToCart(product, quantity)
    if (addButtonRef.current && !reduceMotion) gsap.fromTo(addButtonRef.current, { scale: .975 }, { scale: 1, duration: .25, ease: 'back.out(2)' })
    closeTimer.current = window.setTimeout(beginClose, reduceMotion ? 350 : 650)
  }

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null
  const modal = <div ref={overlayRef} className="product-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) beginClose() }}>
    <section ref={modalRef} className="product-details-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" aria-describedby="product-modal-description" tabIndex={-1}>
      <button ref={closeButtonRef} type="button" className="product-modal-close" onClick={beginClose} aria-label="Close product details"><X size={21} /></button>
      <ProductImageGallery product={product} />
      <div className="product-modal-info">
        <h2 className="product-modal-animate" id="product-modal-title">{product.name}</h2>
        <div className="product-modal-meta product-modal-animate"><span className={`product-modal-food-type ${product.veg ? 'veg' : 'nonveg'}`}><i />{product.veg ? 'Veg' : 'Non-Veg'}</span><span className="product-modal-review"><Star size={16} fill="currentColor" /> {product.rating} <small>({product.reviews} reviews)</small></span></div>
        <p className="product-modal-description product-modal-animate" id="product-modal-description">{product.detailDescription || product.description}</p>
        <div className="product-modal-price product-modal-animate"><strong>₹{product.price.toLocaleString('en-IN')}</strong>{product.oldPrice && <del>₹{product.oldPrice.toLocaleString('en-IN')}</del>}{discount && <span>{discount}% OFF</span>}</div>
        <div className="product-modal-quantity product-modal-animate"><strong>Quantity</strong><div><button type="button" onClick={() => changeQuantity(-1)} aria-label="Decrease quantity" disabled={quantity === 1}><Minus size={17} /></button><output ref={quantityRef} aria-live="polite" aria-label="Selected quantity">{quantity}</output><button ref={plusRef} type="button" onClick={() => changeQuantity(1)} aria-label="Increase quantity"><Plus size={18} /></button></div><small>{quantityInCart > 0 ? `${quantityInCart} already in your cart` : ''}</small></div>
        <div className="product-modal-add-wrap product-modal-animate"><button ref={addButtonRef} type="button" className={`product-modal-add ${added ? 'is-added' : ''}`} onClick={addProduct}><span>{added ? <Check size={20} /> : <ShoppingCart size={20} />}</span>{added ? 'Added to Cart' : 'Add to Cart'}</button></div>
        <div className="product-modal-detail product-modal-animate"><span className="product-modal-detail-icon ingredients"><Leaf size={20} /></span><div><strong>Ingredients</strong><p>{product.ingredients?.length ? product.ingredients.join(', ') : 'Please ask the restaurant for ingredient details.'}</p></div></div>
        <div className="product-modal-detail product-modal-animate"><span className="product-modal-detail-icon allergens"><AlertCircle size={19} /></span><div><strong>Allergen Information</strong><p>{product.allergens || 'Allergen details are not available. Please ask the restaurant before ordering.'}</p></div></div>
      </div>
    </section>
  </div>

  return createPortal(modal, document.body)
}
