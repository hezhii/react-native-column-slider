import React from 'react';
import { PanResponder, StyleSheet, View, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

export default class ColumnSlider extends React.PureComponent {
  static propTypes = {
    /**
     * Initial value of the slider. The value should be between minimumValue
     * and maximumValue, which default to 0 and 1 respectively.
     * Default value is 0.
     *
     * *This is not a controlled component*, e.g. if you don't update
     * the value, the component won't be reset to its inital value.
     */
    value: PropTypes.number,

    /**
     * If true the user won't be able to move the slider.
     * Default value is false.
     */
    disabled: PropTypes.bool,

    /**
     * Initial minimum value of the slider. Default value is 0.
     */
    min: PropTypes.number,

    /**
     * Initial maximum value of the slider. Default value is 1.
     */
    max: PropTypes.number,

    /**
     * Step value of the slider. The value should be between 0 and
     * (maximumValue - minimumValue). Default value is 0.
     */
    step: PropTypes.number,

    /**
     * The bottom color. Default color is white
     */
    minimumTrackTintColor: PropTypes.string,

    /**
     * The top color. Default color is grey
     */
    maximumTrackTintColor: PropTypes.string,

    /**
     * Callback continuously called while the user is dragging the slider.
     */
    onChange: PropTypes.func,

    /**
     * Callback called when the user finishes changing the value (e.g. when
     * the slider is released).
     */
    onComplete: PropTypes.func,

    /**
     * The style applied to the slider container.
     */
    style: ViewPropTypes.style,

    /**
     * The style applied to the value text.
     */
    textStyle: PropTypes.object,

    /**
     * The bottom icon
     */
    icon: PropTypes.node,

    /**
     * The with of component. Default value is 100
     */
    width: PropTypes.number,

    /**
     * The suffix of the value.
     */
    suffix: PropTypes.string,

    /**
     * The border radius of component.
     */
    borderRadius: PropTypes.number,
  };

  static defaultProps = {
    value: 0,
    min: 0,
    max: 1,
    step: 0,
    minimumTrackTintColor: '#fff',
    maximumTrackTintColor: '#eee',
    borderRadius: 0,
  };

  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this.state = {
      value: props.value,
      prevValue: props.value,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.prevValue) {
      return ({
        value: props.value,
        prevValue: props.value,
      });
    }
    return null;
  }

  _handleStartShouldSetPanResponder = () => true;

  _handleMoveShouldSetPanResponder = () => false;

  _handlePanResponderGrant = () => {
    /*
     * Record the initial value at the beginning for subsequent calculation
     */
    this._moveStartValue = this._getCurrentValue();
  };

  _handlePanResponderMove = (e, gestureState) => {
    if (this.props.disabled) {
      return;
    }
    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent('onChange');
  };

  // Don't allow another component to take over this pan
  _handlePanResponderRequestEnd = () => false;

  _handlePanResponderEnd = (e, gestureState) => {
    if (this.props.disabled) {
      return;
    }
    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent('onComplete');
  };

  _fireChangeEvent = event => {
    if (this.props[event]) {
      this.props[event](this._getCurrentValue());
    }
  };

  _getCurrentValue() {
    return this.state.value;
  }

  _setCurrentValue = (value) => {
    this.setState({
      value,
    });
  };

  _getValue = (gestureState) => {
    const { min, max, step, height } = this.props;
    const ratio = (-gestureState.dy) / height;
    const diff = max - min;

    if (step) {
      return Math.max(
          min,
          Math.min(
              max,
              this._moveStartValue + Math.round(ratio * diff / step) * step,
          ),
      );
    }
    const value = Math.max(
        min,
        Math.min(max, this._moveStartValue + ratio * diff),
    );
    return Math.floor(value * 100) / 100;
  };

  _getInnerHeight() {
    const { min, max, height } = this.props;
    const { value } = this.state;
    return (value - min) * height / (max - min);
  }

  render() {
    const {
      height,
      width,
      minimumTrackTintColor,
      maximumTrackTintColor,
      icon,
      style,
      textStyle,
      suffix,
      borderRadius,
    } = this.props;
    const { value } = this.state;

    const outerStyle = [
      styles.outer,
      { height, backgroundColor: maximumTrackTintColor, borderRadius },
    ];
    const innerStyle = [
      styles.inner,
      { height: this._getInnerHeight(), backgroundColor: minimumTrackTintColor },
    ];

    return (
        <View style={[styles.slider, style]}>
          <Text style={[styles.text, textStyle]}>{value}{suffix}</Text>
          <View style={[styles.shadow, { backgroundColor: maximumTrackTintColor, width, borderRadius }]}>
            <View style={outerStyle} {...this._panResponder.panHandlers}>
              <View style={innerStyle} />
            </View>
          </View>
          {
            icon && (
                <View style={styles.iconContainer}>
                  {icon}
                </View>
            )
          }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
    alignItems: 'center',
  },
  text: {
    fontSize: 36,
    marginBottom: 16,
    color: '#1890ff',
  },
  shadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowColor: '#ccc',
    elevation: 4,
  },
  outer: {
    overflow: 'hidden',
  },
  inner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});
