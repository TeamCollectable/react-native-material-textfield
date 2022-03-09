import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { Platform, Animated } from "react-native";

import styles from "./styles";

export default class Label extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      labelWidth: 0,
    };
  }

  static defaultProps = {
    numberOfLines: 1,
    disabled: false,
    restricted: false,
  };

  static propTypes = {
    numberOfLines: PropTypes.number,

    disabled: PropTypes.bool,
    restricted: PropTypes.bool,

    fontSize: PropTypes.number.isRequired,
    activeFontSize: PropTypes.number.isRequired,

    baseColor: PropTypes.string.isRequired,
    tintColor: PropTypes.string.isRequired,
    errorColor: PropTypes.string.isRequired,

    focusAnimation: PropTypes.instanceOf(Animated.Value).isRequired,

    labelAnimation: PropTypes.instanceOf(Animated.Value).isRequired,

    contentInset: PropTypes.shape({
      label: PropTypes.number,
    }),

    offset: PropTypes.shape({
      x0: PropTypes.number,
      y0: PropTypes.number,
      x1: PropTypes.number,
      y1: PropTypes.number,
    }),

    style: PropTypes.any,
    label: PropTypes.string,
  };

  render() {
    let {
      label,
      offset,
      disabled,
      restricted,
      fontSize,
      activeFontSize,
      contentInset,
      errorColor,
      baseColor,
      tintColor,
      style,
      focusAnimation,
      labelAnimation,
      ...props
    } = this.props;

    if (null == label) {
      return null;
    }

    let color = disabled
      ? baseColor
      : restricted
      ? errorColor
      : focusAnimation.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [errorColor, baseColor, tintColor],
        });

    let textStyle = {
      lineHeight: fontSize,
      fontSize,
      color,
    };

    let { x0, y0, y1, x1 } = offset;

    y0 += activeFontSize;
    y0 += contentInset.label;
    y0 += fontSize * 0.25;

    const minScale = activeFontSize / fontSize;
    const minWidthOfItem = this.state.labelWidth * minScale;

    let containerStyle = {
      transform: [
        {
          scale: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, minScale],
          }),
        },
        {
          translateY: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [y0, y1],
          }),
        },
        {
          translateX: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [
              x0,
              Platform.select({
                default: x1,
                web:
                  -(this.state.labelWidth - minWidthOfItem) / 2 -
                  0.04 * this.state.labelWidth,
              }),
            ],
          }),
        },
      ],
    };

    return (
      <Animated.View
        onLayout={(e) =>
          this.setState({ labelWidth: e.nativeEvent.layout.width })
        }
        style={[styles.container, containerStyle]}
      >
        <Animated.Text style={[styles.text, style, textStyle]} {...props}>
          {label}
        </Animated.Text>
      </Animated.View>
    );
  }
}
