import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-50 via-emerald-50 to-amber-100">
      {/* soft decorative blobs for calm vibe */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-amber-200/40 blur-3xl"></div>
      <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl"></div>

      <div className="relative py-10">
        <Dashboard />
      </div>
    </div>
  )
}

export default App
