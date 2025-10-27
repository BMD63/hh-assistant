export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HH</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">HH Assistant</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Поиск
            </a>
            <a href="/favorites" className="text-gray-600 hover:text-gray-900 font-medium">
              Избранное
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}