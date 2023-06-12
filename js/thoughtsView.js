import Adapt from "core/js/adapt";
import notify from "core/js/notify";
import offlineStorage from "core/js/offlineStorage";
import ComponentView from "core/js/views/componentView";
import ThoughtsPopupView from "./thoughtsPopupView";

class ThoughtsView extends ComponentView {
  events() {
    return {
      "click .js-btn-action": "onBtnClicked",
      "click .js-btn-feedback": "openPopup",
      "keyup .thoughts__input-textbox": "onInputChanged",
    };
  }

  initialize(...args) {
    super.initialize(...args);

    this.setUpViewData();
    this.setUpEventListeners();
  }

  setUpViewData() {
    this.popupView = null;
    this._isPopupOpen = false;
  }

  setUpEventListeners() {
    this.listenTo(
      Adapt.config,
      "change:_activeLanguage",
      this.resetUserAnswers
    );
  }

  setupQuestion() {
    this.model.setupRandomisation();
    this.model.restoreUserAnswers();
  }

  onQuestionRendered() {
    this.onDeviceChanged();
    this.setLayout();
    this.setAriaLabels();
    this.setReadyStatus();

    this.listenTo(Adapt, "device:changed", this.onDeviceChanged, this);

    if (!this.model.get("_isSubmitted")) return;
    this.showMarking();
    this.disableQuestion();
  }

  postRender() {
    this.restoreUserAnswers();
    this.setReadyStatus();

    if (this.model.get("_setCompletionOn") === "inview") {
      this.setupInviewCompletion();
    }

    this.updateCounter();
  }

  onBtnClicked(event) {
    if (event) event.preventDefault();

    // console.log(this.model.get('_isCorrect'));

    if (this.model.get("_isSubmitted")) return;

    if (this.$(".thoughts__input-textbox").val() == "") return;

    this.userAnswer = this.$(".thoughts__input-textbox").val();
    this.model.set("userAnswer", this.userAnswer);
    const keywords = this.model.get("keywords");
    const userAnswer = this.model.get("userAnswer");
    console.log(userAnswer);

    function checkStringsInUserText(stringArray, userText) {
      let result = [];
      let lowerCaseUserText = userText.toLowerCase();
      for (let i = 0; i < stringArray.length; i++) {
        result.push(lowerCaseUserText.includes(stringArray[i].toLowerCase()));
      }
      return result;
    }
    console.log(checkStringsInUserText(keywords, userAnswer));
    // mark as correct if all keywords are found in user answer, if not mark as incorrect

    if (checkStringsInUserText(keywords, userAnswer).every(Boolean)) {
      this.model.set("_isCorrect", true);
      this.model.set("_isIncorrect", false);
      this.model.set("_isPartiallyCorrect", false);
      this.model.set("_isNotAnswered", false);
      this.model.set("_isSubmitted", true);
    } else {
      this.model.set("_isCorrect", false);
      this.model.set("_isIncorrect", true);
      this.model.set("_isPartiallyCorrect", false);
      this.model.set("_isSubmitted", true);
    }

    this.showMarking();
    this.initFeedback();

    this.model.set("_isSubmitted", true);

    this.$(".btn__action").addClass("is-disabled").attr("disabled", true);

    this.$(".thoughts__input-textbox")
      .addClass("is-disabled")
      .attr("disabled", true);

    offlineStorage.set(this.model.get("_id"), this.model.get("userAnswer"));

    if (!this.model.get("_recordInteraction")) return;
    Adapt.trigger("questionView:recordInteraction", this);
  }

  initFeedback() {
    if (this.model.get("_canShowFeedback")) {
      this.$(".btn__feedback")
        .removeClass("is-disabled")
        .attr("disabled", false);
      this.openPopup();
    } else {
      this.setCompletionStatus();
    }
  }

  showMarking() {
    if (!this.model.get("_canShowMarking")) return;

    this.$(".thoughts__input-textbox")
      .addClass("is-disabled")
      .attr("disabled", true);

    if (this.model.get("_isCorrect")) {
      this.$(".btn__marking").addClass("is-correct");
    } else {
      this.$(".btn__marking").addClass("is-incorrect");
    }
  }

