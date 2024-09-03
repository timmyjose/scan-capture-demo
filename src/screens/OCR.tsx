/* eslint-disable react-native/no-inline-styles */
import * as React from 'react'
import {
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { Asset, launchImageLibrary } from 'react-native-image-picker'
import MlkitOcr, { MlkitOcrResult } from 'react-native-mlkit-ocr'

function fitWidth(value: number, imageWidth: number) {
  const fullWidth = Dimensions.get('window').width
  return (value / imageWidth) * fullWidth
}

function fitHeight(value: number, imageHeight: number) {
  const fullHeight = Dimensions.get('window').height
  return (value / imageHeight) * fullHeight
}

function launchGallery(
  setResult: (result: MlkitOcrResult) => void,
  setImage: (result: Asset) => void,
  setLoading: (value: boolean) => void
) {
  console.log('About to launch gallery')
  launchImageLibrary(
    {
      mediaType: 'photo',
    },
    async ({ assets }) => {
      if (!assets?.[0].uri) {
        throw new Error('oh!')
      }
      try {
        setImage(assets[0])
        // display the OCR results as text
        const res = await MlkitOcr.detectFromUri(assets[0].uri)
        res.forEach(blk => {
          blk.lines.forEach(line => {
            console.log(line.text)
          })
        })
        setResult(res)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
  )
}

const OCR = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [result, setResult] = React.useState<MlkitOcrResult | undefined>()
  const [image, setImage] = React.useState<Asset | undefined>()

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      {!!result?.length && (
        <ScrollView
          contentContainerStyle={{
            alignItems: 'stretch',
            padding: 20,
            height: Dimensions.get('window').height,
          }}
          showsVerticalScrollIndicator
          style={styles.scroll}
        >
          {result?.map((block) => {
            return block.lines.map((line) => {
              return (
                <View
                  key={line.text}
                  style={{
                    backgroundColor: '#ccccccaf',
                    position: 'absolute',
                    top: fitHeight(line.bounding.top, image?.height ?? 0),
                    height: fitHeight(line.bounding.height, image?.height ?? 0),
                    left: fitWidth(line.bounding.left, image?.width ?? 0),
                    width: fitWidth(line.bounding.width, image?.width ?? 0),
                  }}
                >
                  <Text style={{ fontSize: 10 }}>{line.text}</Text>
                </View>
              )
            })
          })}
        </ScrollView>
      )}

      <Button
        onPress={() => {
          setLoading(true)
          launchGallery(setResult, setImage, setLoading)
        }}
        title="Start"
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#c0c0c0',
    height: 40,
    width: '40%',
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayText: {
    color: 'grey',
    fontSize: 24,
    fontWeight: 'bold'
  },
  scroll: {
    flex: 1,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 2
  }
})

export default OCR
