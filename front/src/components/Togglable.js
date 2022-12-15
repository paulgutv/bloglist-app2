import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  let hideWhenVisible
  let showWhenVisible

  if (props.buttonLabel === 'login') {
    hideWhenVisible = { display: visible ? '' : 'none' }
    showWhenVisible = { display: visible ? 'none' : ''  }
  } else {
    hideWhenVisible = { display: visible ? 'none' : '' }
    showWhenVisible = { display: visible ? '' : 'none' }
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button id='revealButton' onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable