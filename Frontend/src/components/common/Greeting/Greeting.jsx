const Greeting = ({ title = "Welcome! 👋", subtitle = "Access your Google Sheets data with ease" }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold text-white mb-4">
        {title}
      </h1>
      <p className="text-xl text-gray-300">
        {subtitle}
      </p>
    </div>
  )
}

export default Greeting
