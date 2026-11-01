import { useEffect, useState } from 'react'
import { Bell, Bike, Check, ChevronRight, Clock3, CreditCard, Database, Download, FileText, ImagePlus, LockKeyhole, Palette, Percent, RotateCcw, Settings2, ShieldCheck, Store, Trash2, Users, Utensils, X } from 'lucide-react'
import './SettingsManagementPage.css'

const SETTINGS_KEY = 'tastybites-admin-settings'
const resetKeys = ['tastybites-admin-orders', 'tastybites-admin-tables', 'tastybites-menu-products', 'tastybites-menu-categories', SETTINGS_KEY]
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const defaultHours = days.map((day, index) => ({ day, enabled: true, open: '09:00', close: index > 3 && index < 6 ? '23:30' : '23:00' }))
const defaults = {
  general: { name: 'Tasty Bites', phone: '+91 9876543210', email: 'tastybites@gmail.com', website: 'https://tastybites.com', description: 'Good Food, Good Mood. Fresh ingredients, delicious food and best service for you.' },
  restaurant: { address: 'House No. 12, Gandhi Nagar, Kankarbagh, Patna - 800020', city: 'Patna', state: 'Bihar', pincode: '800020', gstNumber: '10ABCDE1234F1Z5', logo: '' },
  menu: { enabled: true, showOutOfStock: false, customerReviews: true, itemNotes: true, dietaryLabels: true },
  hours: defaultHours,
  tax: { gstRate: '5', serviceCharge: '0', deliveryCharge: '30', minimumOrder: '200', applyGst: true, applyServiceCharge: false, freeDelivery: true },
  operations: { dineIn: true, takeaway: true, delivery: true, autoAccept: false, orderConfirmation: true, customerCancellation: true, deliveryMinutes: '25' },
  payments: { cash: true, upi: true, card: true, wallet: true, online: false },
  notifications: { newOrder: true, orderStatus: true, paymentReceived: true, customerRegistration: false, lowStock: true },
  staff: { allowLogin: true, restrictByRole: true, viewOnly: false, orderAccess: true, menuAccess: true, members: [{ name: 'Aman Kumar', role: 'Manager' }, { name: 'Priya Singh', role: 'Cashier' }] },
  appearance: { primaryColor: '#ff6900', theme: 'light', language: 'English', dateFormat: 'DD MMM YYYY', timeFormat: '12 Hour (AM/PM)' },
}
const readSettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null')
    if (!saved) return defaults
    return { ...defaults, ...saved, general: { ...defaults.general, ...saved.general }, restaurant: { ...defaults.restaurant, ...saved.restaurant }, menu: { ...defaults.menu, ...saved.menu }, tax: { ...defaults.tax, ...saved.tax }, operations: { ...defaults.operations, ...saved.operations }, payments: { ...defaults.payments, ...saved.payments }, notifications: { ...defaults.notifications, ...saved.notifications }, staff: { ...defaults.staff, ...saved.staff }, appearance: { ...defaults.appearance, ...saved.appearance }, hours: Array.isArray(saved.hours) && saved.hours.length === 7 ? saved.hours : defaults.hours }
  } catch { return defaults }
}
const getData = (key, fallback = []) => { try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback } catch { return fallback } }
const toCsv = (rows) => rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n')
const download = (fileName, content, type = 'text/csv;charset=utf-8') => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a'); link.href = url; link.download = fileName; link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
const exportRows = (kind) => {
  const orders = getData('tastybites-admin-orders', [])
  if (kind === 'orders') download('tasty-bites-orders.csv', toCsv([['Order ID', 'Customer', 'Phone', 'Type', 'Items', 'Amount', 'Status'], ...orders.map((o) => [o.id, o.customer || o.place, o.phone, o.type, o.items, o.price, o.status])]))
  if (kind === 'customers') {
    const customers = [...new Map(orders.filter((o) => o.customer || o.phone).map((o) => [`${o.customer || o.place}|${o.phone || ''}`, [o.customer || o.place, o.phone || '', o.address || '']])).values()]
    download('tasty-bites-customers.csv', toCsv([['Customer', 'Phone', 'Address'], ...customers]))
  }
  if (kind === 'menu') {
    const products = getData('tastybites-menu-products', [])
    const categories = getData('tastybites-menu-categories', [])
    download('tasty-bites-menu.json', JSON.stringify({ products, categories }, null, 2), 'application/json')
  }
  if (kind === 'reports') download('tasty-bites-report.csv', toCsv([['Metric', 'Value'], ['Total orders', orders.length], ['Revenue', orders.reduce((sum, order) => sum + Number(order.price || 0), 0)], ['Delivered orders', orders.filter((o) => ['Delivered', 'Completed'].includes(o.status)).length], ['Cancelled orders', orders.filter((o) => o.status === 'Cancelled').length]]))
}

