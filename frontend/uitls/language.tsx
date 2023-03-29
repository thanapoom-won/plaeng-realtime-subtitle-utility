export const languageSpeechTags=[
    {
        name : 'English (US)',
        tag: 'en-US'
    },
    {
        name : 'English (UK)',
        tag: 'en-GB'
    },
    {
        name : 'Thai',
        tag: 'th-TH'
    },
    {
        name : 'English (Australia)',
        tag: 'en-AU'
    },
]
export const languageTranslateTag = [
    {
        name :'English',
        tag: 'eng_Latn'
    },
    {
        name : 'Thai',
        tag : 'tha_Thai'
    }
]

export const speechToTranslate : Map<string, string> = new Map([
    ['en-GB', 'eng_Latn'],
    ['en-US', 'eng_Latn'],
    ['en-AU','eng_Latn'],
    ['th-TH','tha_Thai']
  ]);
export const defaultTranslateLanguage = languageTranslateTag[0].tag