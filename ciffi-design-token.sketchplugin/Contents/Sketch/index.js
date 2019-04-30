const sketch = require('sketch')
const getWeight = require('./libs/Weights')
const ntc = require('./libs/NTC')

const stringify = (obj, prettyPrinted) => {
    const prettySetting = prettyPrinted ? NSJSONWritingPrettyPrinted : 0
    const jsonData = [NSJSONSerialization dataWithJSONObject:obj options:prettySetting error:nil]
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding]
}

const copyJsonToClipboard = (result, UI) => {
  [[NSPasteboard generalPasteboard] clearContents];
  [[NSPasteboard generalPasteboard] setString:stringify(result) forType:NSPasteboardTypeString];
  
  return UI.alert('Ciffi Design Token', 'JSON copied to clipboard - paste into design-token.json file')
}

onRun = () => {
  const doc = sketch.getSelectedDocument()
  
  const colors = {}
  doc.colors.map(({color}) => {
    colors[ntc.name(color.slice(0, -2))[1].replace(/[^a-zA-Z0-9]/g, '')] = color.slice(0, -2)
  })
  
  const gradients = {}
  doc.gradients.map(({ gradient }) => {
    const names = gradient.stops.map(({color}) => {
      return ntc.name(color.slice(0, -2))[1].replace(/[^a-zA-Z0-9]/g, '')
    })
    const { stops, gradientType } = gradient
    
    gradients[names.join('')] = {
      type: gradientType,
      stops: stops.map(({position, color}) => {
        return {
          position,
          color: color.slice(0, -2)
        }
      })
    }
  })
  
  const fonts = {}
  const sizes = {}
  const weights = {}
  doc.sharedTextStyles.map(({ name, style}) => {
    fonts[name.replace(/[^a-zA-Z0-9]/g, '')] = `'${style.fontFamily}', sans`
    sizes[name.replace(/[^a-zA-Z0-9]/g, '')] = style.fontSize
    weights[name.replace(/[^a-zA-Z0-9]/g, '')] = getWeight(style.fontWeight)
  })
  
  const result = {
    colors,
    gradients,
    fonts,
    sizes,
    weights
  }
  
  copyJsonToClipboard(result, sketch.UI)
}