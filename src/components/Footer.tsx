export default function Footer() {
  return (
    <footer className="bg-[#265b4e] text-white p-4 mt-8">
      <div className="container mx-auto text-center text-sm">
        <p className="mb-2">© 2025 Find Solace, Inc. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
