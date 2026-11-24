export function Icon({
  name,
}: {
  name: "search" | "menu" | "close" | "arrow" | "bag" | "plus" | "minus" | "upload"
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
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      {paths[name]}
    </svg>
  )
}
