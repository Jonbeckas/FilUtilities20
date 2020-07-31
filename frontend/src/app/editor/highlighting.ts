export class Highlights {
  public  static highlighting:HighlightInterface[] = [
    <StartEndHighlightInterface>{cssName:"comment",start:"#",end:"\n"},
    <RegexHighlightInterface>{cssName:"character",regex:/@.+?(?= )/g},
    <RegexHighlightInterface>{cssName:"camera",regex:/\+.+?(?= )/g},
    <RegexHighlightInterface>{cssName:"thing",regex:/\*(.*?)(?= )(?!(.*?\/))/g},
    <RegexHighlightInterface>{cssName:"time",regex:/(DAY)|(NIGHT)|(EVENING)|(MORNING)|(NOON)/g},
    <RegexHighlightInterface>{cssName:"set",regex:/(EXT)|(INT)/g},
    <RegexHighlightInterface>{cssName:"scene",regex:/\/\//g},
    <RegexHighlightInterface>{cssName:"scene",regex:/\'(.*?)'/g},
    <StartEndHighlightInterface>{cssName:"speech",start:"\"",end:"\"",childes:[
        <StartEndHighlightInterface>{cssName:"regie",start:"\(",end:"\)"}
      ]},
    <RegexHighlightInterface>{cssName:"title",regex:/\/\*(.*?)\*\//g}

  ]
}
export interface HighlightInterface {
  cssName:string
}

export interface RegexHighlightInterface extends HighlightInterface{
  regex:RegExp,
}

export interface StartEndHighlightInterface extends HighlightInterface{
  start:string,
  end:string
  childes?: HighlightInterface[]
}

