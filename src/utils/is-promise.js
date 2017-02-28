export default (obj) => {
  return (
    typeof obj === 'function' && typeof obj.then === 'function'
  )
}
