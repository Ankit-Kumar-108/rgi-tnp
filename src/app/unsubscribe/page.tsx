import Link from "next/link";

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full">
          <svg
            className="w-8 h-8 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Unsubscribe from Alerts
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          We're sorry to see you go. To unsubscribe from all future recruitment and placement alerts, please contact our administrator directly.
        </p>

        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mb-8">
          <p className="text-sm text-purple-800 font-medium mb-1">Contact Admin at:</p>
          <a 
            href="mailto:admin@ankit.dpdns.org" 
            className="text-lg font-bold text-purple-600 hover:text-purple-700 transition-colors"
          >
            admin@ankit.dpdns.org
          </a>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-purple-600 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Portal
        </Link>
      </div>
    </div>
  );
}
