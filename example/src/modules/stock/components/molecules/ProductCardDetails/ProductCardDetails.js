import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon} from '@aos-mobile/ui';

const ProductCardDetails = ({style, children, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.container, style]}>
        <View style={styles.textContainer}>{children}</View>
        <Icon name="chevron-right" size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '80%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default ProductCardDetails;