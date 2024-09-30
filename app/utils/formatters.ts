/**
 * Formats a date according to the specified locale.
 * @param locale - The locale code, e.g., 'en-US'.
 * @param d - The date to format, either as a Date object or a string.
 * @returns The formatted date string.
 */
export const formatDateByLocale = (locale: string, d: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' }
  return new Date(d).toLocaleDateString(locale, options)
}

/**
 * Formats an image URL to include a specified width.
 * @param src - The original image URL.
 * @param width - The desired width to include in the URL.
 * @returns The formatted image URL with the specified width or the original URL if no match is found.
 */
export const formatSizeUrl = (src: string, width: number): string => {
  if (!src) {
    return src
  }

  const match = src.match(/\.(webp|jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i)

  if (match) {
    const prefix = src.split(match[0])
    const suffix = match[0]
    const size = `${width}x`

    return `${prefix[0]}_${size}${suffix}`
  }

  return src
}

/**
 * Formats a number as a currency string.
 * @param amount - The number to format.
 * @param currencyCode - The currency code, e.g., 'USD'.
 * @param locale - The locale code, e.g., 'en-US'.
 * @returns The formatted currency string.
 */
export const formatCurrency = (amount: number, currencyCode: string = 'USD', locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2
  })
    .format(amount)
    .replace(/\.00/g, '')
}
