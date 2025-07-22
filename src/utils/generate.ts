import { v4 as uuidV4 } from 'uuid'

export default class GenerateUtil {
  public static generateId() {
    return uuidV4()
  }
}