  openPopup() {
    if (this._isPopupOpen) return;

    this._isPopupOpen = true;

    Adapt.trigger("audio:stopAllChannels");

    this.popupView = new ThoughtsPopupView({
      model: this.model,
    });

    notify.popup({
      _view: this.popupView,
      _isCancellable: true,
      _showCloseButton: false,
      _closeOnBackdrop: true,
      _classes: "thoughts-popup",
    });

    this.listenToOnce(Adapt, {
      "popup:closed": this.onPopupClosed,
    });
  }

  onPopupClosed() {
    this._isPopupOpen = false;
    this.setCompletionStatus();
  }

  restoreUserAnswers() {
    const storedAnswer = offlineStorage.get(this.model.get("_id"));

    if (!storedAnswer) return;

    this.setCompletionStatus();

    this.model.set("userAnswer", storedAnswer);
    this.model.set("_isSubmitted", true);

    this.$(".thoughts__input-textbox")
      .val(this.model.get("userAnswer"))
      .addClass("is-disabled")
      .attr("disabled", true);

    this.$(".btn__action").addClass("is-disabled").attr("disabled", true);

    if (this.model.get("_canShowFeedback")) {
      this.$(".btn__feedback")
        .attr("disabled", false)
        .removeClass("is-disabled");
    }

    this.updateCounter();
  }

  resetUserAnswers() {
    this.model.set("userAnswer", "");

    this.$(".thoughts__input-textbox").val("");

    this.model.set("_isSubmitted", false);

    this.$(".btn__action").addClass("is-disabled");

    this.$(".thoughts__input-textbox")
      .removeClass("is-disabled")
      .attr("disabled", false);

    if (this.model.get("_canShowFeedback")) {
      this.$(".btn__feedback").attr("disabled", true).addClass("is-disabled");
    }

    this.updateCounter();

    this.model.reset(true);

    offlineStorage.set(this.model.get("_id"), this.model.get("userAnswer"));
  }

  onInputChanged(event) {
    if (event) event.preventDefault();

    this.$(".btn__action").removeClass("is-disabled");

    this.updateCounter();
  }

  updateCounter() {
    if (!this.model.get("_characterLimit")) return;
    if (!this.model.get("_characterLimit")._isEnabled) return;

    const length = this.$(".thoughts__input-textbox").val().length;
    const max = this.model.get("_characterLimit")._max;
    const text = this.model.get("_characterLimit").text;
    const output = text + " " + (max - length);

    this.$(".thoughts__counter").html(output);
  }

  isCorrect() {
    // check "this.model.get('userAnswer')" against "this.model.get('_keywords')"
    // return true if the user's answer matches one of the keywords
    // return false if the user's answer does not match any of the keywords
    //     console.log(this.model.get('userAnswer'));
    //     console.log(this.model.get('_keywords'));
    // // mark the question as correct or incorrect
    //     if (this.model.get('userAnswer') == this.model.get('_keywords')) {
    //       this.model.set('_isCorrect', true);
    //     }
    //     else {
    //       this.model.set('_isCorrect', false);
    //     }
    //   console.log(this.model.get('_isCorrect');
    //     return this.model.get('_isCorrect');
  }

  // Time elapsed between the time the interaction was made available to the learner for response and the time of the first response
  getLatency() {
    return null;
  }

  /**
   * used by adapt-contrib-spoor to get the user's answers in the format required by the cmi.interactions.n.student_response data field
   * returns the user's answers as a string in the format 'answer1[,]answer2[,]answer3'
   * the use of [,] as an answer delimiter is from the SCORM 2004 specification for the fill-in interaction type
   */
  getResponse() {
    let userAnswer = this.model.get("userAnswer");
    let checkedAnswers = checkStringsInUserText(stringArray, userAnswer);
    let scormResponse = checkedAnswers
      .map((answer) => (answer ? "true" : "false"))
      .join("[,]");
    return scormResponse;
  }

  /**
   * used by adapt-contrib-spoor to get the type of this question in the format required by the cmi.interactions.n.type data field
   */
  getResponseType() {
    return "fill-in";
  }
}

ThoughtsView.template = "thoughts";

export default ThoughtsView;
