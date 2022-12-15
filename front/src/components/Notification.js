const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const error = () => (
    <div className='error'>
      {message}
    </div>
  )

  const success = () => (
    <div className='success'>
      {message}
    </div>
  )

  return (
    <>
      {type === 'error'
        ? error()
        : success()
      }
    </>
  )
}

export default Notification