declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
  }
}

// global.d.ts
declare module '*.json' {
  const value: any
  export default value
}
declare module '@tarojs/taro' {
  interface PageConfig {
    /**
     * 是否启用分享给好友。
     *
     * @default false
     */
    enableShareAppMessage?: boolean
    /**
     * 是否启用分享到朋友圈。
     *
     * @default false
     */
    enableShareTimeline?: boolean
  }
}
