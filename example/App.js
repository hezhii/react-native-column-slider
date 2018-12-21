import React from 'react';
import { StyleSheet, View } from 'react-native';
import ColumnSlider from 'react-native-column-slider';

export default class App extends React.PureComponent {
  render() {
    return (
        <View style={styles.container}>
          <ColumnSlider
              height={300}
              width={100}
              min={0}
              max={50}
              step={1}
              minimumTrackTintColor='#ffc069'
              maximumTrackTintColor='#fff'
              textStyle={{ color: '#ffc069' }}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});