const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        {children}
      </div>
    </div>
  )
}

export default MainLayout
