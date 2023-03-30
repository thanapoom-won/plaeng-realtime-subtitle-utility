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
]
export const languageTranslateTag = [
    {
        name :'English',
        tag: 'en'
    },
    {
        name : 'Thai',
        tag : 'th'
    }
]

export const speechToTranslate : Map<string, string> = new Map([
    ['en-GB', 'en'],
    ['en-US', 'en'],
    ['en-AU','en'],
    ['th-TH','th']
  ]);
export const defaultTranslateLanguage = languageTranslateTag[0].tag