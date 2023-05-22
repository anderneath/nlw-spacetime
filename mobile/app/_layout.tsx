import { styled } from 'nativewind'
import React, { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { StatusBar } from 'expo-status-bar'
import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'

const StyledStripe = styled(Stripes)

export default function Layout() {
  const [isUserAuthenticated, setUserAuthenticated] = useState<null | boolean>(
    null,
  )

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      setUserAuthenticated(!!token)
    })
  }, [])

  if (!hasLoadedFonts) return <SplashScreen />
  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900"
      imageStyle={{
        position: 'absolute',
        left: '-100%',
      }}
    >
      <StatusBar style="light" translucent />
      <StyledStripe className="absolute left-2" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="memories" />
        <Stack.Screen name="new-memory" />
      </Stack>
    </ImageBackground>
  )
}
