/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import { ARKit, DetectionImage } from 'react-native-arkit';

const apiKey = 'YOUR-API-KEY-HERE';

const getImageURL = async () => {
  const pages = 19000; //  Cached number of pages to avoid two API hits (misses some pages)
  const totalrecordsperquery = 5;

  const randomPage = Math.floor(Math.random()*pages) + 1;
  const url = `https://api.harvardartmuseums.org/object?q=imagepermissionlevel:0&page=${randomPage}&fields=primaryimageurl&apikey=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'GET'
    });

    const json = await res.json();
    const records = json.records;
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      if (record.primaryimageurl) {
        alert(record.primaryimageurl);
        return record.primaryimageurl;
      }
    }
  } catch (err) {
    alert(JSON.stringify(err));
  }
  throw new Error('Could not retrieve an image URL');
};

export default class App extends Component {
  constructor() {
    super();
    this.state = {}
  }

  async componentDidMount() {
    console.log('MOUNTED');
    const url = await getImageURL();
    this.setState({
      url
    });

  }
  render() {
    const children = Object.keys(this.state).map((name) => {
      const anchor = this.state[name];
      const { position, eulerAngles, positionAbsolute } = anchor;
      return (
        <ARKit.Box
            position={ position }
            shape={{ width: 0.0635, height: 0.001, length: 0.0889, chamfer: 0 }}
            eulerAngles={ eulerAngles }
            material={{
              diffuse: { path: this.state.url, intensity: 1 }
            }}
          />
      );
    });
    return (
      <View style={{ flex: 1 }}>
        <ARKit
          // debug // debug mode will show feature points detected and 3D axis
          style={{ flex: 1 }}          
          planeDetection // turn on plane detection
          lightEstimation // turn on light estimation
          detectionImages={[
            { resourceGroupName: 'AR Resources' }
          ]}
          onAnchorDetected={ (anchor) => {}}
          onAnchorUpdated={ (anchor) => {
            const { position, eulerAngles, positionAbsolute, type } = anchor;
            if (type === 'image') {
              const { image: { name } } = anchor;
              this.setState({ [name]: { position, eulerAngles, positionAbsolute }})
            }
          }}
        >
          { children }
        </ARKit>
      </View>
    );
  }
}
AppRegistry.registerComponent('MyFirstARKitApp', () => App);