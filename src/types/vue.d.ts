import App from "~/App.vue";
import API from "~/utils/API";
import { Modals, Popups } from '@sergtyapkin/modals-popups';
import { WS } from '@sergtyapkin/reconnecting-websocket';

type RequestHandler<ApiFoo> = (data: Awaited<ReturnType<ApiFoo>>['data'], status: number) => any

declare module 'vue' {
  interface ComponentCustomProperties {
    $app: App,
    $api: API,
    $isMobile: boolean,
    $ws: WS,
    $modals: typeof Modals,
    $popups: typeof Popups,
    $log: (...data: any[]) => void,
    $request: <APIFoo extends (...args: any) => any, Fallback>(
      context: { loading: boolean },
      apiRequest: APIFoo,
      args: Parameters<APIFoo>,
      errorText: string,
      callback?: RequestHandler<APIFoo>,
      toFallbackValue?: Fallback,
      errorCallbacks?: {[key: number]: RequestHandler<APIFoo>} | RequestHandler<APIFoo>,
    ) => Promise<Awaited<ReturnType<APIFoo>>['data'] | Fallback>,
  }
}
