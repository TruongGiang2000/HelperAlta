/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {fromEvent, interval} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {cacheFile, soundApi, soundLocalOrUri} from './src';
declare const global: {HermesInternal: null | {}};
const App = () => {
  const [uriVideo, setUriVideo] = useState<any>();
  const sound = async () => {
    const uriVideo = (
      await cacheFile('https://www.youtube.com/watch?v=9kaCAbIXuyg')
    ).filePlay;
    setUriVideo(uriVideo);
  };
  const sound2 = () => {
    soundApi('Hello alo alo alo');
  };
  const sound3 = () => {};
  const sound4 = () => {
    soundLocalOrUri(
      'https://sanbot.dev-altamedia.com/caches/20611d62-7f6e-40b5-947c-e0b662324407.mp3',
    );
  };

  console.log('uriVideo', uriVideo);
  return (
    <>
      <TouchableOpacity style={styles.btnTestSound} onPress={sound}>
        <Text>Test Sound Api</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnTestSound} onPress={sound2}>
        <Text>Test Sound Api 2 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnTestSound} onPress={sound3}>
        <Text>Test Sound Api 3 </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnTestSound} onPress={sound4}>
        <Text>Test Sound Api 4 </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  btnTestSound: {
    alignSelf: 'center',
    backgroundColor: 'aqua',
    marginTop: 20,
    padding: 10,
  },
});

export default App;
