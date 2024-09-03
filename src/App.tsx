import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './screens/Home'
import ScanDocument from './screens/ScanDocument'
import DetectFace from './screens/DetectFace'
import React from 'react'
import OCR from './screens/OCR'

export type RootStackParamList = {
  Home: undefined
  ScanDocument: undefined
  DetectFace: undefined
  OCR: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='ScanDocument' component={ScanDocument} />
        <Stack.Screen name='DetectFace' component={DetectFace} />
        <Stack.Screen name='OCR' component={OCR} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
