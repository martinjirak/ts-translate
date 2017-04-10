import * as React from 'react';
import { Map } from 'immutable';
import { TranslationResult } from './types';
import { classifyKey } from './classifyKey';

export interface CntProps {
  content: TranslationResult;
  usedKey: string;
}

export interface CreateCnt {
  (key: string, result: TranslationResult): JSX.Element;
}

export const createCnt: CreateCnt = (key, result) => {
  class Cnt extends React.Component<CntProps, void> {
    render() {
      const { content, usedKey } = this.props;

      if (!content) {
        return null;
      }

      return (
        <span className={`cnt ${classifyKey(usedKey)}`} dangerouslySetInnerHTML={{ __html: `${content}` }} />
      );
    }
  }

  const cntInstace = <Cnt key={key} content={result} usedKey={key} />;

  return {
    ...cntInstace,
    toString: () => result
  } as JSX.Element;
};

export const memoizeCreateCnt = (fn: CreateCnt) => {
  let memoizeCache = Map<string, Map<TranslationResult, JSX.Element>>();
  return (key: string, result: TranslationResult): JSX.Element => {
    if (memoizeCache.hasIn([key, result])) return memoizeCache.getIn([key, result]);

    const newResult = fn(key, result);
    memoizeCache = memoizeCache.setIn([key, result], newResult);
    return newResult;
  };
};

export default memoizeCreateCnt(createCnt);