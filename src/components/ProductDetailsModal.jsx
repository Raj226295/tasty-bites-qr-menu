import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { motion } from 'motion/react'
import { AlertCircle, Camera, Check, ChevronDown, ChevronLeft, ChevronRight, Flame, ImagePlus, Leaf, Maximize2, Minus, Plus, RotateCcw, ShoppingCart, Star, X, ZoomIn, ZoomOut } from 'lucide-react'
import './ProductDetailsModal.css'

const PAGE_SIZE = 2
const productImageUrl = (source, width = 1200) => source?.startsWith('http')
  ? source
  : source ? `https://images.unsplash.com/${source}?auto=format&fit=crop&w=${width}&q=90` : null

const compressReviewPhoto = (file) => new Promise((resolve, reject) => {
  const imageUrl = URL.createObjectURL(file)
  const image = new Image()
  image.onload = () => {
    const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext('2d')
    if (!context) { URL.revokeObjectURL(imageUrl); reject(new Error('This photo could not be prepared. Please choose another image.')); return }
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    URL.revokeObjectURL(imageUrl)
    resolve(canvas.toDataURL('image/jpeg', .78))
  }
  image.onerror = () => { URL.revokeObjectURL(imageUrl); reject(new Error('This photo could not be opened. Please choose another image.')) }
  image.src = imageUrl
})

const configuredReviewsEndpoint = (productId) => {
  const base = import.meta.env.VITE_PRODUCT_REVIEWS_ENDPOINT?.trim()
  if (!base) return ''
  return base.includes(':productId')
    ? base.replace(':productId', encodeURIComponent(productId))
    : `${base.replace(/\/$/, '')}/${encodeURIComponent(productId)}/reviews`
}

const distributionFor = (reviews = [], summary = {}) => {
  const source = summary.distribution || summary.ratingDistribution
  return [5, 4, 3, 2, 1].map((stars) => {
    const count = Number(Array.isArray(source) ? source.find((item) => Number(item.rating ?? item.stars) === stars)?.count : source?.[stars])
      || (Array.isArray(reviews) ? reviews.filter((review) => Number(review.rating) === stars).length : 0)
    return { stars, count }
  })
}

