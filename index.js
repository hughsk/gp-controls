var gkey = require('gkey/generic')

function noop(){}

var getGamepads =
    navigator.getGamepads ? function() { return navigator.getGamepads() }
  : navigator.mozGetGamepads ? function() { return navigator.mozGetGamepads() }
  : navigator.webkitGetGamepads ? function() { return navigator.webkitGetGamepads() }
  : noop

module.exports = controller
controller.supported = getGamepads !== noop

function controller(index, controls) {
  var self = {}
    , gamepads = getGamepads()
    , enabled = []

  if (typeof index !== 'number') {
    controls = index
    index = 0
  }
  controls = controls || {}

  function poll() {
    var gamepad = getGamepads()[index]

    self.enabled = !!gamepad
    if (!self.enabled) return

    var buttons = gamepad.buttons
      , axes = gamepad.axes
      , bLength = buttons.length
      , aLength = axes.length
      , button
      , axis

    for (var a = 0; a < aLength; a += 1) {
      axis = controls[gkey.axes[a]]
      if (!axis) continue
      self.inputs[axis] = axes[a]
    }

    for (var b = 0; b < bLength; b += 1) {
      button = controls[gkey.buttons[b]]
      if (!button) continue
      self.inputs[button] = buttons[b]
    }
  }

  function createGamepad() {
    var gamepad = getGamepads()[index]
      , controller = {}

    Object.keys(controls).forEach(function(key) {
      var name = controls[key]
      controller[name] = 0
    })

    return controller
  }

  self.poll = poll
  self.inputs = createGamepad()
  self.enabled = false

  self.poll()

  return self
}
