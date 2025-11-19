import { Home, Building2, Layers3, Users, FileText, Settings, PlusCircle } from 'lucide-react'
import { useApi } from './ApiClient'

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition border
      ${active
        ? 'bg-teal-200/70 text-teal-900 border-teal-300/60 shadow'
        : 'bg-white/30 hover:bg-white/50 text-teal-900/80 border-white/50'}
    `}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm font-medium">{label}</span>
  </button>
)

export default function Sidebar() {
  const { base } = useApi()

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 shrink-0 min-h-screen p-4">
      <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-white/40 flex flex-col gap-4 h-full">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-teal-200/70 border border-teal-300/60 flex items-center justify-center shadow-sm">
            <Building2 className="h-5 w-5 text-teal-900" />
          </div>
          <div>
            <div className="text-teal-900 font-semibold leading-tight">EstateFlow</div>
            <div className="text-teal-900/60 text-xs">Calm real estate ops</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <NavItem icon={Home} label="Dashboard" active />
          <NavItem icon={Building2} label="Properties" />
          <NavItem icon={Layers3} label="Units" />
          <NavItem icon={Users} label="Tenants" />
          <NavItem icon={FileText} label="Bills" />
          <NavItem icon={Settings} label="Settings" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* API base & action */}
        <div className="space-y-2">
          <div className="text-xs text-teal-900/70">API</div>
          <div className="text-xs px-3 py-2 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-teal-900 truncate" title={base}>
            {base}
          </div>
          <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-teal-900 bg-amber-200/60 hover:bg-amber-200/80 border border-amber-300/60 shadow-sm transition">
            <PlusCircle className="h-4 w-4" />
            <span className="text-sm font-medium">New Property</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