function ProductImageGallery({ product, reduceMotion }) {
  const images = useMemo(() => (product.gallery?.length ? product.gallery : [product.image]).filter(Boolean), [product.gallery, product.image])
  const [activeIndex, setActiveIndex] = useState(0)
  const [imageFailed, setImageFailed] = useState(false)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)
  const zoomImageRef = useRef(null)
  const zoomViewerRef = useRef(null)
  const zoomCloseRef = useRef(null)
  const expandButtonRef = useRef(null)
  const galleryAnimation = useRef(null)
  const activePointers = useRef(new Map())
  const pinchStart = useRef(null)
  const dragStart = useRef(null)
  const zoomValue = useRef(1)
  const panValue = useRef({ x: 0, y: 0 })
  const imageUrl = productImageUrl(images[activeIndex])

  useEffect(() => {
    const targets = [imageRef.current, zoomImageRef.current].filter(Boolean)
    if (!targets.length || !imageUrl || reduceMotion) return undefined
    gsap.fromTo(targets, { autoAlpha: 0, scale: .985 }, { autoAlpha: 1, scale: 1, duration: .28, ease: 'power2.out' })
    return () => gsap.killTweensOf(targets)
  }, [imageUrl, reduceMotion, zoomOpen])

  const resetZoom = useCallback(() => {
    zoomValue.current = 1
    panValue.current = { x: 0, y: 0 }
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const selectImage = useCallback((index) => {
    const nextIndex = (index + images.length) % images.length
    if (nextIndex === activeIndex) return
    const targets = [imageRef.current, zoomImageRef.current].filter(Boolean)
    if (reduceMotion || !targets.length) { setImageFailed(false); setActiveIndex(nextIndex); resetZoom(); return }
    galleryAnimation.current?.kill()
    galleryAnimation.current = gsap.to(targets, {
      autoAlpha: 0,
      scale: .985,
      duration: .13,
      ease: 'power2.out',
      onComplete: () => { setImageFailed(false); setActiveIndex(nextIndex); resetZoom() },
    })
  }, [activeIndex, images.length, reduceMotion, resetZoom])

  const navigateImage = useCallback((direction) => selectImage(activeIndex + direction), [activeIndex, selectImage])

  const applyZoom = useCallback((nextValue) => {
    const nextZoom = Math.min(4, Math.max(1, nextValue))
    zoomValue.current = nextZoom
    setZoom(nextZoom)
    if (nextZoom === 1) {
      panValue.current = { x: 0, y: 0 }
      setPan({ x: 0, y: 0 })
    }
  }, [])

  const closeZoom = useCallback(() => {
    setZoomOpen(false)
    resetZoom()
    requestAnimationFrame(() => expandButtonRef.current?.focus({ preventScroll: true }))
  }, [resetZoom])

  useEffect(() => {
    if (!zoomOpen) return undefined
    requestAnimationFrame(() => zoomCloseRef.current?.focus({ preventScroll: true }))
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); closeZoom(); return }
      if (event.key === 'ArrowLeft') { event.preventDefault(); event.stopImmediatePropagation(); navigateImage(-1); return }
      if (event.key === 'ArrowRight') { event.preventDefault(); event.stopImmediatePropagation(); navigateImage(1); return }
      if (event.key !== 'Tab' || !zoomViewerRef.current) return
      const focusable = [...zoomViewerRef.current.querySelectorAll('button:not([disabled])')]
      if (!focusable.length) return
      event.stopImmediatePropagation()
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus() }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus() }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [closeZoom, navigateImage, zoomOpen])

  useEffect(() => () => galleryAnimation.current?.kill(), [])

  const pointerDistance = () => {
    const points = [...activePointers.current.values()]
    return points.length >= 2 ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) : 0
  }

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId)
    activePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (activePointers.current.size === 2) pinchStart.current = { distance: pointerDistance(), zoom: zoomValue.current }
    else dragStart.current = { x: event.clientX, y: event.clientY, pan: panValue.current }
  }

  const handlePointerMove = (event) => {
    if (!activePointers.current.has(event.pointerId)) return
    activePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (activePointers.current.size >= 2 && pinchStart.current?.distance) {
      applyZoom(pinchStart.current.zoom * (pointerDistance() / pinchStart.current.distance))
      return
    }
    if (zoomValue.current > 1 && dragStart.current) {
      const nextPan = { x: dragStart.current.pan.x + event.clientX - dragStart.current.x, y: dragStart.current.pan.y + event.clientY - dragStart.current.y }
      panValue.current = nextPan
      setPan(nextPan)
    }
  }

  const handlePointerEnd = (event) => {
    activePointers.current.delete(event.pointerId)
    if (activePointers.current.size < 2) pinchStart.current = null
    if (!activePointers.current.size) dragStart.current = null
  }

  const zoomViewer = zoomOpen && imageUrl ? createPortal(<div ref={zoomViewerRef} className="product-zoom-viewer" role="dialog" aria-modal="true" aria-label={`${product.name} image viewer`} onMouseDown={(event) => { if (event.target === event.currentTarget) closeZoom() }}>
    <div className="product-zoom-toolbar" aria-label="Image zoom controls">
      <button type="button" onClick={() => applyZoom(zoomValue.current - .25)} disabled={zoom <= 1} aria-label="Zoom out"><ZoomOut size={19} /></button>
      <output aria-live="polite" aria-label="Current zoom">{Math.round(zoom * 100)}%</output>
      <button type="button" onClick={() => applyZoom(zoomValue.current + .25)} disabled={zoom >= 4} aria-label="Zoom in"><ZoomIn size={19} /></button>
      <button type="button" onClick={resetZoom} disabled={zoom === 1 && pan.x === 0 && pan.y === 0} aria-label="Reset zoom"><RotateCcw size={18} /></button>
    </div>
    <button ref={zoomCloseRef} type="button" className="product-zoom-close" onClick={closeZoom} aria-label="Close full-screen image viewer"><X size={23} /></button>
    {images.length > 1 && <button type="button" className="product-zoom-arrow previous" onClick={() => navigateImage(-1)} aria-label="Previous product image"><ChevronLeft size={27} /></button>}
    <div className="product-zoom-stage" onWheel={(event) => { event.preventDefault(); applyZoom(zoomValue.current + (event.deltaY < 0 ? .25 : -.25)) }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd} onDoubleClick={() => applyZoom(zoomValue.current > 1 ? 1 : 2)}>
      <img ref={zoomImageRef} src={imageUrl} alt={`${product.name}, image ${activeIndex + 1} of ${images.length}`} draggable="false" style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})` }} />
    </div>
    {images.length > 1 && <button type="button" className="product-zoom-arrow next" onClick={() => navigateImage(1)} aria-label="Next product image"><ChevronRight size={27} /></button>}
    <span className="product-zoom-counter" aria-live="polite">{activeIndex + 1} / {images.length}</span>
  </div>, document.body) : null

  return <div className="product-modal-gallery">
    <div className="product-modal-image-wrap">
      {imageUrl && !imageFailed ? <img ref={imageRef} className="product-modal-image" src={imageUrl} alt={product.name} onError={() => setImageFailed(true)} /> : <div className="product-modal-image-placeholder" role="img" aria-label={`${product.name} image unavailable`}><ShoppingCart size={36} /><span>Image unavailable</span></div>}
      <span className={`product-modal-diet ${product.veg ? 'veg' : 'nonveg'}`} title={product.veg ? 'Vegetarian' : 'Non-vegetarian'}>{product.veg ? <i /> : <b />}</span>
      {images.length > 1 && <><button type="button" className="product-modal-gallery-arrow previous" onClick={() => navigateImage(-1)} aria-label="Previous product image"><ChevronLeft size={22} /></button><button type="button" className="product-modal-gallery-arrow next" onClick={() => navigateImage(1)} aria-label="Next product image"><ChevronRight size={22} /></button></>}
      {imageUrl && <button ref={expandButtonRef} type="button" className="product-modal-expand" aria-label={`Open full-screen ${product.name} photo`} onClick={() => { resetZoom(); setZoomOpen(true) }}><Maximize2 size={17} /></button>}
    </div>
    {images.length > 1 && <div className="product-modal-thumbnails" aria-label="Product photos">{images.map((image, index) => <button type="button" key={`${image}-${index}`} className={activeIndex === index ? 'active' : ''} onClick={() => selectImage(index)} aria-label={`Show product image ${index + 1}`} aria-pressed={activeIndex === index}><img src={productImageUrl(image, 220)} alt="" loading="lazy" /></button>)}</div>}
    {zoomViewer}
  </div>
}

function ReviewStars({ value, size = 15 }) {
  return <span className="product-review-stars" aria-label={`${value} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={size} fill={star <= Math.round(value) ? 'currentColor' : 'none'} />)}</span>
}

function formatReviewDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function CustomerReviews({ productId, reduceMotion, onStatsChange, demoStats }) {
  const endpoint = configuredReviewsEndpoint(productId)
  const [sort, setSort] = useState('all')
  const [page, setPage] = useState(0)
  const [reviews, setReviews] = useState([])
  const [localReviews, setLocalReviews] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem(`tastybites-reviews-${productId}`) || '[]') } catch { return [] }
  })
  const [summary, setSummary] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(Boolean(endpoint))
  const [loadError, setLoadError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoOptionsOpen, setPhotoOptionsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const submitLock = useRef(false)
  const submissionKey = useRef(null)
  const reviewListRef = useRef(null)
  const barsRef = useRef(null)
  const reviewTriggerRef = useRef(null)
  const reviewDialogRef = useRef(null)
  const successDoneRef = useRef(null)
  const photoCameraInputRef = useRef(null)
  const photoFileInputRef = useRef(null)

  useEffect(() => {
    if (!photo) { setPhotoPreview(''); return undefined }
    const previewUrl = URL.createObjectURL(photo)
    setPhotoPreview(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [photo])

  const getReviews = useCallback(async (offset = 0, signal) => {
    if (!endpoint) return
    const url = new URL(endpoint, window.location.origin)
    url.searchParams.set('sort', sort)
    url.searchParams.set('limit', String(PAGE_SIZE))
    url.searchParams.set('offset', String(offset))
    const response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`Could not load reviews (${response.status}).`)
    const result = await response.json()
    const nextReviews = Array.isArray(result.reviews) ? result.reviews : []
    const nextSummary = result.summary ? { ...result.summary, count: result.summary.count ?? result.total } : result.total !== undefined ? { count: result.total } : null
    const total = Number(result.total ?? result.summary?.count ?? result.summary?.totalReviews)
    const nextHasMore = typeof result.hasMore === 'boolean' ? result.hasMore : Number.isFinite(total) ? offset + nextReviews.length < total : nextReviews.length === PAGE_SIZE
    return { reviews: nextReviews, summary: nextSummary, hasMore: nextHasMore }
  }, [endpoint, sort])

  useEffect(() => {
    if (!endpoint) return undefined
    const controller = new AbortController()
    getReviews(page * PAGE_SIZE, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setReviews(result.reviews)
        setSummary(result.summary)
        setHasMore(result.hasMore)
      })
      .catch((error) => { if (error.name !== 'AbortError') setLoadError(error.message || 'Reviews could not be loaded.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [endpoint, getReviews, page, refreshKey])

  useEffect(() => {
    if (reduceMotion) return
    if (barsRef.current) {
      const bars = barsRef.current.querySelectorAll('[data-rating-fill]')
      gsap.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: .55, stagger: .06, ease: 'power2.out', transformOrigin: 'left center' })
    }
    if (reviewListRef.current) gsap.fromTo(reviewListRef.current.querySelectorAll('.product-review-item'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .28, stagger: .07, ease: 'power2.out' })
  }, [reviews, reduceMotion])

  useEffect(() => {
    if (!formOpen) return undefined
    const priorFocus = document.activeElement
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setFormOpen(false); return }
      if (event.key !== 'Tab' || !reviewDialogRef.current) return
      const focusable = [...reviewDialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled])')]
      if (!focusable.length) return
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus() }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus() }
    }
    document.addEventListener('keydown', onKeyDown, true)
    requestAnimationFrame(() => reviewDialogRef.current?.querySelector('input')?.focus())
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      requestAnimationFrame(() => { if (priorFocus instanceof HTMLElement) priorFocus.focus({ preventScroll: true }) })
    }
  }, [formOpen])

  useEffect(() => {
    if (!submitted) return undefined
    const frame = requestAnimationFrame(() => successDoneRef.current?.focus({ preventScroll: true }))
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); setSubmitted(false); setFormOpen(false) }
      if (event.key === 'Tab') { event.preventDefault(); successDoneRef.current?.focus() }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [submitted])

  const loadedCount = reviews.length + localReviews.length
  const totalCount = Number(summary?.count ?? summary?.totalReviews ?? summary?.reviewCount ?? ((demoStats?.count || 0) + localReviews.length || loadedCount))
  const average = Number(summary?.average ?? summary?.averageRating ?? summary?.avgRating)
  const combinedRatings = [...reviews, ...localReviews]
  const actualAverage = Number.isFinite(average) && average > 0 ? average : combinedRatings.length ? (combinedRatings.reduce((sum, review) => sum + Number(review.rating || 0), 0) + (demoStats?.average || 0) * (demoStats?.count || 0)) / ((demoStats?.count || 0) + combinedRatings.length) : Number(demoStats?.average) || 0
  const ratingDistribution = summary?.distribution || summary?.ratingDistribution || (demoStats && !endpoint
    ? demoStats.distribution.map(({ stars, count }) => ({ stars, count: count + localReviews.filter((review) => Number(review.rating) === stars).length }))
    : distributionFor(combinedRatings, summary || {}))

  const submitReview = async (event) => {
    event.preventDefault()
    if (!rating || !name.trim() || !comment.trim() || submitLock.current) return
    submitLock.current = true
    setSubmitting(true)
    setSubmitError('')
    try {
      const fields = { name: name.trim(), rating, comment: comment.trim() }
      if (!endpoint) {
        const photoUrl = photo ? await compressReviewPhoto(photo) : undefined
        const localReview = { id: globalThis.crypto?.randomUUID?.() || `${Date.now()}`, ...fields, ...(photoUrl ? { photoUrl } : {}), createdAt: new Date().toISOString() }
        const nextReviews = [localReview, ...localReviews]
        window.localStorage.setItem(`tastybites-reviews-${productId}`, JSON.stringify(nextReviews))
        setLocalReviews(nextReviews)
        setSubmitted(true)
        setFormOpen(false)
        setName('')
        setRating(0)
        setComment('')
        setPhoto(null)
        return
      }
      submissionKey.current ||= globalThis.crypto?.randomUUID?.() || `${productId}-${Math.random().toString(36).slice(2)}`
      const headers = { Accept: 'application/json', 'Idempotency-Key': submissionKey.current }
      let body
      if (photo) {
        body = new FormData()
        Object.entries(fields).forEach(([key, value]) => body.append(key, String(value)))
        body.append('photo', photo)
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(fields)
      }
      const response = await fetch(endpoint, { method: 'POST', headers, body })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.message || `Your review could not be saved (${response.status}).`)
      const savedReview = {
        id: result.review?.id || globalThis.crypto?.randomUUID?.() || `${Date.now()}`,
        ...fields,
        createdAt: new Date().toISOString(),
        ...(result.review || {}),
        rating: Number(result.review?.rating ?? fields.rating),
      }
      setReviews((current) => [savedReview, ...current.filter((review) => review.id !== savedReview.id)])
      const serverSummary = result.summary || {}
      const suppliedCount = Number(serverSummary.count ?? serverSummary.totalReviews ?? result.total)
      const nextCount = Number.isFinite(suppliedCount) && suppliedCount >= 0 ? suppliedCount : totalCount + 1
      const suppliedAverage = Number(serverSummary.average ?? serverSummary.averageRating ?? serverSummary.avgRating)
      const nextAverage = Number.isFinite(suppliedAverage) && suppliedAverage > 0
        ? suppliedAverage
        : ((actualAverage * totalCount) + fields.rating) / Math.max(1, totalCount + 1)
      const nextDistribution = ratingDistribution.map((entry) => ({ ...entry, count: entry.count + (entry.stars === fields.rating ? 1 : 0) }))
      setSummary({ ...serverSummary, count: nextCount, average: nextAverage, distribution: serverSummary.distribution || serverSummary.ratingDistribution || nextDistribution })
      setSubmitted(true)
      setFormOpen(false)
      setName('')
      setRating(0)
      setComment('')
      setPhoto(null)
      submissionKey.current = null
      setLoading(true)
      setPage(0)
      setRefreshKey((key) => key + 1)
    } catch (error) {
      setSubmitError(error.message || 'Your review could not be saved. Please try again.')
    } finally {
      submitLock.current = false
      setSubmitting(false)
    }
  }

  const totalForBars = Number(summary?.count ?? summary?.totalReviews ?? ((demoStats?.count || 0) + localReviews.length || ratingDistribution.reduce((sum, item) => sum + item.count, 0)))
  const pageCount = totalCount ? Math.max(1, Math.ceil(totalCount / PAGE_SIZE)) : hasMore ? page + 2 : Math.max(1, page + 1)

  useEffect(() => { onStatsChange({ average: actualAverage, count: totalCount }) }, [actualAverage, totalCount, onStatsChange])

  return <section className="product-customer-reviews" aria-labelledby="product-reviews-title">
    <div className="product-reviews-heading">
      <h3 id="product-reviews-title">Customer Reviews</h3>
      <button ref={reviewTriggerRef} type="button" className="product-write-review" onClick={() => { setFormOpen(true); setSubmitError(''); setSubmitted(false) }}>
        <Plus size={17} />Write a Review
      </button>
    </div>

    {formOpen && createPortal(<div className="product-review-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) setFormOpen(false) }}>
      <form ref={reviewDialogRef} className="product-review-form" role="dialog" aria-modal="true" aria-labelledby="product-review-dialog-title" onSubmit={submitReview}>
      <div className="product-review-form-heading"><div><strong id="product-review-dialog-title">Write a Review</strong><small>Share your experience with this dish.</small></div><button type="button" onClick={() => { if (!submitting) setFormOpen(false) }} disabled={submitting} aria-label="Close review form"><X size={19} /></button></div>
      {!endpoint && <p className="product-review-form-note">Testing mode: this review is saved on this device only.</p>}
      <label className="product-review-input-label">Customer Name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={80} required disabled={submitting} placeholder="Your name" /></label>
      <fieldset className="product-review-star-picker" disabled={submitting}>
        <legend>Your rating <span aria-hidden="true">*</span></legend>
        <div>{[1, 2, 3, 4, 5].map((star) => <button type="button" key={star} onClick={() => setRating(star)} aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`} aria-pressed={rating === star}><Star size={24} fill={star <= rating ? 'currentColor' : 'none'} /></button>)}</div>
        {!rating && <small>Select a star rating to continue.</small>}
      </fieldset>
      <label className="product-review-input-label">Your review<textarea value={comment} onChange={(event) => setComment(event.target.value)} minLength={3} maxLength={1200} required disabled={submitting} placeholder="What did you enjoy about this dish?" rows={3} /></label>
      <div className="product-review-photo-picker">
        <input ref={photoCameraInputRef} className="product-review-photo-input" type="file" accept="image/*" capture="environment" onChange={(event) => { setPhoto(event.target.files?.[0] || null); setPhotoOptionsOpen(false) }} disabled={submitting} />
        <input ref={photoFileInputRef} className="product-review-photo-input" type="file" accept="image/*" onChange={(event) => { setPhoto(event.target.files?.[0] || null); setPhotoOptionsOpen(false) }} disabled={submitting} />
        {photo ? <div className="product-review-photo-preview"><img src={photoPreview} alt="Selected food photo preview"/><span title={photo.name}>{photo.name}</span><button type="button" onClick={() => { setPhoto(null); setPhotoOptionsOpen(false); if (photoCameraInputRef.current) photoCameraInputRef.current.value = ''; if (photoFileInputRef.current) photoFileInputRef.current.value = '' }} disabled={submitting} aria-label="Remove selected food photo"><X size={16}/></button></div> : <>
          <button type="button" className="product-review-photo-trigger" onClick={() => setPhotoOptionsOpen((open) => !open)} aria-expanded={photoOptionsOpen} aria-haspopup="true" disabled={submitting}><Camera size={17}/><span>Add a food photo (optional)</span><ChevronDown size={15}/></button>
          {photoOptionsOpen && <div className="product-review-photo-options"><button type="button" onClick={() => photoCameraInputRef.current?.click()} disabled={submitting}><Camera size={16}/>Take a photo</button><button type="button" onClick={() => photoFileInputRef.current?.click()} disabled={submitting}><ImagePlus size={16}/>Choose from files</button></div>}
        </>}
      </div>
      {submitError && <p className="product-review-submit-error" role="alert">{submitError}</p>}
      <button className="product-review-submit" type="submit" disabled={submitting || !rating || !name.trim() || !comment.trim()}>{submitting ? 'Submitting…' : 'Submit Review'}</button>
      </form>
    </div>, document.body)}
    {submitted && createPortal(<div className="product-review-success-backdrop">
      <motion.section className="product-review-success-dialog" role="dialog" aria-modal="true" aria-labelledby="product-review-success-title" aria-describedby="product-review-success-message" initial={reduceMotion ? false : { opacity: 0, scale: .82, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 25, mass: .7 }}>
        {!reduceMotion && <div className="product-review-confetti" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <motion.i key={index} style={{ '--confetti-color': ['#20a464', '#ff6a00', '#f0b429', '#4285f4'][index % 4] }} initial={{ opacity: 0, scale: .3, x: 0, y: 0, rotate: 0 }} animate={{ opacity: [0, 1, 0], scale: [.3, 1, .7], x: Math.cos(index / 14 * Math.PI * 2) * (44 + (index % 3) * 8), y: Math.sin(index / 14 * Math.PI * 2) * (42 + (index % 4) * 7), rotate: (index % 2 ? 1 : -1) * (80 + index * 11) }} transition={{ delay: .18, duration: .85, ease: 'easeOut' }} />)}</div>}
        <motion.div className="product-review-success-icon" initial={reduceMotion ? false : { scale: .45 }} animate={{ scale: 1 }} transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 18, delay: .08 }}>
          <svg viewBox="0 0 52 52" aria-hidden="true"><motion.path d="M14 27.5 22 35l16-18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={reduceMotion ? { duration: 0 } : { duration: .42, delay: .2, ease: 'easeOut' }} /></svg>
        </motion.div>
        <h3 id="product-review-success-title">Review Submitted Successfully!</h3>
        <p id="product-review-success-message">Thank you for your feedback! Your review has been submitted successfully.</p>
        <button ref={successDoneRef} type="button" className="product-review-success-done" onClick={() => { setSubmitted(false); setFormOpen(false) }}>Done</button>
      </motion.section>
    </div>, document.body)}
    {!formOpen && <>
    <div className="product-review-summary">
      <div className="product-review-average">
        <strong>{actualAverage ? actualAverage.toFixed(1) : '—'}</strong>
        {actualAverage > 0 && <ReviewStars value={actualAverage} size={18} />}
        <span>{totalCount ? `Based on ${totalCount.toLocaleString()} ${totalCount === 1 ? 'review' : 'reviews'}` : 'No reviews yet'}</span>
      </div>
      <div className="product-rating-distribution" ref={barsRef}>
        {ratingDistribution.map(({ stars, count }) => <div className="product-rating-row" key={stars}><span>{stars}</span><Star size={13} fill="currentColor" /><span className="product-rating-track"><i data-rating-fill style={{ transform: 'scaleX(1)', width: `${totalForBars ? Math.min(100, count / totalForBars * 100) : 0}%` }} /></span><small>{totalForBars ? `${Math.round(count / totalForBars * 100)}%` : '0%'}</small></div>)}
      </div>
    </div>

    <div className="product-review-toolbar">
      <span>{loading ? 'Loading reviews…' : `${totalCount.toLocaleString()} ${totalCount === 1 ? 'review' : 'reviews'}${!endpoint && demoStats ? ' · sample data' : ''}`}</span>
      <label>Sort by<select value={sort} onChange={(event) => { setLoading(true); setLoadError(''); setPage(0); setSort(event.target.value) }} aria-label="Sort customer reviews"><option value="all">All Reviews</option><option value="newest">Newest</option><option value="highest">Highest Rated</option></select><ChevronDown size={14} /></label>
    </div>
    {loadError && <p className="product-review-load-error" role="status">{loadError}</p>}
    {!endpoint && !loading && <div className="product-reviews-empty"><Star size={19} /><p>{demoStats ? 'Sample rating summary for testing. Connect the review service to collect real customer reviews.' : 'Customer reviews will appear here once a review service is connected.'}</p></div>}
    {endpoint && !loading && !reviews.length && !loadError && <div className="product-reviews-empty"><Star size={19} /><p>No customer reviews yet. Be the first to share your experience.</p></div>}
    {loading && <div className="product-reviews-loading" aria-label="Loading customer reviews"><i /><i /><i /></div>}
    <div className="product-review-list" ref={reviewListRef}>
      {[...localReviews, ...reviews].map((review, index) => {
        const reviewerName = review.name || review.customerName || 'Guest'
        const reviewImages = review.photos || review.photoUrls || (review.photoUrl ? [review.photoUrl] : [])
        return <article className="product-review-item" key={review.id || `${reviewerName}-${review.createdAt || index}`}>
          <span className="product-review-avatar" aria-hidden="true">{reviewerName.trim().charAt(0).toUpperCase()}</span>
          <div className="product-review-content"><div className="product-review-person"><strong>{reviewerName}</strong><ReviewStars value={Number(review.rating) || 0} size={13} />{formatReviewDate(review.createdAt || review.date) && <time dateTime={review.createdAt || review.date}>{formatReviewDate(review.createdAt || review.date)}</time>}</div><p>{review.comment || review.text}</p>{reviewImages.length > 0 && <div className="product-review-photos">{reviewImages.slice(0, 3).map((url, photoIndex) => <img key={`${url}-${photoIndex}`} src={url} alt={`Food photo shared by ${reviewerName}`} loading="lazy" />)}</div>}</div>
        </article>
      })}
    </div>
    {endpoint && pageCount > 1 && <nav className="product-review-pagination" aria-label="Customer review pages">
      <button type="button" onClick={() => { setLoading(true); setPage((current) => Math.max(0, current - 1)) }} disabled={loading || page === 0} aria-label="Previous review page">‹</button>
      <span>Page <strong>{page + 1}</strong> of {pageCount}</span>
      <button type="button" onClick={() => { setLoading(true); setPage((current) => Math.min(pageCount - 1, current + 1)) }} disabled={loading || page >= pageCount - 1 || !hasMore && page + 1 >= pageCount} aria-label="Next review page">›</button>
    </nav>}
    </>}
  </section>
}

export default function ProductDetailsModal({ product, quantityInCart, onAddToCart, cartIconRef, onClose }) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [reviewStats, setReviewStats] = useState({ average: Number(product.rating) || 0, count: Number(product.reviewCount) || 0 })
  const overlayRef = useRef(null)
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)
  const quantityRef = useRef(null)
  const plusRef = useRef(null)
  const addButtonRef = useRef(null)
  const closeStarted = useRef(false)
  const closeTimer = useRef(null)
  const closeTimeline = useRef(null)
  const closingCallback = useRef(onClose)

  useEffect(() => { closingCallback.current = onClose }, [onClose])

  const beginClose = useCallback(() => {
    if (closeStarted.current) return
    closeStarted.current = true
    if (reduceMotion) { closingCallback.current(); return }
    closeTimeline.current = gsap.timeline({ onComplete: () => closingCallback.current() })
    closeTimeline.current.to(modalRef.current, { autoAlpha: 0, scale: .96, y: 15, duration: .25, ease: 'power2.in' }, 0)
    closeTimeline.current.to(overlayRef.current, { autoAlpha: 0, duration: .25, ease: 'power2.in' }, 0)
  }, [reduceMotion])

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
      if (event.key === 'Escape') { event.preventDefault(); beginClose() }
      if (event.key !== 'Tab' || !modalRef.current) return
      const focusable = [...modalRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]')]
      if (!focusable.length) return
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus() }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      context.revert()
      closeTimeline.current?.kill()
      if (originalFocus instanceof HTMLElement) originalFocus.focus({ preventScroll: true })
      window.clearTimeout(closeTimer.current)
    }
  }, [beginClose, reduceMotion])

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
    if (cartIconRef?.current && !reduceMotion) gsap.fromTo(cartIconRef.current, { scale: 1, rotate: 0 }, { scale: 1.2, rotate: -6, duration: .14, yoyo: true, repeat: 1, ease: 'power2.out' })
    if (addButtonRef.current && !reduceMotion) gsap.fromTo(addButtonRef.current, { scale: .975 }, { scale: 1, duration: .25, ease: 'back.out(2)' })
    closeTimer.current = window.setTimeout(beginClose, reduceMotion ? 350 : 650)
  }

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null
  const modal = <div ref={overlayRef} className="product-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) beginClose() }}>
    <section ref={modalRef} className="product-details-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" aria-describedby="product-modal-description" tabIndex={-1}>
      <button ref={closeButtonRef} type="button" className="product-modal-close" onClick={beginClose} aria-label="Close product details"><X size={21} /></button>
      <div className="product-modal-layout">
        <ProductImageGallery product={product} reduceMotion={reduceMotion} />
        <div className="product-modal-info">
          <h2 className="product-modal-animate product-modal-title" id="product-modal-title">{product.name}<span className={`product-modal-title-diet ${product.veg ? 'veg' : 'nonveg'}`} aria-label={product.veg ? 'Vegetarian' : 'Non-vegetarian'}>{product.veg ? <i /> : <b />}</span></h2>
          <div className="product-modal-meta product-modal-animate"><button type="button" className="product-modal-review" onClick={() => document.getElementById('product-reviews-title')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })}><Star size={17} fill={(reviewStats.average || product.rating) ? 'currentColor' : 'none'} /> {(reviewStats.average || product.rating) ? (reviewStats.average || product.rating).toFixed(1) : 'No rating'} <small>({(reviewStats.count || product.reviewCount || 0).toLocaleString()} {(reviewStats.count || product.reviewCount) === 1 ? 'review' : 'reviews'})</small></button>{product.popular && <span className="product-modal-popular"><Flame size={17} fill="currentColor" /> Popular Item</span>}</div>
          <p className="product-modal-description product-modal-animate" id="product-modal-description">{product.detailDescription || product.description}</p>
          <div className="product-modal-price product-modal-animate"><strong>₹{product.price.toLocaleString('en-IN')}</strong>{product.oldPrice && <del>₹{product.oldPrice.toLocaleString('en-IN')}</del>}{discount && <span>{discount}% OFF</span>}</div>
          <div className="product-modal-quantity product-modal-animate"><strong>Quantity</strong><div><button type="button" onClick={() => changeQuantity(-1)} aria-label="Decrease quantity" disabled={quantity === 1}><Minus size={17} /></button><output ref={quantityRef} aria-live="polite" aria-label="Selected quantity">{quantity}</output><button ref={plusRef} type="button" onClick={() => changeQuantity(1)} aria-label="Increase quantity"><Plus size={18} /></button></div><small>{quantityInCart > 0 ? `${quantityInCart} already in your cart` : ''}</small></div>
          <div className="product-modal-add-wrap product-modal-animate"><button ref={addButtonRef} type="button" className={`product-modal-add ${added ? 'is-added' : ''}`} onClick={addProduct}><span>{added ? <Check size={20} /> : <ShoppingCart size={20} />}</span>{added ? 'Added to Cart' : 'Add to Cart'}</button></div>
          <div className="product-modal-detail product-modal-animate"><span className="product-modal-detail-icon ingredients"><Leaf size={20} /></span><div><strong>Ingredients</strong><p>{product.ingredients?.length ? product.ingredients.join(', ') : 'Please ask the restaurant for ingredient details.'}</p></div></div>
          <div className="product-modal-detail product-modal-animate"><span className="product-modal-detail-icon allergens"><AlertCircle size={19} /></span><div><strong>Allergen Information</strong><p>{product.allergens || 'Allergen details are not available. Please ask the restaurant before ordering.'}</p></div></div>
          <CustomerReviews key={product.id} productId={product.id} reduceMotion={reduceMotion} onStatsChange={setReviewStats} demoStats={product.reviewCount ? { average: product.rating, count: product.reviewCount, distribution: [{ stars: 5, count: 90 }, { stars: 4, count: 26 }, { stars: 3, count: 9 }, { stars: 2, count: 2 }, { stars: 1, count: 1 }] } : null} />
        </div>
      </div>
    </section>
  </div>

  return createPortal(modal, document.body)
}
