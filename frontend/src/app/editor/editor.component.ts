import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RegexHighlightInterface, Highlights, HighlightInterface, StartEndHighlightInterface} from "./highlighting";
import {HighlightTag} from "angular-text-input-highlight"

interface RangeElement{
  start:number;
  end:number;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EditorComponent implements OnInit {
  tags: HighlightTag[] = [];
  text:string= "#https://atom.io/packages/story\n" +
    "# @Felix -> Protagonist\n" +
    "#TODO: +Kamera ->Objekte die ausserhalb des Filmes sind\n" +
    "#TODO:  *DING -> Für Gegenstände\n" +
    "\n" +
    "/* A true Lie */\n" +
    "\n" +
    "\n" +
    "// DAY EXT 'Straße' 01\n" +
    "+Kamera filmt auf *Autospiegelanhänger man hört crashgeräusche.\n" +
    "+Kamera schnitt auf @Felix der als Unfallopfer auf der Straße liegt\n" +
    "\n" +
    "//DAY INT 'Haus'\n" +
    "+Kamera schwenkt über *Bilder die als Bildergalerie angeordnet sind\n" +
    "@Felix steht in einem Chaotischen Zimmer und räumt auf. @SeineFrau kommt herein\n" +
    "@Felix \"Irgendein Dialog um Beziehung zu zeigen (möglichst kurz aber deutlich)\"\n" +
    "@SeineFrau verlässt das Haus.\n" +
    "@Feix räumt weiter auf und findet darbei die *Autospiegelanhänger, er schaut verwundert und steckt diese ein.\n" +
    "\n" +
    "\n" +
    "\n" +
    "//EVENING INT 'Haus'";
  markedIndexes:number[]=[];


  constructor() {
  }

  ngOnInit(): void {
    this.onInput();
  }

  onInput() {
    this.tags = [];
    this.markedIndexes = [];
    this.createTagsFromHighlightArray(Highlights.highlighting);

  }
  private createTagsFromHighlightArray(array:HighlightInterface[],text=this.text,offset:number=0) {
    for (let i=0; i< array.length;i++) {
      let element = array[i];
      if ((<RegexHighlightInterface>element).regex) {
        this.handleRegex(<RegexHighlightInterface>element,text);
      } else if ((<StartEndHighlightInterface> element).start) {
        this.handleStartEnd(<StartEndHighlightInterface>element,text);
      }
    }
  }

  private handleStartEnd(element:StartEndHighlightInterface,text:string,offset:number=0) {
    let textarray = Array.from(text);
    let startOn:number = undefined;
    let content = "";
    for (let i=0;i<=textarray.length;i++) {
      let symbol = textarray[i];
      if (symbol == element.start && startOn==undefined) {
        startOn =  i;
      } else if (symbol==element.end && startOn!= undefined) {
        if (element.childes) {
          this.createTagsFromHighlightArray(element.childes,content,offset)
        }
        this.pushtags(startOn,i+1,content,element.cssName);
        startOn = undefined;
        content ="";
      }
      content+= symbol;
    }
    if (startOn!=undefined) {
      if (element.childes) {
        this.createTagsFromHighlightArray(element.childes,content,offset)
      }
      this.pushtags(startOn,text.length,content,element.cssName,offset);
    }


  }

  private handleRegex(element:RegexHighlightInterface, text:string,offset:number=0) {
    let group;
    while((group = element.regex.exec(text))) {
      this.pushtags(group.index,(group[0].length+group.index),group[0],element.cssName,offset);
    }
  }

  private pushtags(start:number,end:number,content:string,cssName:string,offset:number=0) {
    let markers = this.calculatePossibleMarkers(start,end,offset);
    markers.forEach((marker:RangeElement) => {
      console.log(cssName+" "+JSON.stringify(marker)+start+" "+end)
      this.tags.push({
        indices: {
          start: marker.start,
          end: marker.end
        },
        data: this.calculateContent(content,marker.start-offset,marker.end-offset),
        cssClass: cssName
      });
    });
  }

  //tries to find not yet market symbols in range
  private calculatePossibleMarkers(startPosition:number,endPosition:number,offset:number=0):RangeElement[] {
    let elements:RangeElement[]= [];
    let tmpelement:RangeElement = {start:undefined,end:undefined};
    let blockedNumbers:number[]=[];
    for (let i = startPosition+offset;i<=endPosition+offset;i++) {
      console.log(startPosition);
      if (!this.markedIndexes.includes(i)) {
        if (tmpelement.start== undefined) {
          tmpelement.start = i;
        } else if (tmpelement.end == undefined &&this.markedIndexes.includes(i+1)) {
          tmpelement.end =i;
          elements.push(tmpelement);
          tmpelement = {start:undefined,end:undefined}
        }
        blockedNumbers.push(i);
      }
    }
    if (tmpelement.end == undefined&& tmpelement.start!= undefined) {
      tmpelement.end = endPosition;
      elements.push(tmpelement);
    }
    //console.log("BLOCKEDL "+blockedNumbers);
    this.markedIndexes = this.markedIndexes.concat(blockedNumbers);

    return elements;
  }

  calculateContent(text:string,startSnippet:number,endSnippet:number):string {
    let textarray = Array.from(text);
    let result ="";
    for (let i= (startSnippet);i<= (endSnippet);i++) {
      result +=i;
    }
    return result;
  }
}










