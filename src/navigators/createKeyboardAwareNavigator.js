import React from 'react';
import { TextInput } from 'react-native';

export default (Navigator, navigatorConfig) =>
  class KeyboardAwareNavigator extends React.Component {
    static router = Navigator.router;
    _previouslyFocusedTextInput = null;

    render() {
      return (
        <Navigator
          {...this.props}
          onGestureBegin={this._handleGestureBegin}
          onGestureCanceled={this._handleGestureCanceled}
          onGestureFinish={this._handleGestureFinish}
          onTransitionStart={this._handleTransitionStart}
        />
      );
    }

    _handleGestureBegin = () => {
      this._previouslyFocusedTextInput = TextInput.State.currentlyFocusedInput ? TextInput.State.currentlyFocusedInput() : TextInput.State.currentlyFocusedField();
      if (this._previouslyFocusedTextInput) {
        TextInput.State.blurTextInput(this._previouslyFocusedTextInput);
      }
      this.props.onGestureBegin && this.props.onGestureBegin();
    };

    _handleGestureCanceled = () => {
      if (this._previouslyFocusedTextInput) {
        TextInput.State.focusTextInput(this._previouslyFocusedTextInput);
      }
      this.props.onGestureCanceled && this.props.onGestureCanceled();
    };

    _handleGestureFinish = () => {
      this._previouslyFocusedTextInput = null;
      this.props.onGestureFinish && this.props.onGestureFinish();
    };

    _handleTransitionStart = (transitionProps, prevTransitionProps) => {
      // TODO: We should not even have received the transition start event
      // in the case where the index did not change, I believe. We
      // should revisit this after 2.0 release.
      if (transitionProps.index !== prevTransitionProps.index) {
        const currentField = TextInput.State.currentlyFocusedInput ? TextInput.State.currentlyFocusedInput() : TextInput.State.currentlyFocusedField();
        if (currentField) {
          TextInput.State.blurTextInput(currentField);
        }
      }

      const onTransitionStart =
        this.props.onTransitionStart || navigatorConfig.onTransitionStart;
      onTransitionStart &&
        onTransitionStart(transitionProps, prevTransitionProps);
    };
  };
