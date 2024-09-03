import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './screens/Home'
import ScanDocument from './screens/ScanDocumentDS'
import DetectFace from './screens/DetectFaceVC'
import React from 'react'

export type RootStackParamList = {
  Home: undefined
  ScanDocumentDS: undefined
  ScanDocumentVC: undefined
  DetectFaceVC: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='ScanDocument' component={ScanDocument} />
        <Stack.Screen name='DetectFace' component={DetectFace} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
