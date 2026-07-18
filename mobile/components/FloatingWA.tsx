import React, { useRef, useState } from 'react';
import { Linking, PanResponder, Animated, Dimensions, TouchableOpacity, View } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TOKRAF_WA = '6281993294170';
const BTN_SIZE = 56;
const MARGIN = 16;

export default function FloatingWA() {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = Dimensions.get('window');

  // Initial position: bottom-right corner
  const initX = W - BTN_SIZE - MARGIN;
  const initY = H - BTN_SIZE - Math.max(insets.bottom, 20) - 60;

  const pan = useRef(new Animated.ValueXY({ x: initX, y: initY })).current;
  const dragDistance = useRef(0); // track drag distance to distinguish tap vs drag
  const isDragging = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => {
        // Only take over if moved more than 5px (allows tap through)
        return Math.abs(gs.dx) > 5 || Math.abs(gs.dy) > 5;
      },
      onPanResponderGrant: () => {
        dragDistance.current = 0;
        isDragging.current = false;
        // Snapshot current position as offset
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gs) => {
        dragDistance.current = Math.sqrt(gs.dx ** 2 + gs.dy ** 2);
        if (dragDistance.current > 8) isDragging.current = true;
        Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(_, gs);
      },
      onPanResponderRelease: (_, gs) => {
        pan.flattenOffset();

        const currentX = (pan.x as any)._value;
        const currentY = (pan.y as any)._value;

        // Clamp Y to safe area bounds
        const minY = insets.top + 80;
        const maxY = H - BTN_SIZE - Math.max(insets.bottom, 16);
        const clampedY = Math.min(Math.max(currentY, minY), maxY);

        // Snap to nearest horizontal edge
        const snapX = currentX + BTN_SIZE / 2 > W / 2
          ? W - BTN_SIZE - MARGIN   // right edge
          : MARGIN;                  // left edge

        Animated.parallel([
          Animated.spring(pan.x, {
            toValue: snapX,
            useNativeDriver: false,
            damping: 18,
            stiffness: 200,
          }),
          Animated.spring(pan.y, {
            toValue: clampedY,
            useNativeDriver: false,
            damping: 18,
            stiffness: 200,
          }),
        ]).start();
      },
    })
  ).current;

  const handlePress = () => {
    if (!isDragging.current) {
      Linking.openURL(`https://wa.me/${TOKRAF_WA}`);
    }
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        zIndex: 999,
        transform: pan.getTranslateTransform(),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
      }}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={{
          width: BTN_SIZE,
          height: BTN_SIZE,
          backgroundColor: '#25D366',
          borderRadius: BTN_SIZE / 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MessageCircle color="#fff" size={26} fill="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}
