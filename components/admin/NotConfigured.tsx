export default function NotConfigured() {
  return (
    <div className="admin-login">
      <div style={{ maxWidth: 520 }}>
        <h1 className="h5">Admin is not set up</h1>
        <p className="text-muted">
          Set <code>ADMIN_PASSWORD</code> and <code>SESSION_SECRET</code> in <code>.env.local</code>
          {' '}(see <code>.env.example</code>), then restart the server.
        </p>
      </div>
    </div>
  );
}
