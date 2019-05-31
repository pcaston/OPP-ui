export default (superClass) =>
  class extends superClass {
    protected firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
      this.registerDialog({
        dialogShowEvent: "opp-notification",
        dialogTag: "notification-manager",
        dialogImport: () =>
          import(/* webpackChunkName: "notification-manager" */ "../managers/notification-manager"),
      });
    }
  };
