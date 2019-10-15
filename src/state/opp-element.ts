import OppBaseMixin from "./opp-base-mixin";
import MoreInfoMixin from "./more-info-mixin";
import SidebarMixin from "./sidebar-mixin";
import { dialogManagerMixin } from "./dialog-manager-mixin";
import NotificationMixin from "./notification-mixin";
import { LitElement } from 'lit-element';

const ext = <T>(baseClass: T, mixins): T =>
  mixins.reduceRight((base, mixin) => mixin(base), baseClass);

export class OppElement extends ext(OppBaseMixin(LitElement), [
    MoreInfoMixin,
    SidebarMixin,
    NotificationMixin,
    dialogManagerMixin,
]) {}