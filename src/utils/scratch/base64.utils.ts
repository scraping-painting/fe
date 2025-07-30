const getBase64FromLayer = async (layer: File | string): Promise<string> => {
  if (layer instanceof File) {
    // Nếu là file, chuyển thành base64 bằng FileReader
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(layer)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
    })
  } else if (typeof layer === 'string') {
    try {
      // Nếu là URL, fetch dữ liệu và chuyển thành base64
      const data = await fetch(layer)
      const blob = await data.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const base64data = reader.result
          resolve(base64data as string)
        }
        reader.onerror = reject
      })
    } catch (error) {
      console.error('Error fetching image:', error)
      return ''
    }
  }

  return ''
}

export { getBase64FromLayer }
