import type { ActivityFile } from "./types"

export function ImageGrid({ images }: { images: ActivityFile[] }) {
  const count = images.length
  const visible = images.slice(0, 4)
  const extra = count - 4

  const cell = (img: ActivityFile, overlay?: React.ReactNode) => (
    <a
      key={img.url}
      href={img.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden bg-muted"
    >
      <img
        src={img.url}
        alt={img.name}
        className="h-36 w-36 object-cover transition-opacity group-hover:opacity-90"
      />
      {overlay}
    </a>
  )

  if (count === 1) {
    return (
      <a
        href={images[0].url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-xl bg-muted"
      >
        <img
          src={images[0].url}
          alt={images[0].name}
          className="max-h-52 w-full max-w-55 object-cover transition-opacity group-hover:opacity-90"
        />
      </a>
    )
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-xl">
        {visible.map((img) => (
          <div key={img.url} className="aspect-square">
            {cell(img)}
          </div>
        ))}
      </div>
    )
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-xl">
        <div className="row-span-2 aspect-1/2">{cell(images[0])}</div>
        <div className="aspect-square">{cell(images[1])}</div>
        <div className="aspect-square">{cell(images[2])}</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-xl">
      {visible.map((img, i) => (
        <div key={img.url} className="aspect-square">
          {cell(
            img,
            i === 3 && extra > 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                +{extra + 1}
              </div>
            ) : undefined
          )}
        </div>
      ))}
    </div>
  )
}
