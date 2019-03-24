
class DrawRules {

    currentChar : string;
    drawRulesMap: Map<string, Map<number, any>> = new Map<string, Map<number, any>>();

    constructor() { }

    createMap(probability : number, drawFunction : any, char: string){
      var probToFunctionMap: Map<number, any> = new Map<number, any>();
      probToFunctionMap.set(probability, drawFunction);
      this.drawRulesMap.set(char, probToFunctionMap);
    }

    //computing the draw rule almost the same as the exp rule
    computeDrawRule(){
      var probToFunctionMap: Map<number, any> = this.drawRulesMap.get(this.currentChar);
      var rand: number = Math.random();
      var drawRule: any;
      var cumulativeProb: number = 0.0;

      for (const prob of probToFunctionMap.keys()) {

        var isRandom = rand > cumulativeProb;
        var isValid = rand <= cumulativeProb + prob;
          if (isRandom && isValid) {
              drawRule = probToFunctionMap.get(prob);
          }
          cumulativeProb = cumulativeProb + prob;
      }
      return drawRule;
    }


    addDrawRule(char: string, prob: number, drawFunc: any) {
      var hasChar = this.drawRulesMap.has(char);
        if (hasChar) {
            this.drawRulesMap.get(char).set(prob, drawFunc);
        } else {
            this.createMap(prob, drawFunc, char);
        }
    }


    getDrawRule(char: string): any {
        if (this.drawRulesMap.has(char)) {
          this.currentChar = char;
            var drawRule = this.computeDrawRule();
            return drawRule;
        } else {
            return function() : void {};
        }

    }
}

export default DrawRules;
