import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './screens/Home'
import ScanDocument from './screens/ScanDocument'
import CaptureImage from './screens/CaptureImage'

export type RootStackParamList = {
  Home: undefined
  ScanDocument: undefined
  CaptureImage: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='ScanDocument' component={ScanDocument} />
        <Stack.Screen name='CaptureImage' component={CaptureImage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
