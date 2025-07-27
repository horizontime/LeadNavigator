import QRCode from 'react-qr-code';

export default function MobileQRCode() {
  return (
    <div className="mobile-qr-code">
      <h2 className="mobile-qr-title">Continue on your mobile device</h2>
      <p className="mobile-qr-subtitle">Scan this QR code to access Lead Navigator on your phone</p>
      
      <div className="qr-code-container">
        <QRCode 
          value="http://localhost:5173/" 
          size={150}
          bgColor="#ffffff"
          fgColor="#2c3e50"
          level="M"
        />
      </div>      
    </div>
  );
} 