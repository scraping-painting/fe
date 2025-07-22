import { useEffect, useRef } from 'react'

/**
 * Một custom hook để kiểm tra các prop thay đổi không mong muốn. Chỉ nên sử dụng nó trong lúc phát triển
 *
 * @param props Tất cả props
 * @param prefix Tiền tố hiển thị thông báo
 */
export const usePropsChange = (props: Types.Object = {}, prefix = 'Props changed') => {
  const ref = useRef<Types.Object | null>(null)

  useEffect(() => {
    if (ref.current === null) {
      ref.current = props
      return
    }

    const changed: Types.Object = {}
    const prev = ref.current
    Object.keys(props).forEach(key => {
      if (prev[key] !== props[key]) {
        changed[key] = [prev[key], props[key]]
      }
    })

    ref.current = props
    if (Object.keys(changed).length) {
      console.log(prefix, changed)
    }
  }, [props, prefix])
}
