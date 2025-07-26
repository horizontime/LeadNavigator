interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`header ${className}`}>
      <div className="header-content">
        <h1 className="header-title">SuiteCRM AI Insights</h1>
        <p className="header-subtitle">Get AI-powered sales insights for your leads</p>
      </div>
    </header>
  );
} 