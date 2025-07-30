/**
 * By Ken Fyrstenberg Nilsen
 *
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 *
 * If image and context are only arguments rectangle will equal canvas
 */
function drawImageProp(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number = 0,
  y: number = 0,
  w?: number,
  h?: number,
  offsetX: number = 0.5,
  offsetY: number = 0.5
): void {
  if (!w) w = ctx.canvas.width
  if (!h) h = ctx.canvas.height

  // Ensure offset is within bounds [0, 1]
  offsetX = Math.min(Math.max(offsetX, 0), 1)
  offsetY = Math.min(Math.max(offsetY, 0), 1)

  const iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih)
  let nw = iw * r, // New proportional width
    nh = ih * r, // New proportional height
    cx: number,
    cy: number,
    cw: number,
    ch: number,
    ar = 1

  // Determine which side needs to be filled
  if (nw < w) ar = w / nw
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh
  nw *= ar
  nh *= ar

  // Calculate source rectangle
  cw = iw / (nw / w)
  ch = ih / (nh / h)

  cx = (iw - cw) * offsetX
  cy = (ih - ch) * offsetY

  // Ensure source rectangle is valid
  cx = Math.max(cx, 0)
  cy = Math.max(cy, 0)
  cw = Math.min(cw, iw)
  ch = Math.min(ch, ih)

  // Draw the image with computed source and destination
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h)
}

export { drawImageProp }
