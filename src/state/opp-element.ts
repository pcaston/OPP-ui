import OppBaseMixin from "./opp-base-mixin";
import AuthMixin from "./auth-mixin";
import MoreInfoMixin from "./more-info-mixin";
import SidebarMixin from "./sidebar-mixin";
import { dialogManagerMixin } from "./dialog-manager-mixin";
import { connectionMixin } from "./connection-mixin";
import NotificationMixin from "./notification-mixin";
import DisconnectToastMixin from "./disconnect-toast-mixin";
import { urlSyncMixin } from "./url-sync-mixin";
import { LitElement } from 'lit-element';

const ext = <T>(baseClass: T, mixins): T =>
  mixins.reduceRight((base, mixin) => mixin(base), baseClass);

export class OppElement extends ext(OppBaseMixin(LitElement), [
    AuthMixin,
    MoreInfoMixin,
    SidebarMixin,
    DisconnectToastMixin,
    connectionMixin,
    NotificationMixin,
    dialogManagerMixin,
]) {}

//export class OppElement extends ext(OppBaseMixin(LitElement), [
  //AuthMixin,
  //ThemesMixin,
  //TranslationsMixin,
  //MoreInfoMixin,
  //SidebarMixin,
  //DisconnectToastMixin,
  //connectionMixin,
  //NotificationMixin,
  //dialogManagerMixin,
  //urlSyncMixin,
//]) {}
