# adapt-thoughts

**Thoughts** is a *presentation component* for the [Adapt framework](https://github.com/adaptlearning/adapt_framework).   

This component displays a text entry box which captures user input text.

## Settings Overview

The attributes listed below are used in *components.json* to configure **Thoughts**, and are properly formatted as JSON in [*example.json*](https://github.com/RobertPeek/adapt-thoughts/blob/master/example.json).

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**_component** (string): This value must be: `thoughts`.

**_classes** (string): CSS class name to be applied to **Thoughts's** containing `div`. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.  

**instruction** (string): This optional text appears above the component. It is frequently used to guide the learner’s interaction with the component.  

**_recordInteraction** (boolean) Determines whether or not the learner's answers will be recorded to the LMS via cmi.interactions. Default is `true`. For further information, see the entry for `_shouldRecordInteractions` in the README for [adapt-contrib-spoor](https://github.com/adaptlearning/adapt-contrib-spoor).  

**_canShowFeedback** (boolean): Setting this to `false` disables feedback, so it is not shown to the user. The default is `true`.  

**_showUserAnswer** (boolean): Setting this to `true` will show the user answer in the feedback popup. The default is `true`.  

**_setCompletionOn** (string): Determines when the component registers as complete. Acceptable values are `"submitted"` and `"inview"`.

**placeholder** (string): This text appears in the text entry box before the user interacts with it.  

**_characterLimit** (object):  This `_characterLimit` attributes group stores the properties for the maximum character length. It contains values for **_isEnabled**, **_max**, and **text**.  

>**_isEnabled** (boolean): Setting this to `true` will set the maximum character length specified. The default is `false`.  

>**_max** (number): This sets the character limit for the text entry box.  

>**text** (string): This defines the text to prefix the number of characters remaining.  

**_buttons** (object):  This `_buttons` attributes group stores the properties for the buttons. It contains values for **_submit**, **_reset**, **_showFeedback**, and **_closeFeedback**.  

>**_submit** (object):  This `_submit` attributes group stores the properties for the Submit button. It contains values for **buttonText**, and **ariaLabel**.  

>>**buttonText** (string): Sets the text to be displayed in the Submit button.    

>>**ariaLabel** (string): This text becomes the button’s `Aria label` attribute.  

>**_showFeedback** (object):  This `_showFeedback` attributes group stores the properties for the Feedback button. It contains values for **buttonText**, and **ariaLabel**.  

>>**buttonText** (string): Sets the text to be displayed in the Feedback button.    

>>**ariaLabel** (string): This text becomes the button’s `Aria label` attribute.  

>**_closeFeedback** (object):  This `_closeFeedback` attributes group stores the properties for the Close Feedback button. It contains values for **buttonText**, and **ariaLabel**.  

>>**buttonText** (string): Sets the text to be displayed in the Close Feedback button.    

>>**ariaLabel** (string): This text becomes the button’s `Aria label` attribute.  

**_feedback** (object):  This `_feedback` attributes group stores the properties for the feedback. It contains values for **title**, **answerTitle**, **userTitle**, **body** and **_audio**.  

>**title** (string): Sets the title for the feedback.    

>**answerTitle** (string): Sets the title for the correct answer.    

>**userTitle** (string): Sets the title for the user answer.    

>**body** (string): Sets the text for the correct answer.    

>**_audio** (object):  This `_audio` attributes group stores the properties for the audio. It contains values for **src**.  

>>**src** (string): File name (including path) of the audio for the item. Path should be relative to the *src* folder.  

## Accessibility
Several elements of **Thoughts** have been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **Thoughts**. These labels are not visible elements. They are utilized by assistive technology such as screen readers.   

----------------------------
**Version number:**  1.0.0
**Framework versions supported:**  5.20.1+
**Author / maintainer:** Robert Peek
**Accessibility support:** yes
**RTL support:** yes
**Authoring tool support:** Yes