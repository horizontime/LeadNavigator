interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`header ${className}`}>
      <div className="header-content">
        <h1 className="header-title">Lead Navigator</h1>
        <p className="header-subtitle">Be prepared when contacting your SuiteCRM leads with AI-powered insights</p>
      </div>
    </header>
  );
} 