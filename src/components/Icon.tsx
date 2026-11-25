export function Icon({
  name,
}: {
  name:
    | "search"
    | "menu"
    | "close"
    | "arrow"
    | "bag"
    | "plus"
    | "minus"
    | "upload"
    | "zoom"
    | "user"
    | "eye"
    | "eyeOff"
}) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    menu: <path d="M3 7h18M3 17h18" />,
    close: <path d="m5 5 14 14M19 5 5 19" />,
    arrow: <path d="M4 12h16m-5-5 5 5-5 5" />,
    bag: (
      <>
        <path d="M6 8h12l-.7 12.2a1 1 0 0 1-1 .8H7.7a1 1 0 0 1-1-.8L6 8Z" />
        <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      </>
    ),
    plus: <path d="M12 6v12M6 12h12" />,
    minus: <path d="M6 12h12" />,
    upload: (
      <>
        <path d="M12 16V6m0 0 4 4M12 6 8 10" />
        <path d="M5 18h14" />
      </>
    ),
    zoom: (
      <>
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="m15.2 15.2 5.3 5.3" />
        <path d="M10.5 8v5M8 10.5h5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 19c1.4-3.2 3.8-5 7-5s5.6 1.8 7 5" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
        <circle cx="12" cy="12" r="2.6" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
        <circle cx="12" cy="12" r="2.6" />
        <path d="m5 19 14-14" />
      </>
    ),
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      {paths[name]}
    </svg>
  )
}
