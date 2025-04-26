export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        {/* (optional) Your dashboard/sidebar wrapper */}
        {children}
      </div>
    );
  }
  