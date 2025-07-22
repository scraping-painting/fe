export default class ConvertUtil {
  public static toVND(amount: number) {
    if (isNaN(amount)) return amount

    return amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })
  }
}
