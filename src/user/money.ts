/**
 *   Wechaty Chatbot SDK - https://github.com/wechaty/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import { interfaceOfClass, looseInstanceOfClass } from 'clone-class'
import type { Constructor } from '../deprecated/clone-class.js'

import {
  EmptyBase,
  wechatifyMixin,
}                       from './mixins/wechatify.js'

class MoneyImpl extends wechatifyMixin(EmptyBase) {

  /*
   * @hideconstructor
   */
  constructor () {
    super()
  }

}

interface Money extends MoneyImpl {}
type MoneyConstructor = Constructor<
  Money,
  typeof MoneyImpl
>

const interfaceOfMoney  = interfaceOfClass(MoneyImpl)<Money>()
const instanceOfMoney   = looseInstanceOfClass(MoneyImpl)
const validMoney = (o: any): o is Money =>
  instanceOfMoney(o) && interfaceOfMoney(o)

export type {
  MoneyConstructor,
  Money,
}
export {
  MoneyImpl,
  interfaceOfMoney,
  instanceOfMoney,
  validMoney,
}
