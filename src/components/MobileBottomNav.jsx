import { useCallback, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ClipboardList, ShoppingCart, Tag, UtensilsCrossed } from 'lucide-react'
import './MobileBottomNav.css'

const navigationItems = [
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'cart', label: 'Cart', icon: ShoppingCart },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'offers', label: 'Offer', icon: Tag },
]

const DOCK_MAGNIFICATION = 1.5
const DOCK_DISTANCE = 120
const DOCK_ICON_SIZE = 40
const DOCK_SPRING = { stiffness: 400, damping: 25, mass: 0.4 }

function DockItem({ item, active, cartQuantity, onNavigate, mouseX }) {
  const itemRef = useRef(null)
  const distanceFromMouse = useTransform(mouseX, (clientX) => {
    const element = itemRef.current
    if (!element || !Number.isFinite(clientX)) return Infinity
    const rect = element.getBoundingClientRect()
    return Math.abs(clientX - (rect.left + rect.width / 2))
  })
  const scaleTarget = useTransform(distanceFromMouse, (distance) => {
    const gaussian = (DOCK_MAGNIFICATION - 1) * Math.exp(-(distance * distance) / (2 * DOCK_DISTANCE * DOCK_DISTANCE)) + 1
    return gaussian
  })
  const scale = useSpring(scaleTarget, DOCK_SPRING)
  const Icon = item.icon
  const badgeLabel = cartQuantity > 99 ? '99+' : cartQuantity
  const accessibleLabel = item.id === 'cart' ? `${item.label}, ${cartQuantity} ${cartQuantity === 1 ? 'item' : 'items'}` : item.label

  return (
    <motion.button
      ref={itemRef}
      type="button"
      className={`mobile-bottom-nav__item ${active ? 'is-active' : ''}`}
      aria-label={accessibleLabel}
      aria-current={active ? 'page' : undefined}
      onClick={() => onNavigate(item.id)}
      onMouseEnter={(event) => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) mouseX.set(event.clientX)
      }}
      onMouseMove={(event) => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) mouseX.set(event.clientX)
      }}
      onMouseLeave={() => mouseX.set(Infinity)}
      whileTap={{ scale: 0.96 }}
    >
      {active && <motion.span className="mobile-bottom-nav__active-indicator" layoutId="mobile-bottom-nav-active" transition={{ type: 'spring', stiffness: 400, damping: 30 }} aria-hidden="true" />}
      <motion.span className="mobile-bottom-nav__icon" style={{ scale, width: DOCK_ICON_SIZE, height: DOCK_ICON_SIZE }}>
        <Icon aria-hidden="true" strokeWidth={2.1} />
        {item.id === 'cart' && cartQuantity > 0 && <span className="mobile-bottom-nav__badge" aria-hidden="true">{badgeLabel}</span>}
      </motion.span>
      <span className="mobile-bottom-nav__label">{item.label}</span>
    </motion.button>
  )
}

export default function MobileBottomNav({ activeTab, cartQuantity = 0, onNavigate }) {
  const mouseX = useMotionValue(Infinity)
  const resetMagnification = useCallback(() => mouseX.set(Infinity), [mouseX])

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary navigation">
      <div className="mobile-bottom-nav__surface" onMouseMove={(event) => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) mouseX.set(event.clientX)
      }} onMouseLeave={resetMagnification}>
        {navigationItems.map((item) => (
          <DockItem key={item.id} item={item} active={activeTab === item.id} cartQuantity={cartQuantity} onNavigate={onNavigate} mouseX={mouseX} />
        ))}
      </div>
    </nav>
  )
}
