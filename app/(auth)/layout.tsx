export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gold-50 via-amber-50 to-yellow-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">🪙</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Gold Loan Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your pawn loans across Sri Lanka</p>
        </div>

        <div className="card shadow-md">{children}</div>
      </div>
    </div>
  );
}
