import { useEffect, useState } from 'react'
import { useApi } from './ApiClient'

function Section({ title, children, action }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl shadow p-5 border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}

export default function Dashboard() {
  const { get, post, base } = useApi()

  // Owners
  const [owners, setOwners] = useState([])
  const [ownerForm, setOwnerForm] = useState({ name: '', email: '', phone: '' })

  // Properties
  const [properties, setProperties] = useState([])
  const [propForm, setPropForm] = useState({ owner_id: '', name: '', address: '' })

  // Tenants
  const [tenants, setTenants] = useState([])
  const [tenantForm, setTenantForm] = useState({ property_id: '', unit_id: '', name: '', email: '' })

  // Units
  const [units, setUnits] = useState([])
  const [unitForm, setUnitForm] = useState({ property_id: '', unit_number: '' })

  // Utility parsing
  const [parseText, setParseText] = useState('Water: 123.45\nElectric: 67.89\nSewer: 10')
  const [parseResult, setParseResult] = useState(null)

  // Bills
  const [bills, setBills] = useState([])
  const [billForm, setBillForm] = useState({ tenant_id: '', unit_id: '', property_id: '', period: '2025-01', items: [], total: 0 })

  const refreshAll = async () => {
    const [o, p, u, t, b] = await Promise.all([
      get('/owners'),
      get('/properties'),
      get('/units'),
      get('/tenants'),
      get('/bills')
    ])
    setOwners(o || [])
    setProperties(p || [])
    setUnits(u || [])
    setTenants(t || [])
    setBills(b || [])
  }

  useEffect(() => {
    refreshAll()
  }, [])

  const simpleInput = (value, onChange, placeholder) => (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="px-3 py-2 rounded border w-full" />
  )

  const list = (items, fields) => (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            {fields.map(f => <th key={f} className="py-2 pr-4">{f}</th>)}
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="border-t">
              {fields.map(f => <td key={f} className="py-2 pr-4">{String(it[f] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const createOwner = async () => {
    const res = await post('/owners', ownerForm)
    if (res?.id) { setOwnerForm({ name: '', email: '', phone: '' }); refreshAll() }
  }

  const createProperty = async () => {
    const res = await post('/properties', propForm)
    if (res?.id) { setPropForm({ owner_id: '', name: '', address: '' }); refreshAll() }
  }

  const createUnit = async () => {
    const res = await post('/units', unitForm)
    if (res?.id) { setUnitForm({ property_id: '', unit_number: '' }); refreshAll() }
  }

  const createTenant = async () => {
    const res = await post('/tenants', tenantForm)
    if (res?.id) { setTenantForm({ property_id: '', unit_id: '', name: '', email: '' }); refreshAll() }
  }

  const doParse = async () => {
    const res = await post('/parse_utility', { text: parseText })
    setParseResult(res)
  }

  const addBillItem = (label, amount) => {
    const items = [...(billForm.items || []), { label, amount: Number(amount || 0) }]
    const total = items.reduce((s, it) => s + Number(it.amount || 0), 0)
    setBillForm({ ...billForm, items, total })
  }

  const createBill = async () => {
    const payload = { ...billForm }
    const res = await post('/bills', payload)
    if (res?.id) { setBillForm({ tenant_id: '', unit_id: '', property_id: '', period: '2025-01', items: [], total: 0 }); refreshAll() }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Real Estate Manager</h1>
        <p className="text-slate-200">Manage properties, tenants, utilities, and bills.</p>
        <p className="text-slate-300 text-sm">API Base: {base}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Section title="Owners" action={<button onClick={createOwner} className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>}>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {simpleInput(ownerForm.name, v => setOwnerForm({ ...ownerForm, name: v }), 'Name')}
            {simpleInput(ownerForm.email, v => setOwnerForm({ ...ownerForm, email: v }), 'Email')}
            {simpleInput(ownerForm.phone, v => setOwnerForm({ ...ownerForm, phone: v }), 'Phone')}
          </div>
          {list(owners, ['name', 'email', 'phone'])}
        </Section>

        <Section title="Properties" action={<button onClick={createProperty} className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>}>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {simpleInput(propForm.owner_id, v => setPropForm({ ...propForm, owner_id: v }), 'Owner ID')}
            {simpleInput(propForm.name, v => setPropForm({ ...propForm, name: v }), 'Name')}
            {simpleInput(propForm.address, v => setPropForm({ ...propForm, address: v }), 'Address')}
          </div>
          {list(properties, ['owner_id', 'name', 'address'])}
        </Section>

        <Section title="Units" action={<button onClick={createUnit} className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>}>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {simpleInput(unitForm.property_id, v => setUnitForm({ ...unitForm, property_id: v }), 'Property ID')}
            {simpleInput(unitForm.unit_number, v => setUnitForm({ ...unitForm, unit_number: v }), 'Unit #')}
            {simpleInput(unitForm.square_feet, v => setUnitForm({ ...unitForm, square_feet: v }), 'SqFt')}
          </div>
          {list(units, ['property_id', 'unit_number', 'square_feet', 'tenant_id'])}
        </Section>

        <Section title="Tenants" action={<button onClick={createTenant} className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>}>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {simpleInput(tenantForm.property_id, v => setTenantForm({ ...tenantForm, property_id: v }), 'Property ID')}
            {simpleInput(tenantForm.unit_id, v => setTenantForm({ ...tenantForm, unit_id: v }), 'Unit ID')}
            {simpleInput(tenantForm.name, v => setTenantForm({ ...tenantForm, name: v }), 'Name')}
            {simpleInput(tenantForm.email, v => setTenantForm({ ...tenantForm, email: v }), 'Email')}
          </div>
          {list(tenants, ['property_id', 'unit_id', 'name', 'email'])}
        </Section>

        <Section title="Parse Utility Invoice" action={<button onClick={doParse} className="px-3 py-2 bg-emerald-600 text-white rounded">Parse</button>}>
          <textarea value={parseText} onChange={e => setParseText(e.target.value)} rows={6}
            className="w-full p-3 border rounded mb-3 font-mono" />
          {parseResult && (
            <div className="text-sm">
              <div className="font-semibold mb-1">Found:</div>
              <pre className="bg-slate-900 text-emerald-300 p-3 rounded overflow-auto">{JSON.stringify(parseResult, null, 2)}</pre>
              <div className="mt-3">
                <button onClick={() => {
                  if (!parseResult?.totals) return
                  Object.entries(parseResult.totals).forEach(([k, v]) => addBillItem(k, v))
                }} className="px-3 py-2 bg-purple-600 text-white rounded">Add as Bill Items</button>
              </div>
            </div>
          )}
        </Section>

        <Section title="Create Bill" action={<button onClick={createBill} className="px-3 py-2 bg-blue-600 text-white rounded">Create</button>}>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {simpleInput(billForm.tenant_id, v => setBillForm({ ...billForm, tenant_id: v }), 'Tenant ID')}
            {simpleInput(billForm.unit_id, v => setBillForm({ ...billForm, unit_id: v }), 'Unit ID')}
            {simpleInput(billForm.property_id, v => setBillForm({ ...billForm, property_id: v }), 'Property ID')}
            {simpleInput(billForm.period, v => setBillForm({ ...billForm, period: v }), 'Period (YYYY-MM)')}
            {simpleInput(billForm.total, v => setBillForm({ ...billForm, total: Number(v || 0) }), 'Total')}
          </div>
          <div className="text-sm text-slate-700 mb-2">Items:</div>
          <div className="space-y-2">
            {(billForm.items || []).map((it, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input value={it.label} readOnly className="px-2 py-1 border rounded w-1/2" />
                <input value={it.amount} readOnly className="px-2 py-1 border rounded w-1/2" />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Bills">
          {list(bills, ['tenant_id', 'property_id', 'period', 'total', 'status'])}
        </Section>
      </div>
    </div>
  )
}
