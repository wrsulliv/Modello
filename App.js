/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// index.ios.js
import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import { ARKit, DetectionImage } from 'react-native-arkit';
export default class App extends Component {
  constructor() {
    super();
    this.state = {

    }
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
              diffuse: { path: `assets/${name}_ar`, intensity: 1 }
            }}
          />
      );
    });
    return (
      <View style={{ flex: 1 }}>
        <ARKit
          style={{ flex: 1 }}
          // debug // debug mode will show feature points detected and 3D axis
          planeDetection // turn on plane detection
          lightEstimation // turn on light estimation
          detectionImages={[
            { resourceGroupName: 'AR Resources' }
          ]}
          onAnchorDetected={ (anchor) => {}}
          onAnchorUpdated={ (anchor) => {
            // alert(JSON.stringify(anchor));
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