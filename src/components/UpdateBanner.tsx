import './UpdateBanner.css'

interface UpdateBannerProps {
  version: string
}

export function UpdateBanner({ version }: UpdateBannerProps) {
  return (
    <div className="update-banner" role="status" aria-live="polite">
      <div>
        <strong>New version available</strong>
        <span className="update-banner__description">{`Version ${version} is ready.`}</span>
      </div>
      <button type="button" onClick={() => window.location.reload()}>Update</button>
    </div>
  )
}
