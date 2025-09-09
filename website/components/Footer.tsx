export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <i className="fas fa-home text-primary text-2xl mr-2"></i>
              <h4 className="text-xl font-bold text-foreground">VacanzaItalia</h4>
            </div>
            <p className="text-muted-foreground mb-4">
              The best vacation apartments in Italy. Discover Italian culture and enjoy authentic experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Useful links</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cancellation Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Contact</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <i className="fas fa-envelope text-sm"></i>
                <span>info@vacanzaitalia.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-phone text-sm"></i>
                <span>+39 1 234 5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-map-marker-alt text-sm"></i>
                <span>Rome, Italy</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 VacanzaItalia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
