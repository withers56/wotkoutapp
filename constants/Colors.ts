/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#FF4433';

export const Colors = {
  light: {
    text: 'black',
    color: 'black',
    background: 'white',
    modalBackground: '#dfdfdfff',
    icon: 'black',
    button: 'royalblue',
    tabIconSelected: tintColorLight,
    danger: 'red',
    primary: 'rgb(0, 114, 198)'
  },
  dark: {
    text: 'white',
    color: 'white',
    background: '#2c2c2c',
    modalBackground: '#3e3e3eff',
    icon: 'red',
    button: 'white',
    tabIconSelected: tintColorDark,
    danger: 'red',
    primary: 'rgb(0, 114, 198)'
  },
};
