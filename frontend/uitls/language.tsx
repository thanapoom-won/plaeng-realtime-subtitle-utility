export const languageSpeechTags=[
    {
        name : 'Thai',
        tag: 'th-TH'
    },
    {
        name : 'English (US)',
        tag: 'en-US'
    },
    {
        name : 'English (UK)',
        tag: 'en-GB'
    },
    {
        name : 'English (Australia)',
        tag: 'en-AU'
    },
    {
        name: 'English (India)',
        tag: 'en-IN'
    },
    {
        name: 'Japanese',
        tag: 'ja'
    },
    {
        name: 'Mandarin Chinese',
        tag: 'zh-CN'
    },
    {
        name: 'Taiwanese',
        tag: 'zh-TW'
    },
    {
        name: 'German',
        tag: 'de-DE'
    }
]
export const languageTranslateTag = [
    {
        name :'English',
        tag: 'en'
    },
    {
        name : 'Thai',
        tag : 'th'
    },
    {
        name: 'Japanese',
        tag: 'ja'
    },
    {
        name: 'Chinese (Simplified)',
        tag: 'zh-cn'
    },
    {
        name: 'Chinese (Traditional)',
        tag: 'zh-tw'
    },
    {
        name: 'German',
        tag: 'de'
    }
]

export const speechToTranslate : Map<string, string> = new Map([
    ['en-GB', 'en'],
    ['en-US', 'en'],
    ['en-AU','en'],
    ['en-IN','en'],
    ['th-TH','th'],
    ['ja','ja'],
    ['zh-CN','zh-cn'],
    ['zh-TW','zh-tw'],
    ['de-DE','de']
  ]);
export const defaultTranslateLanguage = languageTranslateTag[0].tag