function SettingCard({ id, icon: Icon, title, description, children, className = '' }) {
  return <section id={id} className={`settings-card ${className}`}><header className="settings-card-heading"><span><Icon size={19}/></span><div><h2>{title}</h2><p>{description}</p></div></header>{children}</section>
}
function Toggle({ checked, onChange, label }) {
  return <button type="button" className={`settings-toggle ${checked ? 'on' : ''}`} role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}><span/></button>
}
function ToggleRow({ label, checked, onChange, icon: Icon }) {
  return <div className="settings-toggle-row">{Icon && <Icon size={15}/>}<span>{label}</span><Toggle checked={checked} onChange={onChange} label={label}/></div>
}
function Field({ label, value, onChange, type = 'text', placeholder, min, max, suffix }) {
  return <label className="settings-field"><span>{label}</span><div className="settings-input-wrap"><input type={type} value={value ?? ''} placeholder={placeholder} min={min} max={max} onChange={(event) => onChange(event.target.value)} />{suffix && <b>{suffix}</b>}</div></label>
}

export default function SettingsManagementPage({ onAppearanceChange, onResetData }) {
  const [settings, setSettings] = useState(readSettings)
  const [toast, setToast] = useState('')
  const [staffOpen, setStaffOpen] = useState(false)
  const [staffName, setStaffName] = useState('')
  const [staffRole, setStaffRole] = useState('Staff')
  const [pendingLogo, setPendingLogo] = useState('')
  useEffect(() => { onAppearanceChange?.(settings.appearance) }, [settings.appearance, onAppearanceChange])
  const flash = (message) => { setToast(message); window.clearTimeout(flash.timer); flash.timer = window.setTimeout(() => setToast(''), 2600) }
  const update = (group, key, value) => setSettings((current) => {
    const next = { ...current, [group]: { ...current[group], [key]: value } }
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)) } catch { flash('Could not save settings. The logo may be too large.') }
    return next
  })
  const updateHour = (index, key, value) => setSettings((current) => {
    const next = { ...current, hours: current.hours.map((hour, i) => i === index ? { ...hour, [key]: value } : hour) }
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)) } catch { flash('Could not save settings.') }
    return next
  })
  const save = (event) => {
    event?.preventDefault?.()
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); flash('Settings saved successfully') }
    catch { flash('Could not save settings. The logo may be too large.') }
  }
  const handleLogo = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { flash('Choose an image file for the restaurant logo'); return }
    if (file.size > 450 * 1024) { flash('Logo must be smaller than 450 KB'); return }
    const reader = new FileReader()
    reader.onload = () => { setPendingLogo(String(reader.result)); update('restaurant', 'logo', String(reader.result)) }
    reader.readAsDataURL(file)
  }
  const addStaff = (event) => {
    event.preventDefault()
    const name = staffName.trim()
    if (!name) return
    update('staff', 'members', [...settings.staff.members, { name, role: staffRole }])
    setStaffName(''); setStaffRole('Staff'); flash(`${name} added to staff list`)
  }
  const removeStaff = (index) => update('staff', 'members', settings.staff.members.filter((_, i) => i !== index))
  const exportAction = (kind) => { exportRows(kind); flash(`${{ orders: 'Orders', customers: 'Customers', menu: 'Menu', reports: 'Reports' }[kind]} export downloaded`) }
  const resetAll = () => {
    if (!window.confirm('Reset all Tasty Bites admin data? This clears saved orders, tables, menu edits, and settings from this browser.')) return
    resetKeys.forEach((key) => localStorage.removeItem(key))
    Object.keys(localStorage).filter((key) => key.startsWith('tastybites-reviews-')).forEach((key) => localStorage.removeItem(key))
    flash('Saved admin data was reset')
    window.setTimeout(() => onResetData?.(), 500)
  }
  const sections = [['general-settings','General',Settings2],['restaurant-settings','Restaurant',Store],['menu-settings','Menu',Utensils],['business-hours-settings','Business Hours',Clock3],['operations-settings','Orders & Delivery',Bike],['payment-settings','Payments',CreditCard],['notifications-settings','Notifications',Bell],['staff-settings','Staff & Access',Users],['appearance-settings','Appearance',Palette],['backup-settings','Backup & Data',Database]]
  const tabs = [['general-settings','General'],['restaurant-settings','Restaurant'],['menu-settings','Menu'],['operations-settings','Orders & Delivery'],['payment-settings','Payments'],['notifications-settings','Notifications'],['staff-settings','Staff & Access'],['appearance-settings','Appearance'],['backup-settings','Backup & Data']]
  return <div className="settings-page" style={{ '--settings-accent': settings.appearance.primaryColor }}>
    <header className="settings-page-heading"><div><h1>Settings</h1><p>Manage your restaurant settings, preferences and configurations.</p></div><div className="settings-heading-status"><span><i/>Settings are saved automatically</span><button type="button" onClick={save}><Check size={16}/>Save Settings</button></div></header>
    <nav className="settings-tabs" aria-label="Settings sections">{tabs.map(([id,label])=>{const Icon=sections.find(([sectionId])=>sectionId===id)?.[2];return <button type="button" key={id} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}><Icon size={15}/>{label}</button>})}</nav>
    <form className="settings-grid" onSubmit={save}>
      <SettingCard id="general-settings" icon={Settings2} title="Basic Information" description="Update your restaurant name, contact and basic details.">
        <div className="settings-fields two"><Field label="Restaurant Name" value={settings.general.name} onChange={(v)=>update('general','name',v)}/><Field label="Phone Number" value={settings.general.phone} onChange={(v)=>update('general','phone',v)} type="tel"/><Field label="Email Address" value={settings.general.email} onChange={(v)=>update('general','email',v)} type="email"/><Field label="Website (Optional)" value={settings.general.website} onChange={(v)=>update('general','website',v)} type="url"/></div>
        <label className="settings-field"><span>Description</span><textarea rows="2" value={settings.general.description} onChange={(event)=>update('general','description',event.target.value)}/></label><button className="settings-card-save" type="submit">Save Changes</button>
      </SettingCard>
      <SettingCard id="restaurant-settings" icon={Store} title="Restaurant Details" description="Set your restaurant address, logo and business information.">
        <div className="restaurant-settings-layout"><div className="logo-uploader"><div className="restaurant-logo-preview">{(pendingLogo || settings.restaurant.logo) ? <img src={pendingLogo || settings.restaurant.logo} alt="Restaurant logo"/> : <><img src="/admin-logo.png" alt=""/><b>Tasty <i>Bites</i></b><small>RESTAURANT</small></>}</div><label className="logo-upload-button"><ImagePlus size={15}/>Change Logo<input type="file" accept="image/*" onChange={handleLogo}/></label><small>Image up to 450 KB</small></div><div className="settings-fields two"><Field label="Address" value={settings.restaurant.address} onChange={(v)=>update('restaurant','address',v)}/><Field label="City" value={settings.restaurant.city} onChange={(v)=>update('restaurant','city',v)}/><Field label="State" value={settings.restaurant.state} onChange={(v)=>update('restaurant','state',v)}/><Field label="PIN Code" value={settings.restaurant.pincode} onChange={(v)=>update('restaurant','pincode',v)}/><Field label="GST Number (Optional)" value={settings.restaurant.gstNumber} onChange={(v)=>update('restaurant','gstNumber',v)}/></div></div>
      </SettingCard>
      <SettingCard id="menu-settings" icon={Utensils} title="Menu Settings" description="Control how your menu and food items appear to customers.">
        <div className="settings-toggle-list"><ToggleRow label="Show Menu to Customers" checked={settings.menu.enabled} onChange={(v)=>update('menu','enabled',v)}/><ToggleRow label="Show Out of Stock Items" checked={settings.menu.showOutOfStock} onChange={(v)=>update('menu','showOutOfStock',v)}/><ToggleRow label="Allow Customer Reviews" checked={settings.menu.customerReviews} onChange={(v)=>update('menu','customerReviews',v)}/><ToggleRow label="Allow Item Notes" checked={settings.menu.itemNotes} onChange={(v)=>update('menu','itemNotes',v)}/><ToggleRow label="Show Dietary Labels" checked={settings.menu.dietaryLabels} onChange={(v)=>update('menu','dietaryLabels',v)}/></div>
      </SettingCard>
      <SettingCard id="business-hours-settings" icon={Clock3} title="Business Hours" description="Set your operating hours and weekly closures.">
        <div className="business-hours">{settings.hours.map((hour,index)=><div className={`business-hour-row ${hour.enabled?'':'closed'}`} key={hour.day}><span>{hour.day}</span><Toggle checked={hour.enabled} onChange={(v)=>updateHour(index,'enabled',v)} label={`${hour.day} open`}/><input type="time" value={hour.open} disabled={!hour.enabled} onChange={(e)=>updateHour(index,'open',e.target.value)} aria-label={`${hour.day} opening time`}/><b>–</b><input type="time" value={hour.close} disabled={!hour.enabled} onChange={(e)=>updateHour(index,'close',e.target.value)} aria-label={`${hour.day} closing time`}/></div>)}</div>
      </SettingCard>
      <SettingCard id="tax-settings" icon={Percent} title="Tax & Charges" description="Configure GST, service charge and delivery fees.">
        <div className="settings-fields two"><Field label="GST Rate (%)" value={settings.tax.gstRate} onChange={(v)=>update('tax','gstRate',v)} type="number" min="0" max="100" suffix="%"/><Field label="Service Charge (%)" value={settings.tax.serviceCharge} onChange={(v)=>update('tax','serviceCharge',v)} type="number" min="0" max="100" suffix="%"/><Field label="Delivery Charge (₹)" value={settings.tax.deliveryCharge} onChange={(v)=>update('tax','deliveryCharge',v)} type="number" min="0"/><Field label="Minimum Order Amount (₹)" value={settings.tax.minimumOrder} onChange={(v)=>update('tax','minimumOrder',v)} type="number" min="0"/></div>
        <div className="settings-toggle-list"><ToggleRow label="Apply GST on Orders" checked={settings.tax.applyGst} onChange={(v)=>update('tax','applyGst',v)}/><ToggleRow label="Apply Service Charge" checked={settings.tax.applyServiceCharge} onChange={(v)=>update('tax','applyServiceCharge',v)}/><ToggleRow label="Free Delivery Above Minimum Order" checked={settings.tax.freeDelivery} onChange={(v)=>update('tax','freeDelivery',v)}/></div>
      </SettingCard>
      <SettingCard id="operations-settings" icon={Bike} title="Order & Delivery Settings" description="Configure order types and delivery options.">
        <div className="settings-toggle-list"><ToggleRow label="Enable Dine In Orders" checked={settings.operations.dineIn} onChange={(v)=>update('operations','dineIn',v)}/><ToggleRow label="Enable Takeaway Orders" checked={settings.operations.takeaway} onChange={(v)=>update('operations','takeaway',v)}/><ToggleRow label="Enable Delivery Orders" checked={settings.operations.delivery} onChange={(v)=>update('operations','delivery',v)}/><ToggleRow label="Auto Accept Orders" checked={settings.operations.autoAccept} onChange={(v)=>update('operations','autoAccept',v)}/><ToggleRow label="Order Confirmation Notification" checked={settings.operations.orderConfirmation} onChange={(v)=>update('operations','orderConfirmation',v)}/><ToggleRow label="Allow Customer to Cancel Order" checked={settings.operations.customerCancellation} onChange={(v)=>update('operations','customerCancellation',v)}/></div><div className="settings-inline-field"><Field label="Estimated Delivery Time (minutes)" value={settings.operations.deliveryMinutes} onChange={(v)=>update('operations','deliveryMinutes',v)} type="number" min="1" max="240"/></div>
      </SettingCard>
      <SettingCard id="payment-settings" icon={CreditCard} title="Payment Methods" description="Enable or disable payment methods for your restaurant.">
        <div className="settings-payment-list">{[["cash","Cash on Delivery","cash"],["upi","UPI (Google Pay, PhonePe, Paytm)","upi"],["card","Credit / Debit Card","card"],["wallet","Wallet Payment","wallet"],["online","Online Payment (Razorpay/Stripe)","online"]].map(([key,label,tone])=><div className="settings-payment-row" key={key}><span className={`payment-method-badge ${tone}`}>{key==='cash'?'₹':key==='upi'?'UPI':key==='card'?'▰':key==='wallet'?'▣':'↗'}</span><span>{label}</span><Toggle checked={settings.payments[key]} onChange={(v)=>update('payments',key,v)} label={label}/></div>)}</div>
      </SettingCard>
      <SettingCard id="notifications-settings" icon={Bell} title="Notifications" description="Manage notification preferences.">
        <div className="settings-toggle-list settings-icon-list"><ToggleRow icon={Bell} label="New Order Notification" checked={settings.notifications.newOrder} onChange={(v)=>update('notifications','newOrder',v)}/><ToggleRow icon={Check} label="Order Status Update" checked={settings.notifications.orderStatus} onChange={(v)=>update('notifications','orderStatus',v)}/><ToggleRow icon={CreditCard} label="Payment Received" checked={settings.notifications.paymentReceived} onChange={(v)=>update('notifications','paymentReceived',v)}/><ToggleRow icon={Users} label="Customer Registration" checked={settings.notifications.customerRegistration} onChange={(v)=>update('notifications','customerRegistration',v)}/><ToggleRow icon={Database} label="Low Stock Alert" checked={settings.notifications.lowStock} onChange={(v)=>update('notifications','lowStock',v)}/></div>
      </SettingCard>
      <SettingCard id="staff-settings" icon={Users} title="Staff & Access" description="Manage staff permissions and role-based access.">
        <div className="settings-toggle-list"><ToggleRow label="Allow Staff Login" checked={settings.staff.allowLogin} onChange={(v)=>update('staff','allowLogin',v)}/><ToggleRow label="Restrict Access by Role" checked={settings.staff.restrictByRole} onChange={(v)=>update('staff','restrictByRole',v)}/><ToggleRow label="View Only Access" checked={settings.staff.viewOnly} onChange={(v)=>update('staff','viewOnly',v)}/><ToggleRow label="Order Management Access" checked={settings.staff.orderAccess} onChange={(v)=>update('staff','orderAccess',v)}/><ToggleRow label="Menu Management Access" checked={settings.staff.menuAccess} onChange={(v)=>update('staff','menuAccess',v)}/></div><button type="button" className="settings-manage-staff" onClick={()=>setStaffOpen(true)}><Users size={15}/>Manage Staff Members <ChevronRight size={15}/></button>
      </SettingCard>
      <SettingCard id="appearance-settings" icon={Palette} title="Appearance" description="Customize theme and appearance.">
        <label className="settings-color-row"><span>Primary Color</span><span className="settings-color-picker"><input type="color" value={settings.appearance.primaryColor} onChange={(e)=>update('appearance','primaryColor',e.target.value)}/><input value={settings.appearance.primaryColor.toUpperCase()} readOnly aria-label="Primary color hex value"/></span></label><div className="settings-theme-row"><span>Theme Mode</span><div className="settings-segmented">{['light','dark','system'].map((theme)=><button type="button" key={theme} className={settings.appearance.theme===theme?'active':''} onClick={()=>update('appearance','theme',theme)}>{theme==='light'?'☼ ':''}{theme[0].toUpperCase()+theme.slice(1)}</button>)}</div></div><label className="settings-select-row"><span>Language</span><select value={settings.appearance.language} onChange={(e)=>update('appearance','language',e.target.value)}><option>English</option><option>Hindi</option></select></label><label className="settings-select-row"><span>Date Format</span><select value={settings.appearance.dateFormat} onChange={(e)=>update('appearance','dateFormat',e.target.value)}><option>DD MMM YYYY</option><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></label><label className="settings-select-row"><span>Time Format</span><select value={settings.appearance.timeFormat} onChange={(e)=>update('appearance','timeFormat',e.target.value)}><option>12 Hour (AM/PM)</option><option>24 Hour</option></select></label>
      </SettingCard>
      <SettingCard id="backup-settings" icon={Database} title="Backup & Data" description="Manage your data and export options.">
        <div className="settings-export-list">{[['orders','Export All Orders'],['customers','Export Customers'],['menu','Export Menu Items'],['reports','Export Reports']].map(([kind,label])=><button type="button" key={kind} onClick={()=>exportAction(kind)}><Download size={15}/><span>{label}</span><ChevronRight size={14}/></button>)}</div><button type="button" className="settings-reset-button" onClick={resetAll}><Trash2 size={15}/><span>Reset All Data</span><ChevronRight size={14}/></button><p className="settings-data-note"><ShieldCheck size={13}/>Exports are created from the data saved in this browser.</p>
      </SettingCard>
    </form>
    {staffOpen&&<div className="settings-modal-backdrop" role="presentation" onMouseDown={(event)=>{if(event.target===event.currentTarget)setStaffOpen(false)}}><section className="settings-staff-modal" role="dialog" aria-modal="true" aria-labelledby="staff-modal-title"><header><div><h2 id="staff-modal-title">Staff Members</h2><p>Manage the team members who can access this workspace.</p></div><button type="button" onClick={()=>setStaffOpen(false)} aria-label="Close staff manager"><X size={18}/></button></header><div className="settings-staff-list">{settings.staff.members.map((member,index)=><article key={`${member.name}-${index}`}><span className="staff-avatar">{member.name.split(' ').map((part)=>part[0]).slice(0,2).join('')}</span><div><b>{member.name}</b><small>{member.role}</small></div><button type="button" onClick={()=>removeStaff(index)} aria-label={`Remove ${member.name}`}><Trash2 size={15}/></button></article>)}{!settings.staff.members.length&&<p className="staff-empty">No staff members added yet.</p>}</div><form className="settings-add-staff" onSubmit={addStaff}><label><span>Full name</span><input value={staffName} onChange={(e)=>setStaffName(e.target.value)} placeholder="Staff member name" required/></label><label><span>Role</span><select value={staffRole} onChange={(e)=>setStaffRole(e.target.value)}><option>Staff</option><option>Manager</option><option>Cashier</option><option>Kitchen</option><option>Delivery</option></select></label><button type="submit"><Users size={15}/>Add Staff Member</button></form><footer><button type="button" onClick={()=>{save();setStaffOpen(false)}}>Save and close</button></footer></section></div>}
    {toast&&<div className="settings-toast" role="status"><Check size={15}/>{toast}</div>}
  </div>
}
